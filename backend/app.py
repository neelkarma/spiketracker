import os
import sys
import logging

from dotenv import load_dotenv
from flask import Flask
from routers.auth import auth
from routers.match import match
from routers.matches import matches
from routers.player import player
from routers.players import players
from routers.stats import stats
from routers.team import team
from routers.teams import teams
from session import get_session

app = Flask(__name__)

app.register_blueprint(auth)
app.register_blueprint(team)
app.register_blueprint(player)
app.register_blueprint(match)
app.register_blueprint(stats)
app.register_blueprint(teams)
app.register_blueprint(players)
app.register_blueprint(matches)

if os.environ.get("FLASK_ENV") == "production":
    load_dotenv(".env.prod")
else:
    load_dotenv(".env.dev")

app.config.from_prefixed_env()


@app.after_request
def after_request(response):
    # fuck cors
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


@app.get("/ping")
def ping():
    print(get_session())
    return "pong", 200


if __name__ == "__main__":
    app.run(debug="--debug" in sys.argv)
