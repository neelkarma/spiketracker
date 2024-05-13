import os

from db import get_db
from flask import Blueprint, current_app, jsonify, make_response, redirect, request
from sbhs import get_authorization_url, refresh_token_set, verify_id_token
from session import (
    get_session,
    session_token_payload_from_admin,
    session_token_payload_from_player,
    sign_session_token,
)

auth = Blueprint("auth", __name__)

STATE_COOKIE = "SBHS-State"


@auth.get("/logout")
def logout():
    """Logout endpoint for both players and admins."""

    res = make_response()
    res.delete_cookie("Authorization")
    return res


@auth.get("/login/sbhs")
def login_sbhs():
    """Login endpoint for players. Redirects to SBHS OAuth."""

    state = os.urandom(16).hex()
    print(get_authorization_url(state))
    res = make_response(redirect(get_authorization_url(state)))
    res.set_cookie(STATE_COOKIE, state, max_age=60 * 60, httponly=True)
    return res


@auth.get("/login/sbhs/cb")
def login_sbhs_callback():
    """Callback endpoint for SBHS OAuth. Redirects back to the frontend with a session token."""

    # verify the state param - this protects against xss attacks
    state = request.args.get("state")
    if state != request.cookies.get(STATE_COOKIE):
        return jsonify({"success": False, "reason": "Invalid state param"}), 403

    # retrieve refresh token from url search params
    code = request.args.get("code")
    if code is None:
        return (
            jsonify({"success": False, "reason": "No code returned from SBHS API"}),
            403,
        )

    # exchange code for id token
    token_set = refresh_token_set(code)
    id_token = token_set["id_token"]
    id_token_payload = verify_id_token(id_token)

    # check that the student is registered
    student_id = int(id_token_payload["student_id"])
    con = get_db()
    student = con.execute(
        "SELECT id FROM players WHERE id = ?", (student_id,)
    ).fetchone()
    if student is None:
        return jsonify({"success": False, "reason": "Student not registered"}), 403

    # generate session token
    payload = session_token_payload_from_player(student_id)
    session_token = sign_session_token(payload)

    # set the session token cookie and redirect the user back to the frontend
    res = make_response(redirect(current_app.config["FRONTEND_BASE"]))
    res.set_cookie(
        "Authorization",
        f"Bearer {session_token}",
        max_age=90 * 24 * 60 * 60,
        httponly=True,
        samesite="Lax",
    )

    return res


@auth.post("/login/admin")
def login_admin():
    """Login endpoint for admins (i.e. coaches/volleyball prefect)"""

    password = request.json.get("password")

    # check password
    if password is None:
        return jsonify({"success": False, "reason": "No password provided"}), 400

    if password != current_app.config["ADMIN_PASSWORD"]:
        return jsonify({"success": False, "reason": "Invalid password"}), 401

    # generate session token
    payload = session_token_payload_from_admin()
    session_token = sign_session_token(payload)

    # set session token and return response
    res = make_response(jsonify({"success": True}))
    res.set_cookie(
        "Authorization",
        f"Bearer {session_token}",
        max_age=90 * 24 * 60 * 60,
        httponly=True,
        samesite="Lax",
    )

    return res


@auth.get("/status")
def status():
    """
    Auth status endpoint - provides:
    - whether the user is authorized
    - whether the user is an admin
    - the student id (if the user is a student)
    """

    session = get_session()
    if session is None:
        return jsonify({"authorized": False})

    # if the token is an admin token, we can return early
    if session["admin"]:
        return jsonify({"authorized": True, "admin": True})

    # otherwise, we have to check whether the student is registered
    con = get_db()
    data = con.execute(
        "SELECT id FROM players WHERE id = ?", (session["id"],)
    ).fetchone()

    if data is None:
        return jsonify({"authorized": False})

    # if registered, we return the student id
    return jsonify({"authorized": True, "admin": False, "id": session["id"]})
