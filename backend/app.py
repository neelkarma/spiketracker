import os
import sys

from dotenv import load_dotenv
from flask import Flask
from routers.auth import auth
from routers.players import players

app = Flask(__name__)
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(players, url_prefix="/players")

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
    return "pong"


if __name__ == "__main__":
    app.run(debug="--debug" in sys.argv)
