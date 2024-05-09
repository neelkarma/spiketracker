from db import get_db
from flask import Blueprint, jsonify
from session import get_session

players = Blueprint("players", __name__)


@players.get("/<id>")
def get_player_data(id: int):
    cur = get_db()
    data = cur.execute("SELECT * FROM players WHERE id = ?", (id,)).fetchone()
    stats = cur.execute("SELECT * FROM player_stats WHERE id = ?", (id,)).fetchone()
    team_ids = cur.execute(
        "SELECT team_id FROM player_teams WHERE player_id = ?", (id,)
    ).fetchall()

    teams = []
    for team_id in team_ids:
        team_id = team_id["team_id"]
        team = cur.execute("SELECT name FROM teams WHERE id = ?", team_id).fetchone()
        teams.append({"id": team_id, "name": team["name"]})

    return jsonify(
        {
            "id": id,
            "firstName": data["first_name"],
            "surname": data["surname"],
            "gradYear": data["gradYear"],
            "teams": data["teams"],
            "ppg": data["ppg"],
            "kr": data["kr"],
            "pef": data["pef"],
            "totalPoints": data["totalPoints"],
            "visible": data["visible"]
        }
    )


@players.delete("/<id>")
def delete_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "You a student", 401

    con = get_db()
    con.execute("DELETE FROM players WHERE id = ?", (id,))

    return "Success", 200
