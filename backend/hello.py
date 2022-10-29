from app import creat_app
from flask import g, request, session
from sqlalchemy import create_engine
from app.main.resources import create_item_dict, create_item_emdedding_matrix
from flask_sqlalchemy import SQLAlchemy
import os
import pandas as pd
import pickle

app = creat_app()


@app.before_first_request
def first_action():
    # g.df = pd.read_csv(request.files['gamesdata.csv'])
    
    session['document_path'] = os.getcwd() + '/backend'
    session['interactions'] = pd.read_csv(session.get('document_path') + '/instance/interactions.csv', index_col=0)
    res = open(session.get('document_path') + '/instance/savemodel.pickle', 'rb')
    session['model'] = pickle.load(res)
    session['db'] = create_engine('mysql+mysqlconnector://root:root@127.0.0.1:3306/steam')
    session['df'] = pd.read_sql('SELECT * FROM gamesnewdws', session.get('db'))
    session['game_dict'] = create_item_dict(session.get('df'), 'id', 'title')
    session['item_dict'] = create_item_emdedding_matrix(session.get('model'), session.get('interactions'))


    # g.document_path = os.getcwd() + '/backend'
    # g.interactions = pd.read_csv(g.document_path + '/instance/interactions.csv', index_col=0)
    # # g.interactions = g.interactions.iloc[:, 1:]
    # # print(g.interactions)

    # res = open(g.document_path + '/instance/savemodel.pickle', 'rb')
    # g.model = pickle.load(res)
    # g.db = create_engine('mysql+mysqlconnector://root:root@127.0.0.1:3306/steam')
    # g.df = pd.read_sql('SELECT * FROM gamesnewdws', g.db)
    # # print(g.df)
    # g.game_dict = create_item_dict(g.df, 'id', 'title')
    # g.item_dict = create_item_emdedding_matrix(g.model, g.interactions)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)