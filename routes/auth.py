from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
import hashlib
import os

auth_bp = Blueprint('auth', __name__)

# Senha padrão (pode ser alterada via variável de ambiente)
DEFAULT_PASSWORD = os.environ.get('APP_PASSWORD', 'viral2025')

def hash_password(password):
    """Gera hash da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    """Verifica se a senha está correta"""
    return hash_password(password) == hashed

@auth_bp.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    """Endpoint para autenticação"""
    data = request.get_json()
    
    if not data or 'password' not in data:
        return jsonify({'error': 'Senha não fornecida'}), 400
    
    password = data['password']
    
    # Verificar senha
    if password == DEFAULT_PASSWORD:
        session['authenticated'] = True
        session.permanent = True
        
        response = jsonify({
            'success': True,
            'message': 'Login realizado com sucesso'
        })
        
        # Configurar headers para cross-origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response
    else:
        return jsonify({'error': 'Senha incorreta'}), 401

@auth_bp.route('/logout', methods=['POST'])
@cross_origin(supports_credentials=True)
def logout():
    """Endpoint para logout"""
    session.pop('authenticated', None)
    response = jsonify({
        'success': True,
        'message': 'Logout realizado com sucesso'
    })
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@auth_bp.route('/check', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_auth():
    """Verifica se o usuário está autenticado"""
    is_authenticated = session.get('authenticated', False)
    response = jsonify({
        'authenticated': is_authenticated
    })
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@auth_bp.route('/status', methods=['GET'])
@cross_origin(supports_credentials=True)
def auth_status():
    """Endpoint para verificar status de autenticação"""
    is_authenticated = session.get('authenticated', False)
    response = jsonify({
        'authenticated': is_authenticated,
        'session_id': session.get('user_id', None)
    })
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

def require_auth(f):
    """Decorator para proteger rotas"""
    def decorated_function(*args, **kwargs):
        if not session.get('authenticated', False):
            return jsonify({'error': 'Acesso negado. Faça login primeiro.'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

