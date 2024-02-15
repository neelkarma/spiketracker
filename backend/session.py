from datetime import datetime
from typing import Literal, TypedDict

import jwt
from flask import current_app, request


class AdminSessionTokenPayload(TypedDict):
    admin: Literal[True]
    exp: int


class PlayerSessionTokenPayload(TypedDict):
    admin: Literal[False]
    id: int
    exp: int


SessionTokenPayload = AdminSessionTokenPayload | PlayerSessionTokenPayload


def session_token_payload_from_player(student_id: int) -> PlayerSessionTokenPayload:
    return {
        "admin": False,
        "id": student_id,
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
