from app import creat_app
from flask import g, request
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
    g.document_path = os.getcwd() + '/backend'
    g.interactions = pd.read_csv(g.document_path + '/instance/interactions.csv', index_col=0)
    # g.interactions = g.interactions.iloc[:, 1:]
    # print(g.interactions)

    res = open(g.document_path + '/instance/savemodel.pickle', 'rb')
    g.model = pickle.load(res)
    g.db = create_engine('mysql+mysqlconnector://root:root@127.0.0.1:3306/steam')
    g.df = pd.read_sql('SELECT * FROM gamesnewdws', g.db)
    # print(g.df)
    g.game_dict = create_item_dict(g.df, 'id', 'title')
    g.item_dict = create_item_emdedding_matrix(g.model, g.interactions)
    print(g.item_dict.loc['30'])
    print(g.game_dict[267772.0])




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)