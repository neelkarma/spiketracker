from db import get_db
from flask import Blueprint, jsonify, request
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
            #"ppg": data["ppg"],
            #"kr": data["kr"],
            #"pef": data["pef"],
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
        return "You are a student", 401

    con = get_db()
    con.execute("DELETE FROM players WHERE id = ?", (id,))

    return "Success", 200

@players.post("/<id>")
def post_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session['admin']:
        return "You are a student", 401
    
    data = request.get_json()
    
    con = get_db()
    con.execute("UPDATE players SET first_name = ?, last_name = ?, grad_year = ?, visible = ? WHERE id = ?", 
                (data["firstName"], data["surname"], data["gradYear"], data["visible"])) 

    return "Success", 200

@players.put(" /<id>")
def put_player(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session['admin']:
        return "You are a student", 401
    
    data = request.get_json(f"http://localhost:5173/app/players/edit/{id}") #get data from user inputs
    
    id = data["id"]
    first_name = data["firstNameInput"]
    last_name = data["surnameInput"]
    grad_year = data[""]
    positions = data[[""]]
    visible = data[""]
    con = get_db()
    con.execute("INSERT INTO players (id, first_name, last_name, grad_year, positions, visible) VALUES (?, ?, ?, ?, ?)", (id, first_name, last_name, grad_year, positions, visible))
    
