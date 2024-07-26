import os
import sys
import logging

from dotenv import load_dotenv
from flask import Flask, Blueprint
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

api = Blueprint("api", __name__, url_prefix="/api")
api.register_blueprint(auth)
api.register_blueprint(team)
api.register_blueprint(player)
api.register_blueprint(match)
api.register_blueprint(stats)
api.register_blueprint(teams)
api.register_blueprint(players)
api.register_blueprint(matches)

app.register_blueprint(api)
if os.environ.get("FLASK_ENV") == "production":
    load_dotenv(".env.prod")
else:
    load_dotenv(".env.dev")

app.config.from_prefixed_env()


@app.after_request
def after_request(response):
    # this bypasses CORS to allow requests from the frontend to actually reach the backend
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


# this route is just for checking that the server is processing requests correctly
# it doesn't actually have anything to do with the application
@app.get("/ping")
def ping():
    return "pong", 200


if __name__ == "__main__":
    app.run(debug="--debug" in sys.argv)
