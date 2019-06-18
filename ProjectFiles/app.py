import os
from flask import Flask, render_template, jsonify, request, redirect, Response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import pandas as pd


flask_app = Flask(__name__)
    
# ************** Database Setup ***************

flask_app.config['SQLALCHEMY_DATABASE_URI'] = ""
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Attach db to Flask app so Flask handels db session managment and other good things
db = SQLAlchemy(flask_app)


# Load in your csv data
csv_path_and_name = "static/sourcedata/gamedatamap.csv"
db_table_name = "mapdata"
df = pd.read_csv(csv_path_and_name)

print("\nClean and transform ....\n")
# CLEAN
# TRANSFORM
print(df.head())


engine = create_engine('sqlite:///urldb', echo=False)
df.to_sql(db_table_name, con=engine, if_exists="replace", chunksize=20000)
print("DONE!")

# *********************************************
# ************** WEBPAGES *********************
# *********************************************

@flask_app.route("/")
def renderHome():
    return render_template("index.html")

@flask_app.route("/map")
def renderMap():
    return render_template("map.html")

@flask_app.route("/dashboard")
def renderDashboard():
    return render_template("dashboard.html")


# *********************************************
# ************** API ENDPOINTS ****************
# *********************************************

@flask_app.route("/api/cities")
def lStationsJson():
    df = pd.read_sql(f"""
        select  * 
        from    {db_table_name}
        """, engine)
    json_str = df.to_json(orient="records")
    return Response(response=json_str, status=200, mimetype='application/json')

if __name__ == "__main__":
    flask_app.run(debug=True)