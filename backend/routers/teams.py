import json

from flask import Blueprint, jsonify

from backend.db import get_db

teams = Blueprint("/teams", __name__)


@teams.get("/<id>")
def get_team_data(id: int):
    cur = get_db()
    data = cur.execute("SELECT * FROM teams WHERE id = ?", (id,)).fetchone()
    player_ids = cur.execute(
        "SELECT player_id FROM team_players WHERE team_id = ?", (id,)).fetchall()
    
    match_points = cur.execute("SELECT points FROM matches WHERE team_id = ?", (id,)).fetchall()
    wins = 0
    losses = 0
    for points in match_points:
        points = json.loads(points)
        set_wins = 0
        set_losses = 0
        for set_points in points:
            if set_points["our"] > set_points["opp"]:
                set_wins += 1
            else:
                set_losses += 1
        if set_wins > set_losses:
            wins += 1
        else:
            losses += 1

    if data is None:
        return "Not Found", 404
    

    
    return jsonify(
        {
            "id": id,
            "name": data["name"],
            "wins": wins,
            "losses": losses,
            "setRatio": data["setRatio"],
            "kr": data["kr"],
            "pef": data["pef"],
            "player_ids": player_ids,
            "visible": data["visible"]
        }
    )    
    # TODO: incomplete

@teams.delete("/<id>")
def delete_team(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "You a student", 401

    con = get_db()
    con.execute("DELETE FROM teams WHERE id = ?", (id,))

    return "Success", 200