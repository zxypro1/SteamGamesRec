from .main.db import get_db
from flask import url_for, request, g
import pandas as pd
from .main import resources


item_dict = resources.create_item_dict(g.df, 'id', 'title')

def getAllGameInfo():
    db = get_db()
    result = db.execute('SELECT * FROM gamesdws')
    result = result.fetchall()
    return result

def getRecByItem(item_id):
    item_embedding_matrix = pd.read_csv(request.files['embeddings_item.csv'])
    return resources.get_item_recs(item_embedding_matrix,item_id,item_dict,100,True)

def getRecByUser(user_id):

    user_dict = resources.create_user_dict(g.interactions)
    scores = resources.get_recs(g.model,user_id,user_dict,item_dict,0,100,True,True)
    return getGameInfoByName(scores)


# waiting for shaoze
# def getTagFromText(text):
#     return getTags(text)


def getGameByImcompleteName(name):
    db = get_db()
    result = db.execute('SELECT * FROM gamesdws WHERE gameName LIKE name')
    result = result.fetchall()
    return result

def getUserByImcompleteName(name):
    db = get_db()
    result = db.execute('SELECT * FROM usersdws WHERE userName LIKE name')
    result = result.fetchall()
    return result


def getGameInfoById(idArr):
    db = get_db()
    idStrArr = list(map(str, idArr))
    result = db.execute('SELECT * FROM GameDetail WHERE gameId IN (%s)' %
                        ','.join('?'*len(idStrArr)), idStrArr)
    result = result.fetchall()
    retVal = list()
    for i in result:
        retVal.append(dict(i))
    return retVal

def getGameInfoByName(nameArr):
    db = get_db()
    nameArr = list(nameArr)
    result = db.execute('SELECT * FROM GameDetail WHERE gameName IN (%s)' %
                        ','.join('?'*len(nameArr)), nameArr)
    result = result.fetchall()
    retVal = list()
    for i in result:
        retVal.append(dict(i))
    return retVal

def getGameInfoByGenre(genreArr):
    db = get_db()
    result = db.execute('SELECT * FROM GameDetail WHERE genre IN (%s)' %
                        ','.join('?'*len(genreArr)), genreArr)
    result = result.fetchall()
    retVal = list()
    for i in result:
        retVal.append(dict(i))
    return retVal