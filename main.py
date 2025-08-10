import os

from flask import Flask, send_from_directory
from flask_cors import CORS

from routes.simple_video import simple_video_bp
from routes.simple_content import simple_content_bp
from routes.auth import auth_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Configurar CORS para permitir acesso do frontend
CORS(app, 
     origins="*", 
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

app.register_blueprint(simple_video_bp, url_prefix='/api/video')
app.register_blueprint(simple_content_bp, url_prefix='/api/content')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/api/health', methods=['GET'])
def health():
    return {
        'status': 'healthy',
        'service': 'ViralAffiliateAI',
        'version': '1.0.0',
        'mode': 'demonstration'
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
