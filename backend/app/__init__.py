from flask import Flask,render_template,g,session
from .main import db
from flask_cors import CORS
from .RecMode1 import bp as RecMode1_bp



def creat_app():
    app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="/app/static")
    CORS(app)
    from . import main
    app.register_blueprint(main.main)
    app.register_blueprint(RecMode1_bp)
    app.config['SECRET_KEY'] = '...自己生成的秘钥'
    app.debug = True
    return app
