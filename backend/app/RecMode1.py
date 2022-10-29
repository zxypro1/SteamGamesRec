from flask import Blueprint, render_template, request, make_response
import json
from numpy import greater
from werkzeug.exceptions import abort
from .main.db import get_db
from . import gameDataAccess
from .main import resources

bp = Blueprint("RecMode1", __name__)

# @bp.route("/chooseTag", methods=['POST'])
# def getTags():
#     if request.method == 'POST':
#         db = get_db()
#         data_json = json.loads(request.get_data())
#         tags = list()
#         for data in data_json:
#             for key, value in data.items():
#                 tags.append(value)
#         return gameDataAccess.getGameInfoByGenre(tags)
#     else:
#         abort(404, "Error")

@bp.route("/allGameInfo")
def allGameInfo():
    return gameDataAccess.getAllGameInfo()


@bp.route("/searchGameByName", methods=['POST'])
def searchGameByName():
    if request.method == 'POST':
        name = request.values.get('name')
        return gameDataAccess.getGameByImcompleteName(name)
    else:
        abort(404,"Error")

@bp.route("/searchUserByName", methods=['POST'])
def searchUserByName():
    if request.method == 'POST':
        name = request.values.get('name')
        return gameDataAccess.getUserByImcompleteName(name)
    else:
        abort(404,"Error")

@bp.route("/getSimilarGamesByItem", methods=['POST'])
def getSimilarGamesByItem():
    if request.method == 'POST':
        item_id = request.values.get('gameId')
        return gameDataAccess.getRecByItem(item_id)
    else:
        abort(404, "Error")

@bp.route("/getSimilarGamesByUser", methods=['POST'])
def getSimilarGamesByUser():
    if request.method == 'POST':
        user_id = request.values.get('userId')
        return gameDataAccess.getRecByUser(user_id)

    else:
        abort(404, "Error")

# waiting for shaoze
@bp.route("/getTagsFromText", methods=['POST'])
def getTagsFromText():
    if request.method == 'POST':
        text = request.values.get('text')
        return gameDataAccess.getTagFromText(text)
    else:
        abort(404, "Error")
