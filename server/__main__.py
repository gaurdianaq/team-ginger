from flask import Flask, request, send_from_directory
from server.mentions_crawler_flask.db import db
from server.mentions_crawler_flask.models.site import create_sites
from server.mentions_crawler_flask.responses import error_response
from server.mentions_crawler_flask.blueprints import blueprints
from server.constants import SAVE_EVENT_TAG, UPDATE_EVENT_TAG, LOGIN_EVENT_TAG, DISCONNECT_EVENT_TAG
from server.sockets import socketio, connections_by_sid
from flask_socketio import join_room, leave_room, emit
import os

app = Flask(__name__, instance_relative_config=True, static_folder="react_app")


@socketio.on(LOGIN_EVENT_TAG)
def login(email: str):
    join_room(email)
    connections_by_sid[request.sid] = email
    print(email + " has logged in.")


@socketio.on(DISCONNECT_EVENT_TAG)
def disconnect():
    email = connections_by_sid.get(request.sid)
    if email is not None:
        leave_room(email)
        del connections_by_sid[request.sid]


# Will ensure that if the user is logged in more than one location, that the toggles will update in those sessions as well
@socketio.on(SAVE_EVENT_TAG)
def save(data):
    email = connections_by_sid.get(request.sid)
    if email is not None:
        emit(UPDATE_EVENT_TAG, data, room=email)


@app.errorhandler(500)
def unknown_error(e):
    return error_response("Something went wrong!", e)


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    directory_name = os.path.dirname(__file__)
    configfile = "./config.py"
    config_path = os.path.join(directory_name, configfile)
    app.config.from_pyfile(config_path, silent=False)
    db.init_app(app)

    # creates any tables that aren't in the database, won't update existing tables if the model changes
    # will populate sites table if it isn't already populated
    with app.app_context():
        db.create_all()
        create_sites()

    # will register all blueprints
    for blueprint in blueprints:
        app.register_blueprint(blueprint)
    socketio.init_app(app)
    socketio.run(app, host="0.0.0.0", port=os.environ["PORT"])

