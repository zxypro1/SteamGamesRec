from backend import creat_app
from flask import g, request, session
from sqlalchemy import create_engine
import os

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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
