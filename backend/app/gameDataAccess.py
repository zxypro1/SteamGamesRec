from unittest import result
from .main.db import get_db
from flask import url_for, request, g
import pandas as pd
from .main import resources


def getAllGameInfo():
    # result = g.db.execute('SELECT * FROM gamesnewdws')
    # result = result.fetchall()
    # print(g.df)
    # df = g.df.apply(lambda x: x.astype(str).str.encode('cp850').str.decode('gbk'))
    # print(g.df[0:10])
    print(g.df.loc[0:10,'publisher']);
    return g.df[0:10].to_json(orient="records")

def getRecByItem(item_id):
    item_list = resources.get_item_recs(g.item_dict,item_id,g.game_dict,100,True)
    print(item_list)

    result = []
    for i in item_list:
        res = pd.read_sql("select title, url, tags, price, id, developer, short_description from gamesnewdws where id = {}".format(i), g.db).iloc[0,:]
        print(res)
        result.append(res.to_json())
        print(result)
    # print(result)
    return result

def getRecByUser(user_id):

    user_dict = resources.create_user_dict(g.interactions)
    scores = resources.get_recs(g.model,user_id,user_dict,g.game_dict,0,100,True,True)
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
    result = pd.read_sql('SELECT * FROM user WHERE user_id LIKE ' + name, g.db)
    # result = result.fetchall()
    return result.to_string()


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