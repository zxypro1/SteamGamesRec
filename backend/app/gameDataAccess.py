from .main.db import get_db
from flask import url_for

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



def getGameInfoByGenre(genreArr):
    db = get_db()
    result = db.execute('SELECT * FROM GameDetail WHERE genre IN (%s)' %
                        ','.join('?'*len(genreArr)), genreArr)
    result = result.fetchall()
    retVal = list()
    for i in result:
        retVal.append(dict(i))
    return retVal