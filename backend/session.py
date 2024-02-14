from datetime import datetime
from typing import TypedDict

import jwt
from flask import current_app, request

from backend.sbhs import TokenEndpointResponse, get_student_id


class AdminSessionTokenPayload(TypedDict):
    admin: True
    exp: int


class PlayerSessionTokenPayload(TypedDict):
    admin: False
    id: int
    access_token: str
    access_exp: int
    refresh_token: str
    exp: int


SessionTokenPayload = AdminSessionTokenPayload | PlayerSessionTokenPayload


def session_token_payload_from_oauth(
    token_set: TokenEndpointResponse,
) -> PlayerSessionTokenPayload:
    """
    Returns the payload for a player session token from the token set.

    Params
    ------
    token_set: TokenEndpointResponse
        The token set from the OAuth token endpoint.

    Returns
    -------
    PlayerSessionTokenPayload
        The payload for a player session token.
    """

    id = get_student_id(token_set["access_token"])

    return {
        "admin": False,
        "id": id,
        "access_token": token_set["access_token"],
        "access_exp": int(datetime.now().timestamp()) + token_set["expires_in"],
        "refresh_token": token_set["refresh_token"],
        # 90 days - refresh token expiry
        "exp": int(datetime.now().timestamp()) + 90 * 24 * 60 * 60,
    }


def session_token_payload_from_admin() -> AdminSessionTokenPayload:
    """
    Returns the payload for an admin session token.

    Returns
    -------
    AdminSessionTokenPayload
        The payload for an admin session token.
    """

    return {
        "admin": True,
        # 90 days, just to be consistent with player session expiry
        "exp": int(datetime.now().timestamp()) + 90 * 24 * 60 * 60,
    }


def sign_session_token(payload: SessionTokenPayload) -> str:
    """
    Signs the session token using the session secret.

    Params
    ------
    payload: SessionTokenPayload
        The payload to sign.

    Returns
    -------
    str
        The signed session token.
    """

    return jwt.encode(payload, current_app.config["SESSION_SECRET"])


def verify_session_token(token: str) -> SessionTokenPayload:
    """
    Verifies the session token and returns the payload if valid, raises an exception otherwise.

    Params
    ------
    token: str
        The session token to verify.

    Returns
    -------
    SessionTokenPayload
        The payload of the session token.

    Raises
    ------
    jwt.InvalidTokenError
        If the token is invalid.
    """

    return jwt.decode(token, current_app.config["SESSION_SECRET"], algorithms=["HS256"])


def get_session() -> SessionTokenPayload | None:
    """
    Returns the session token payload from the Authorization cookie.

    This is essentially a nice utility that you would've had to write in almost every endpoint anyways.

    Returns
    -------
    SessionTokenPayload | None
        The session token payload, or None if anything went wrong.
    """

    token = request.cookies.get("Authorization")
    if token is None:
        return None

    token_split = token.split()
    if len(token_split) == 1:
        return None

    token = token_split[1]

    try:
        return verify_session_token(token)
    except jwt.InvalidTokenError:
        return None
