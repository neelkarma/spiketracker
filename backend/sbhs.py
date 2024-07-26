from typing import Any, Literal, TypedDict

import jwt
import requests
from flask import current_app
from jwt.api_jwk import PyJWK
from requests.models import PreparedRequest


class TokenEndpointResponse(TypedDict):
    token_type: Literal["Bearer"]
    expires_in: int
    access_token: str
    refresh_token: str
    id_token: str


sbhs_openid_config = requests.get(
    "https://auth.sbhs.net.au/.well-known/openid-configuration"
).json()
signing_algos = sbhs_openid_config["id_token_signing_alg_values_supported"]


def get_authorization_url(state: str) -> str:
    """
    Generates the SBHS OAuth authorization URL to redirect the user to upon player login.

    Params
    ------
    state: str
        The state parameter to send to SBHS OAuth.

    Returns
    -------
    str
        The URL to redirect the user to.
    """

    req = PreparedRequest()
    req.prepare_url(
        sbhs_openid_config["authorization_endpoint"],
        {
            "response_type": "code",
            "client_id": current_app.config["CLIENT_ID"],
            "redirect_uri": current_app.config["BACKEND_BASE"] + "/auth/login/sbhs/cb",
            "scope": "openid profile",
            "state": state,
        },
    )
    assert req.url is not None  # appease typechecker
    return req.url


def refresh_token_set(refresh_token: str) -> TokenEndpointResponse:
    """
    Refreshes access and refresh tokens using an existing refresh token.

    Params
    ------
    refresh_token: str
        The refresh token to use.

    Returns
    -------
    TokenEndpointResponse
        The new token set.

    Raises
    ------
    ValueError
        If the request to the token endpoint fails.
    """

    res = requests.post(
        sbhs_openid_config["token_endpoint"],
        data={
            "grant_type": "authorization_code",
            "client_id": current_app.config["CLIENT_ID"],
            "client_secret": current_app.config["CLIENT_SECRET"],
            "redirect_uri": current_app.config["BACKEND_BASE"] + "/auth/login/sbhs/cb",
            "code": refresh_token,
        },
    )

    if res.status_code != 200:
        raise ValueError(f"Refreshing Token Failed. API Response: {res.text}")

    return res.json()


def get_signing_key(kid: str) -> PyJWK | None:
    """
    Gets the SBHS JWT signing key.

    Params
    ------
    kid: str
        The kid (key id) of the signing key.

    Returns
    -------
    PyJWK | None
        The signing key if found.
    """
    keys = requests.get(sbhs_openid_config["jwks_uri"]).json()["keys"]

    key_obj = None

    for key in keys:
        if key["kid"] == kid:
            key_obj = key
            break

    if key_obj is None:
        return None

    return PyJWK(key_obj)


def verify_id_token(id_token: str) -> dict[str, Any]:
    """
    Verifies an SBHS OIDC id token and returns the payload if valid, raises an exception otherwise.

    Params
    ------
    id_token: str
        The id token to verify.

    Returns
    -------
    dict[str, Any]
        The payload of the id token.

    Raises
    ------
    jwt.InvalidTokenError
        If the token is invalid.
    """

    unverified = jwt.api_jwt.decode_complete(
        id_token,
        options={
            "verify_signature": False,
        },
    )
    kid = unverified["header"]["kid"]

    key = get_signing_key(kid)
    if key is None:
        raise jwt.InvalidTokenError("Failed to retrieve JWT signing key")

    return jwt.decode(
        id_token,
        algorithms=signing_algos,
        key=key.key,
        audience=current_app.config["CLIENT_ID"],
    )
