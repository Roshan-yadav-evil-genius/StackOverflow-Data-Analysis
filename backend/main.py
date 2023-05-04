
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['GET'])
# @cross_origin
def main():
    if (request.method == 'GET'):
        with open("main.json", "r") as file:
            data = file.read()
            data = json.loads(data)
        return jsonify(data)

# @cross_origin
@app.route('/2021', methods=['GET'])
def data2021():
    if (request.method == 'GET'):
        with open("data2021.json", "r") as file:
            data = file.read()
            data = json.loads(data)
        return jsonify(data)


# @cross_origin
@app.route('/2022', methods=['GET'])
def data2022():
    if (request.method == 'GET'):
        with open("data2022.json", "r") as file:
            data = file.read()
            data = json.loads(data)

        return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
