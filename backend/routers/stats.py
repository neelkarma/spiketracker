from db import get_db

# from flask import Blueprint, jsonify
from flask import Blueprint, jsonify, request

stats = Blueprint("/stats", __name__)


@stats.get("/")
def get_player_data():
    match_id = request.args.get("match_id")
    team_id = request.args.get("team_id")
    player_id = request.args.get("player_id")
    if match_id is None and team_id is None and player_id is None:
        return "No params given"
    if match_id is None:
        match_id = "*"
    if team_id is None:
        team_id = "*"
    if player_id is None:
        player_id = "*"
    cur = get_db()

    data = cur.execute(
        "SELECT stats.id FROM stats INNER JOIN stats ON s.match_id = matches.id INNER JOIN stats ON stats.player_id = players.id WHERE stats.match_id = ? AND matches.team_id = ? AND stats.player_id = ?",
        (match_id, team_id, player_id),
    ).fetchall()

    return jsonify(data)
