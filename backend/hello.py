from app import creat_app
from flask import g, request
from sqlalchemy import create_engine
import pandas as pd
import pickle

app = creat_app()

@app.before_first_request
def first_action():
    # g.df = pd.read_csv(request.files['gamesdata.csv'])
    g.interactions = pd.read_csv('./instance/interactions.csv')
    res = open('savemodel.pickle', 'rb')
    g.model = pickle.load(res)
    engine = create_engine('mysql+mysqlconnector://root:123456@127.0.0.1:3306/jxgl')
    g.df = pd.read_sql('gamesdata', engine)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)