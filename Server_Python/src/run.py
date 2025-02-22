from flask import Flask, jsonify, request
from flask_cors import CORS
from discapacidades import get_data_discapacidades
from discapacidades1 import get_data_discapacidades1
from poblacion import get_data_poblacion
from poblacion2 import get_data_poblacion2
from idiomas import get_data_idiomas
from idiomas2 import get_data_idiomas2
from esctructuras import get_data_estructuras
from etnia import get_data_etnia
from etnia1 import get_data_etnia1
from migracion import get_data_migracion
from migracion2 import get_data_migracion2
from tics import get_data_tics
from tics2 import get_data_tics2


app = Flask(__name__)
CORS(app)

@app.route("/api/tics2", methods=['GET'])
def get_tics2():
    data = get_data_tics2()
    
    return jsonify({
        "data": data,
        
        
})

@app.route("/api/tics", methods=['GET'])
def get_tics():
    data = get_data_tics()
    
    return jsonify({
        "data": data,
        
        
})


@app.route("/api/poblacion2", methods=['GET'])
def get_poblacion2():
    data = get_data_poblacion2()
    
    return jsonify({
        "data": data,
        
        
})


@app.route("/api/poblacion", methods=['GET'])
def get_poblacion():
    data = get_data_poblacion()
    
    return jsonify({
        "data": data,
        
        
})

@app.route("/api/migracion2", methods=['GET'])
def get_migracion2():
    data = get_data_migracion2()
    
    return jsonify({
        "data": data,
        
        
})

@app.route("/api/migracion", methods=['GET'])
def get_migracion():
    data = get_data_migracion()
    
    return jsonify({
        "data": data,
        
        
})



@app.route("/api/idiomas2", methods=['GET'])
def get_idiomas2():
    data = get_data_idiomas2()
    
    return jsonify({
        "data": data,
        
        
})

@app.route("/api/idiomas", methods=['GET'])
def get_idiomas():
    data = get_data_idiomas()
    
    return jsonify({
        "data": data,
        
        
})


@app.route("/api/etnia1", methods=['GET'])
def get_etnia1():
    data = get_data_etnia1()
    
    return jsonify({
        "data": data,
        
        
})


@app.route("/api/etnia", methods=['GET'])
def get_etnia():
    data = get_data_etnia()
    
    return jsonify({
        "data": data,
        
        
})


@app.route("/api/esctructuras", methods=['GET'])
def get_esctructuras():
    data = get_data_estructuras()
    
    return jsonify({
        "data": data,
        
        
})

@app.route("/api/discapacidades", methods=['GET'])
def get_discapacidades():
    data = get_data_discapacidades()
    
    return jsonify({
        "data": data,
        
        
})
    
@app.route("/api/discapacidades1", methods=['GET'])
def get_discapacidades1():
    data = get_data_discapacidades1()
    
    return jsonify({
        "data": data,
        
        
})    
    






if __name__=='__main__':
    app.run(debug=True)