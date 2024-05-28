from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

players = Blueprint("players", __name__)


@players.put()
def create_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    data = request.get_json()  # get data from user inputs

    first_name = data["firstNameInput"]
    last_name = data["surnameInput"]
    grad_year = data["gradYear"]
    visible = data["visible"]

    cur = get_db()
    cur.execute(
        "INSERT INTO players (firstName, lastName, gradYear, visible) VALUES (?, ?, ?, ?, ?)",
        (first_name, last_name, grad_year, visible),
    )
    cur.commit()
    cur.close()

    return jsonify({"success": True}), 200


@players.get("/<id>")
def get_player(id: int):
    cur = get_db()
    data = cur.execute("SELECT * FROM players WHERE id = ?", (id,)).fetchone()
    stats = cur.execute("SELECT * FROM playerStats WHERE id = ?", (id,)).fetchone()
    team_ids = cur.execute(
        "SELECT teamId FROM playerTeams WHERE playerId = ?", (id,)
    ).fetchall()

    teams = []
    for team_id in team_ids:
        team_id = team_id["teamId"]
        team = cur.execute("SELECT name FROM teams WHERE id = ?", team_id).fetchone()
        teams.append({"id": team_id, "name": team["name"]})

    cur.close()

    return jsonify(
        {
            "id": id,
            "firstName": data["firstName"],
            "surname": data["surname"],
            "gradYear": data["gradYear"],
            "teams": data["teams"],
            # "ppg": data["ppg"],
            # "kr": data["kr"],
            # "pef": data["pef"],
            "totalPoints": data["totalPoints"],
            "visible": data["visible"],
        }
    )


@players.post("/<id>")
def edit_player(id: int):
    session = get_session()

    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    data = request.get_json()

    cur = get_db()
    cur.execute(
        "UPDATE players SET firstName = ?, lastName = ?, gradYear = ?, visible = ? WHERE id = ?",
        (data["firstName"], data["surname"], data["gradYear"], data["visible"]),
    )
    cur.commit()
    cur.close()

    return jsonify({"success": True}), 200


@players.delete("/<id>")
def delete_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "Forbidden", 403

    cur = get_db()
    cur.execute("DELETE FROM players WHERE id = ?", (id,))
    cur.commit()
    cur.close()

    return jsonify({"success": True}), 200
