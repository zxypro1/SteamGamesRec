from flask_sqlalchemy import SQLAlchemy
from flask import current_app
from flask import g
from flask.cli import with_appcontext


def get_db():
    """Connect to the application's configured database. The connection
    is unique for each request and will be reused if this is called
    again.
    """
    if "db" not in g:
        current_app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:root@127.0.0.1:3306/steam'
        db = SQLAlchemy(current_app)
        g.db = db

    return g.db


def close_db(e=None):
    """If this request connected to the database, close the
    connection.
    """
    db = g.pop("db", None)

    if db is not None:
        db.close()


# Use "flask init-db" to create a new db
# def init_db():
#    """Clear existing data and create new tables."""
#    db = get_db()
#
#     with current_app.open_resource("schema.sql") as f:
#         db.executescript(f.read().decode("utf8"))


# @click.command("init-db")
# @with_appcontext
# def init_db_command():
#     """Clear existing data and create new tables."""
#     init_db()
#     click.echo("Initialized the database.")


def init_app(app):
    """Register database functions with the Flask app. This is called by
    the application factory.
    """
    app.teardown_appcontext(close_db)
    # app.cli.add_command(init_db_command)
