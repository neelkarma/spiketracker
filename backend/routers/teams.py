from flask import Blueprint

from backend.db import get_db

teams = Blueprint("/teams", __name__)


@teams.get("/<id>")
def get_team_data(id: int):
    cur = get_db()
    data = cur.execute("SELECT * FROM teams WHERE id = ?", (id,)).fetchone()
    player_ids = cur.execute(
        "SELECT player_id FROM team_players WHERE team_id = ?", (id,)
    ).fetchall()
    if data is None:
        return "Not Found", 404

    # TODO: incomplete
