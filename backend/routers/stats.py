from sqlite3 import DatabaseError

from db import get_db
from flask import Blueprint, jsonify, request
from session import get_session

stats = Blueprint("stats", __name__, url_prefix="/stats")


@stats.get("/")
def query_stats_bulk():
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    match_id = request.args.get("match_id")
    team_id = request.args.get("team_id")
    player_id = request.args.get("player_id")

    if match_id is None and team_id is None and player_id is None:
        return "No params given", 400

    if match_id is not None:
        if match_id.isdigit():
            match_id = int(match_id)
        else:
            return "match_id must be an integer", 400
    if team_id is not None:
        if team_id.isdigit():
            team_id = int(team_id)
        else:
            return "team_id must be an integer", 400
    if player_id is not None:
        if player_id.isdigit():
            player_id = int(player_id)
        else:
            return "player_id must be an integer", 400

    con = get_db()
    sql = """
        SELECT * FROM stats
        INNER JOIN matches ON stats.match_id = matches.id
        INNER JOIN players ON stats.player_id = players.id
        WHERE (? = 1 OR stats.match_id = ?)
            AND (? = 1 OR matches.team_id = ?)
            AND (? = 1 OR stats.player_id = ?)
        """
    data = con.execute(
        sql,
        (
            int(match_id is None),
            match_id,
            int(team_id is None),
            team_id,
            int(player_id is None),
            player_id,
        ),
    ).fetchall()
    con.close()

    return jsonify(
        [
            {
                "playerId": row["playerId"],
                "matchId": row["matchId"],
                "action": row["action"],
                "rating": row["rating"],
                "from": [row["fromX"], row["fromY"]],
                "to": [row["toX"], row["toY"]],
            }
            for row in data
        ]
    ), 200


@stats.put("/<match_id>")
def edit_match_stats(match_id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    con = get_db()
    match_data = con.execute(
        "SELECT scoring FROM matches WHERE id = ?", (match_id,)
    ).fetchone()

    if match_data is None:
        return "Not Found", 404

    if not (match_data["scoring"] or session["admin"]):
        return "Forbidden", 403

    data = request.get_json()

    try:
        con.execute("DELETE FROM stats WHERE matchId = ?", (match_id,))

        sql = """
            INSERT INTO stats (playerId, matchId, action, rating, fromX, fromY, toX, toY)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """

        con.executemany(
            sql,
            [
                (
                    stat["playerId"],
                    match_id,
                    stat["action"],
                    stat["rating"],
                    stat["from"][0],
                    stat["from"][1],
                    stat["to"][0],
                    stat["to"][1],
                )
                for stat in data
            ],
        )

        con.commit()
        con.close()

        return jsonify({"success": True}), 200
    except (DatabaseError, KeyError) as e:
        print(e, flush=True)
        con.rollback()
        con.close()

        return jsonify({"success": False}), 400


@stats.get("/overall")
def get_overall_stats():
    session = get_session()
    if session is None:
        return "Unauthorized", 401
    if not session["admin"]:
        return "Forbidden", 403

    con = get_db()

    sql = """
        SELECT count(*) AS count
        FROM matches
    """
    num_matches = con.execute(sql).fetchone()["count"]

    sql = """
        SELECT count(*) AS count
        FROM teams
    """
    num_teams = con.execute(sql).fetchone()["count"]

    sql = """
        SELECT count(*) AS count
        FROM players
    """
    num_players = con.execute(sql).fetchone()["count"]

    sql = """
        SELECT rating, count(*) AS count
        FROM stats
        WHERE
            action = ?
    """

    ratings = con.execute(sql, ("attack",)).fetchall()

    total_attacks = 0
    successful_attacks = 0

    for atkrow in ratings:
        total_attacks += atkrow["count"]
        if atkrow["rating"] == 3:
            successful_attacks += atkrow["count"]

    kr = successful_attacks / total_attacks if total_attacks > 0 else 0

    total_passes = 0
    successful_passes = 0

    for passrow in ratings:
        total_passes += passrow["count"]
        if passrow["rating"] == 3:
            successful_passes += passrow["count"]

    pef = successful_passes / total_passes if total_passes > 0 else 0

    return jsonify(
        {
            "players": num_players,
            "teams": num_teams,
            "matches": num_matches,
            "kr": kr,
            "pef": pef,
            "points": successful_attacks,
        }
    ), 200
