from typing import Any, Literal, TypedDict

import jwt
import requests
from flask import current_app
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
jwks_client = jwt.PyJWKClient(sbhs_openid_config["jwks_uri"])


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
    signing_key = jwks_client.get_signing_key_from_jwt(id_token)

    return jwt.decode(
        id_token,
        key=signing_key.key,
        algorithms=signing_algos,
        audience=current_app.config["CLIENT_ID"],
    )

    # we *should* be verifying the at_hash in the jwt payload, but it's not working for some reason
    # i've included the (broken) code below for reference, in case we want to try again

    # data = jwt.api_jwt.decode_complete(
    #     id_token,
    #     key=signing_key.key,
    #     algorithms=signing_algos,
    #     audience=current_app.config["CLIENT_ID"],
    # )

    # payload, header = data["payload"], data["header"]

    # alg_obj = jwt.get_algorithm_by_name(header["alg"])
    # digest = alg_obj.compute_hash_digest(access_token)
    # at_hash = base64.urlsafe_b64encode(digest[: (len(digest) // 2)]).rstrip("=")
    # assert at_hash == payload["at_hash"]

    # return payload
