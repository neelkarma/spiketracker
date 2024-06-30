from sqlite3 import DatabaseError

from db import get_db
from flask import Blueprint, json, jsonify, request

from session import get_session

matches = Blueprint("/matches", __name__)


@matches.get("/")
def get_teams():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    query = request.args.get("q", "")
    sort_by = request.args.get("sort", "name")
    reverse = request.args.get("reverse", "0") == "1"

    try:
        cur = get_db()

        sql = """
            SELECT
                matches.id,
                matches.teamId as ourTeamId, 
                teams.name as ourTeamName,
                matches.oppName as oppTeamName,
                matches.location,
                matches.time,
                matches.points,
                matches.visible,
                matches.scoring
            FROM matches
            INNER JOIN teams ON team.id = matches.teamId
            WHERE
                teams.name LIKE ?
                OR matches.oppName LIKE ?
                OR matches.id = ?
                OR teams.id = ?
        """

        matches = cur.execute(
            sql,
            (
                "%" + query + "%",
                "%" + query + "%",
                int(query) if query.isdecimal() else -1,
                int(query) if query.isdecimal() else -1
            ),
        ).fetchall()

        matches = [{**row, "points": json.loads(row["points"])} for row in matches]
        matches.sort(key=lambda row: row[sort_by], reverse=reverse)

        return jsonify(matches), 200
    except (DatabaseError, KeyError):
        return "Invalid Input", 400
