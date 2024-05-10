from db import get_db
from flask import Blueprint, jsonify
from session import get_session

matches = Blueprint("/matches", __name__)

@matches.delete("/<id>")
def delete_match(id: int):
    session = get_session()
    if session is None:
        return "Unauthorized", 401

    if not session["admin"]:
        return "You a student", 401

    con = get_db()
    con.execute("DELETE FROM matches WHERE id = ?", (id,))

    return "Success", 200

@matches.get("/<id>")
def get_match_data(id: int):
    cur = get_db()
    data = cur.execute("SELECT * FROM matches WHERE id = ?", (id,)).fetchone()
    if data is None:
        return "Not Found", 404
    
    # TODO: incomplete
    
    jsonify(
        {
            "id": data["id"],
            "ourTeamId": data["ourTeamId"],
            "ourTeamName": data["ourTeamName"],
            "oppTeamName:": data["oppTeamName"],
            "location": data["location"],
            "date": data["date"],
            "pointsOverriden": data["pointsOverriden"],
            "points": data["points"],
            "visible": data["visible"],
            "scoring": data["scoring"]
        }
    )

    @matches.post("/<id>")
    def get_attribute_to_edit(value: str):
        pass
    def get_new_value(value: int):
        pass

    def update_matches(id: int):
        session = get_session()
        if session is None:
            return "Unauthorized", 401
        
        if not session['admin']:
            return "You are a student", 401
    
        attribute = get_attribute_to_edit()
        new_value = get_new_value()
        con = get_db()
        con.execute("UPDATE matches SET ? = ? WHERE id = ?", (attribute, new_value, id)) 
        
        return "Success", 200