from flask import Blueprint, render_template, request, make_response
import json
from .main.db import get_db

bp = Blueprint("RecMode1", __name__)

@bp.route("/chooseTag", methods=['POST'])
def getTags():
    if request.method == 'POST':
        db = get_db()
        data_json = json.loads(request.get_data())
        tags = list()
        for data in data_json:
            for key, value in data.items():
                tags.append(value)
        result = db.execute('SELECT * FROM GameDetail WHERE genra IN (%s)' %
                            ','.join(['%s']*len(tags)))
        result = result.fetchall()
        retVal = list()
        for i in result:
            retVal.append(dict(i))
        return retVal




