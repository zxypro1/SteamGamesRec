from app import creat_app
from flask import g, request
import pandas as pd
import pickle

app = creat_app()

@app.before_first_request
def first_action():
    g.item_dict = pd.read_csv(request.files['gamelist.csv'])
    g.interactions = pd.read_csv(request.files['interactions.csv'])
    res = open('savemodel.pickle', 'rb')
    g.model = pickle.load(res)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)