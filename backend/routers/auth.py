import os

from flask import Blueprint, current_app, jsonify, make_response, redirect, request

from backend.db import get_db
from backend.sbhs import get_authorization_url, get_student_id, refresh_token_set
from backend.session import (
    get_session,
    session_token_payload_from_admin,
    session_token_payload_from_oauth,
    sign_session_token,
)

auth = Blueprint("auth", __name__)

STATE_COOKIE = "SBHS-State"


@auth.get("/logout")
def logout():
    res = make_response()
    res.delete_cookie("Authorization")
    return res


@auth.get("/login/sbhs")
def login_sbhs():
    state = os.urandom(16).hex()
    print(get_authorization_url(state))
    res = make_response(redirect(get_authorization_url(state)))
    res.set_cookie(STATE_COOKIE, state, max_age=60 * 60, httponly=True)
    return res


@auth.get("/login/sbhs/cb")
def login_sbhs_callback():
    # verify the state param - this protects against xss attacks
    state = request.args.get("state")
    if state != request.cookies.get(STATE_COOKIE):
        return jsonify({"success": False, "reason": "Invalid state param"}), 403

    # retrieve refresh token from url search params
    refresh_token = request.args.get("code")
    if refresh_token is None:
        return (
            jsonify(
                {"success": False, "reason": "No auth code returned from SBHS API"}
            ),
            403,
        )

    # get a new token set (includes access token) with refresh token
    token_set = refresh_token_set(refresh_token)

    # check that the student is registered
    student_id = get_student_id(token_set["access_token"])
    con = get_db()
    student = con.execute(
        "SELECT id FROM players WHERE id = ?", (student_id,)
    ).fetchone()
    if student is None:
        return jsonify({"success": False, "reason": "Student not registered"}), 403

    # create a session token
    payload = session_token_payload_from_oauth(token_set)
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
