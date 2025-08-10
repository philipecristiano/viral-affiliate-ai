from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import tempfile
import os
from .auth import require_auth

simple_video_bp = Blueprint('simple_video', __name__)

@simple_video_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Endpoint para verificar se o serviço está funcionando"""
    return jsonify({
        'status': 'healthy',
        'service': 'video_processing_simple',
        'version': '1.0.0'
    })

@simple_video_bp.route('/upload', methods=['POST'])
@cross_origin()
@require_auth
def upload_video():
    """Endpoint simplificado para demonstração"""
    
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'Nenhum arquivo de vídeo enviado'}), 400
        
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        # Obter dados do formulário
        theme = request.form.get('theme', '').strip()
        description = request.form.get('description', '').strip()
        product_link = request.form.get('product_link', '').strip()
        
        if not theme:
            return jsonify({'error': 'Tema do vídeo é obrigatório'}), 400
        
        # Validar tipo de arquivo
        allowed_extensions = {'.mp4', '.mov', '.avi'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            return jsonify({'error': 'Formato não suportado. Use MP4, MOV ou AVI.'}), 400
        
        # Validar tamanho (100MB)
        if file.content_length and file.content_length > 100 * 1024 * 1024:
            return jsonify({'error': 'Arquivo muito grande. Máximo 100MB.'}), 400
        
        # Detectar plataforma do produto
        platform = 'Produto Digital'
        if product_link:
            if 'shopee.com' in product_link:
                platform = 'Shopee'
            elif 'mercadolivre.com' in product_link or 'mercadolibre.com' in product_link:
                platform = 'Mercado Livre'
            elif 'amazon.com' in product_link:
                platform = 'Amazon'
            elif 'aliexpress.com' in product_link:
                platform = 'AliExpress'
            elif 'hotmart.com' in product_link:
                platform = 'Hotmart'
            elif 'eduzz.com' in product_link:
                platform = 'Eduzz'
        
        # Simular processamento baseado no tema e link
        base_text = f'Olá pessoal! Hoje vou falar sobre {theme}.'
        
        if product_link:
            base_text += f' Encontrei este produto incrível na {platform} que vai revolucionar sua vida!'
        else:
            base_text += ' Este é um produto incrível que vai revolucionar sua vida!'
            
        if description:
            base_text += f' {description}'
        else:
            base_text += ' Oferece benefícios únicos e pode ajudar você a alcançar seus objetivos!'
        
        mock_transcription = {
            'text': base_text,
            'words': [
                {'word': 'Olá', 'start': 0.0, 'end': 0.5},
                {'word': 'pessoal!', 'start': 0.5, 'end': 1.0},
                {'word': 'Hoje', 'start': 1.0, 'end': 1.3},
                {'word': 'vou', 'start': 1.3, 'end': 1.6},
                {'word': 'falar', 'start': 1.6, 'end': 2.0},
                {'word': 'sobre', 'start': 2.0, 'end': 2.3},
                {'word': theme.split()[0], 'start': 2.3, 'end': 2.8},
            ]
        }
        
        return jsonify({
            'success': True,
            'video_id': 'demo-123',
            'transcription': mock_transcription,
            'theme': theme,
            'user_description': description,
            'product_link': product_link,
            'platform': platform,
            'message': f'Vídeo sobre "{theme}" processado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@simple_video_bp.route('/supported-formats', methods=['GET'])
@cross_origin()
def get_supported_formats():
    """Retorna os formatos de vídeo suportados"""
    return jsonify({
        'formats': ['mp4', 'mov', 'avi'],
        'max_size_mb': 100,
        'max_size_bytes': 100 * 1024 * 1024
    })

