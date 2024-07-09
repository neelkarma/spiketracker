from datetime import datetime

from db import get_db
from flask import Blueprint, json, jsonify, request
from session import get_session

matches = Blueprint("matches", __name__, url_prefix="/matches")


@matches.get("/")
def get_matches():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    query = request.args.get("q", "")
    sort_by = request.args.get("sort", "time")
    reverse = request.args.get("reverse", "0") == "1"

    con = get_db()

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
        INNER JOIN teams ON teams.id = matches.teamId
        WHERE
            teams.name LIKE ?
            OR matches.oppName LIKE ?
            OR matches.location LIKE ?
            OR matches.id = ?
            OR teams.id = ?
    """

    matches = con.execute(
        sql,
        (
            "%" + query + "%",
            "%" + query + "%",
            "%" + query + "%",
            int(query) if query.isdecimal() else -1,
            int(query) if query.isdecimal() else -1,
        ),
    ).fetchall()

    if not session["admin"]:
        matches = filter(lambda row: row["visible"] == 1, matches)

    matches = [
        {
            **row,
            "points": json.loads(row["points"]),
            "visible": bool(row["visible"]),
            "scoring": bool(row["scoring"]),
        }
        for row in matches
    ]

    matches.sort(
        key=lambda row: datetime.fromisoformat(row[sort_by]).timestamp()
        if sort_by == "time"
        else row[sort_by],
        reverse=reverse,
    )

    con.close()

    return jsonify(matches), 200


@matches.get("/lockdown")
def lockdown():
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    con = get_db()
    sql = """
        UPDATE matches
        SET scoring = 0;
    """
    con.execute(sql)
    con.commit()

    return jsonify({"success": True}), 200
