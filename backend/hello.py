from app import creat_app
from flask import g, request, session
from sqlalchemy import create_engine
from app.main.resources import create_item_dict, create_item_emdedding_matrix, create_user_dict
from flask_sqlalchemy import SQLAlchemy
import os
import pandas as pd
import pickle

app = creat_app()


@app.before_first_request
def first_action():
    # g.df = pd.read_csv(request.files['gamesdata.csv'])
    
    # session['document_path'] = os.getcwd() + '/backend'
    session['document_path'] = os.getcwd() + '/backend'
    # session['item_dict'] = create_item_emdedding_matrix(model, interactions)

@app.before_request
def before_request():
    session['document_path'] = os.getcwd() + '/backend'
    g.db = create_engine('mysql+mysqlconnector://root:root@127.0.0.1:3306/steam')
#     session['document_path'] = os.getcwd() + '/../backend'
#     g.interactions = pd.read_csv(session.get('document_path') + '/instance/interactions.csv', index_col=0)
#     res = open(session.get('document_path') + '/instance/savemodel.pickle', 'rb')
#     g.db = create_engine('mysql+mysqlconnector://root:root@127.0.0.1:3306/steam')
#     df = pd.read_sql('SELECT * FROM gamesnewdws', g.db)
#     g.user_dict = create_user_dict(g.interactions)
#     # print(g.user_dict)
#     g.game_dict = create_item_dict(df, 'id', 'title')
#     g.model = pickle.load(res)
#     g.item_dict = create_item_emdedding_matrix(g.model, g.interactions)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)