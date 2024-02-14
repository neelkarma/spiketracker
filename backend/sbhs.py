import urllib
from typing import Literal, TypedDict

import requests
from flask import current_app
from requests.models import PreparedRequest

SBHS_API_BASE = "https://student.sbhs.net.au/api"
TOKEN_URL = SBHS_API_BASE + "/token"
AUTH_URL = SBHS_API_BASE + "/authorize"
USER_INFO_URL = SBHS_API_BASE + "/details/userinfo.json"


class TokenEndpointResponse(TypedDict):
    token_type: Literal["Bearer"]
    expires_in: int
    access_token: str
    refresh_token: str


def get_authorization_url(state: str) -> str:
    """
    Returns the URL to redirect the user to for SBHS OAuth.

    Params
    ------
    state: str
        The state parameter to send to SBHS OAuth.
    """

    req = PreparedRequest()
    req.prepare_url(
        AUTH_URL,
        {
            "response_type": "code",
            "client_id": current_app.config["CLIENT_ID"],
            "redirect_uri": current_app.config["BACKEND_BASE"] + "/auth/login/sbhs/cb",
            "scope": "all-ro",
            "state": state,
        },
    )
    return req.url


def refresh_token_set(refresh_token: str) -> TokenEndpointResponse:
    """
    Refreshes the access and refresh tokens using an existing refresh token.

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
        TOKEN_URL,
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


def get_student_id(access_token: str) -> int:
    """
    Gets the student ID associated with the given access token.

    Params
    ------
    access_token: str
        The access token to use.

    Returns
    -------
    int
        The student ID.

    Raises
    ------
    ValueError
        If the request to the user info endpoint fails.
    """

    res = requests.get(
        USER_INFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if res.status_code != 200:
        raise ValueError(f"Failed to get user info. API Response: {res.text}")

    return int(res.json()["studentId"])
