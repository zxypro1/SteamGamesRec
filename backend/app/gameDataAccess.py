from unittest import result
from warnings import catch_warnings
from .main.getTags import get_tag
from .main.db import get_db
from flask import url_for, request, g, session
import pandas as pd
from .main import resources


def getAllGameInfo():
    # result = g.db.execute('SELECT * FROM gamesnewdws')
    # result = result.fetchall()
    # print(g.df)
    # df = g.df.apply(lambda x: x.astype(str).str.encode('cp850').str.decode('gbk'))
    # print(g.df[0:10])
    result = []
    res = pd.read_sql("select title, url, tags, price, id, developer, short_description, header_image, screenshots, background from gamesnewdws limit 1000", g.db)
    for i in range(1000):
        try:
            t = res.iloc[i, :].to_json()
            result.append(t)
        except:
            continue
    return result

def pullGames(item_list):
    result = []
    for i in item_list:
        try:
            res = pd.read_sql("select title, url, tags, price, id, developer, short_description, header_image, screenshots, background from gamesnewdws where id = {}".format(i), g.db).iloc[0,:]
            # media = pd.read_sql("select header_image, screenshots, background from steam_media_data where steam_appid = {}".format(i), g.db).iloc[0,:]
            res = res.to_json()
            result.append(res)
        except:
            continue
    return result

def getRecByItem(item_id):
    require_list = ['title', 'url', 'tags', 'price', 'id', 'developer', 'short_description']
    item_list = resources.get_item_recs(g.item_dict,item_id,g.game_dict,100,True)

    result = pullGames(item_list)
    return result

def getRecByUser(user_id):

    scores = resources.get_recs(g.model,g.interactions,user_id,g.user_dict,g.game_dict,0,100,True,True)
    return pullGames(scores)


# waiting for shaoze
# def getTagFromText(text):
#     return getTags(text)
def getTagFromText(text):
    tags = get_tag(text)
    return tags



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