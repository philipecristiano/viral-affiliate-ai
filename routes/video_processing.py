import os
import tempfile
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import ffmpeg
import openai
from flask_cors import cross_origin

video_bp = Blueprint('video', __name__)

# Configurações
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_audio_from_video(video_path, audio_path):
    """Extrai áudio de um arquivo de vídeo usando FFmpeg"""
    try:
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, acodec='pcm_s16le', ac=1, ar='16000')
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
        return True
    except ffmpeg.Error as e:
        print(f"Erro ao extrair áudio: {e}")
        return False

def transcribe_audio(audio_path):
    """Transcreve áudio usando OpenAI Whisper"""
    try:
        client = openai.OpenAI()
        
        with open(audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )
        
        return {
            'text': transcript.text,
            'words': transcript.words if hasattr(transcript, 'words') else [],
            'segments': transcript.segments if hasattr(transcript, 'segments') else []
        }
    except Exception as e:
        print(f"Erro na transcrição: {e}")
        return None

@video_bp.route('/upload', methods=['POST'])
@cross_origin()
def upload_video():
    """Endpoint para upload e processamento inicial do vídeo"""
    
    if 'video' not in request.files:
        return jsonify({'error': 'Nenhum arquivo de vídeo enviado'}), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Formato de arquivo não suportado'}), 400
    
    # Verificar tamanho do arquivo
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': 'Arquivo muito grande. Máximo 100MB'}), 400
    
    try:
        # Criar diretório temporário
        temp_dir = tempfile.mkdtemp()
        video_id = str(uuid.uuid4())
        
        # Salvar arquivo de vídeo
        filename = secure_filename(file.filename)
        video_path = os.path.join(temp_dir, f"{video_id}_{filename}")
        file.save(video_path)
        
        # Extrair áudio
        audio_path = os.path.join(temp_dir, f"{video_id}_audio.wav")
        
        if not extract_audio_from_video(video_path, audio_path):
            return jsonify({'error': 'Erro ao processar o vídeo'}), 500
        
        # Transcrever áudio
        transcription = transcribe_audio(audio_path)
        
        if not transcription:
            return jsonify({'error': 'Erro na transcrição do áudio'}), 500
        
        # Limpar arquivos temporários
        try:
            os.remove(video_path)
            os.remove(audio_path)
            os.rmdir(temp_dir)
        except:
            pass
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'transcription': transcription,
            'message': 'Vídeo processado com sucesso'
        })
        
    except Exception as e:
        print(f"Erro no processamento: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@video_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Endpoint para verificar se o serviço está funcionando"""
    return jsonify({
        'status': 'healthy',
        'service': 'video_processing',
        'version': '1.0.0'
    })

@video_bp.route('/supported-formats', methods=['GET'])
@cross_origin()
def get_supported_formats():
    """Retorna os formatos de vídeo suportados"""
    return jsonify({
        'formats': list(ALLOWED_EXTENSIONS),
        'max_size_mb': MAX_FILE_SIZE // (1024 * 1024),
        'max_size_bytes': MAX_FILE_SIZE
    })

