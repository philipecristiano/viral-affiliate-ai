import openai
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import re
import json

content_bp = Blueprint('content', __name__)

def analyze_video_content(transcription_text):
    """Analisa o conteúdo do vídeo para identificar produto e nicho"""
    try:
        client = openai.OpenAI()
        
        prompt = f"""
        Analise a seguinte transcrição de um vídeo de marketing de afiliados e identifique:
        1. O produto ou serviço sendo promovido
        2. O nicho de mercado
        3. O público-alvo
        4. Os principais benefícios mencionados
        5. O tom do vídeo (profissional, casual, entusiasmado, etc.)
        
        Transcrição:
        {transcription_text}
        
        Responda em formato JSON com as seguintes chaves:
        - produto: nome do produto/serviço
        - nicho: categoria/nicho de mercado
        - publico_alvo: descrição do público-alvo
        - beneficios: lista dos principais benefícios
        - tom: tom identificado
        - palavras_chave: lista de palavras-chave relevantes
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista em marketing de afiliados e análise de conteúdo."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        # Tentar extrair JSON da resposta
        content = response.choices[0].message.content
        
        # Procurar por JSON na resposta
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            # Fallback se não conseguir extrair JSON
            return {
                "produto": "Produto não identificado",
                "nicho": "Marketing digital",
                "publico_alvo": "Empreendedores digitais",
                "beneficios": ["Aumentar vendas", "Gerar renda"],
                "tom": "profissional",
                "palavras_chave": ["marketing", "afiliados", "vendas"]
            }
            
    except Exception as e:
        print(f"Erro na análise de conteúdo: {e}")
        return None

def generate_optimized_description(analysis, tone="entusiasmado"):
    """Gera descrição otimizada para o vídeo"""
    try:
        client = openai.OpenAI()
        
        prompt = f"""
        Crie uma descrição otimizada para um vídeo de marketing de afiliados com base na seguinte análise:
        
        Produto: {analysis.get('produto', 'Produto')}
        Nicho: {analysis.get('nicho', 'Marketing digital')}
        Público-alvo: {analysis.get('publico_alvo', 'Empreendedores')}
        Benefícios: {', '.join(analysis.get('beneficios', []))}
        Tom desejado: {tone}
        
        A descrição deve:
        1. Ter entre 150-300 caracteres
        2. Incluir um gancho inicial impactante
        3. Destacar os principais benefícios
        4. Ter uma chamada para ação clara
        5. Incluir emojis relevantes
        6. Ser otimizada para engajamento
        7. Incluir hashtags relevantes no final
        
        Formato da resposta:
        DESCRIÇÃO: [texto da descrição]
        HASHTAGS: [lista de hashtags separadas por espaço]
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista em copywriting para marketing de afiliados e redes sociais."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        
        # Extrair descrição e hashtags
        description_match = re.search(r'DESCRIÇÃO:\s*(.*?)(?=HASHTAGS:|$)', content, re.DOTALL)
        hashtags_match = re.search(r'HASHTAGS:\s*(.*)', content)
        
        description = description_match.group(1).strip() if description_match else content
        hashtags = hashtags_match.group(1).strip() if hashtags_match else ""
        
        return {
            "description": description,
            "hashtags": hashtags
        }
        
    except Exception as e:
        print(f"Erro na geração de descrição: {e}")
        return None

def generate_keywords_and_tips(analysis):
    """Gera palavras-chave e dicas de postagem"""
    try:
        client = openai.OpenAI()
        
        prompt = f"""
        Com base na análise do vídeo de marketing de afiliados, gere:
        
        Análise:
        Produto: {analysis.get('produto', 'Produto')}
        Nicho: {analysis.get('nicho', 'Marketing digital')}
        
        1. PALAVRAS-CHAVE: 15-20 palavras-chave relevantes para SEO e descoberta
        2. DICAS DE POSTAGEM: 5 dicas específicas para viralizar este tipo de conteúdo
        3. MELHOR HORÁRIO: Sugestão de horários para postar
        4. TENDÊNCIAS: Tendências atuais relacionadas ao nicho
        
        Responda em formato JSON:
        {{
            "palavras_chave": ["palavra1", "palavra2", ...],
            "dicas_postagem": ["dica1", "dica2", ...],
            "melhor_horario": "descrição dos melhores horários",
            "tendencias": ["tendência1", "tendência2", ...]
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista em marketing digital e tendências de redes sociais."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        content = response.choices[0].message.content
        
        # Tentar extrair JSON da resposta
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            # Fallback
            return {
                "palavras_chave": ["marketing", "afiliados", "vendas", "renda", "negócio"],
                "dicas_postagem": [
                    "Poste nos horários de maior engajamento",
                    "Use stories para aumentar alcance",
                    "Interaja com comentários rapidamente",
                    "Crie conteúdo de valor",
                    "Use hashtags estratégicas"
                ],
                "melhor_horario": "18h-21h nos dias úteis, 14h-17h nos fins de semana",
                "tendencias": ["IA", "automação", "renda passiva"]
            }
            
    except Exception as e:
        print(f"Erro na geração de palavras-chave: {e}")
        return None

def format_subtitles(transcription):
    """Formata a transcrição em legendas com timestamps"""
    try:
        words = transcription.get('words', [])
        if not words:
            # Fallback se não tiver words
            text = transcription.get('text', '')
            words_list = text.split()
            formatted_subtitles = []
            
            for i, word in enumerate(words_list):
                start_time = i * 0.5  # Aproximação
                end_time = (i + 1) * 0.5
                formatted_subtitles.append({
                    "start": start_time,
                    "end": end_time,
                    "text": word
                })
            
            return formatted_subtitles
        
        # Agrupar palavras em frases de 5-8 palavras
        formatted_subtitles = []
        current_group = []
        group_start = None
        
        for word in words:
            if group_start is None:
                group_start = word.get('start', 0)
            
            current_group.append(word.get('word', ''))
            
            # Criar grupo quando atingir 6 palavras ou encontrar pontuação
            if len(current_group) >= 6 or word.get('word', '').endswith(('.', '!', '?')):
                formatted_subtitles.append({
                    "start": group_start,
                    "end": word.get('end', group_start + 3),
                    "text": ' '.join(current_group).strip()
                })
                current_group = []
                group_start = None
        
        # Adicionar último grupo se houver
        if current_group:
            formatted_subtitles.append({
                "start": group_start or 0,
                "end": (group_start or 0) + 3,
                "text": ' '.join(current_group).strip()
            })
        
        return formatted_subtitles
        
    except Exception as e:
        print(f"Erro na formatação de legendas: {e}")
        return []

@content_bp.route('/analyze', methods=['POST'])
@cross_origin()
def analyze_content():
    """Analisa o conteúdo transcrito do vídeo"""
    data = request.get_json()
    
    if not data or 'transcription' not in data:
        return jsonify({'error': 'Transcrição não fornecida'}), 400
    
    transcription_text = data['transcription']
    
    analysis = analyze_video_content(transcription_text)
    
    if not analysis:
        return jsonify({'error': 'Erro na análise do conteúdo'}), 500
    
    return jsonify({
        'success': True,
        'analysis': analysis
    })

@content_bp.route('/generate-description', methods=['POST'])
@cross_origin()
def generate_description():
    """Gera descrição otimizada para o vídeo"""
    data = request.get_json()
    
    if not data or 'analysis' not in data:
        return jsonify({'error': 'Análise não fornecida'}), 400
    
    analysis = data['analysis']
    tone = data.get('tone', 'entusiasmado')
    
    description_data = generate_optimized_description(analysis, tone)
    
    if not description_data:
        return jsonify({'error': 'Erro na geração da descrição'}), 500
    
    return jsonify({
        'success': True,
        'description': description_data['description'],
        'hashtags': description_data['hashtags']
    })

@content_bp.route('/generate-keywords', methods=['POST'])
@cross_origin()
def generate_keywords():
    """Gera palavras-chave e dicas de postagem"""
    data = request.get_json()
    
    if not data or 'analysis' not in data:
        return jsonify({'error': 'Análise não fornecida'}), 400
    
    analysis = data['analysis']
    
    keywords_data = generate_keywords_and_tips(analysis)
    
    if not keywords_data:
        return jsonify({'error': 'Erro na geração de palavras-chave'}), 500
    
    return jsonify({
        'success': True,
        'keywords': keywords_data
    })

@content_bp.route('/format-subtitles', methods=['POST'])
@cross_origin()
def format_subtitles_endpoint():
    """Formata legendas com timestamps"""
    data = request.get_json()
    
    if not data or 'transcription' not in data:
        return jsonify({'error': 'Transcrição não fornecida'}), 400
    
    transcription = data['transcription']
    
    subtitles = format_subtitles(transcription)
    
    return jsonify({
        'success': True,
        'subtitles': subtitles
    })

@content_bp.route('/generate-all', methods=['POST'])
@cross_origin()
def generate_all_content():
    """Gera todo o conteúdo de uma vez (análise, descrição, palavras-chave, legendas)"""
    data = request.get_json()
    
    if not data or 'transcription' not in data:
        return jsonify({'error': 'Transcrição não fornecida'}), 400
    
    transcription = data['transcription']
    tone = data.get('tone', 'entusiasmado')
    
    # Análise do conteúdo
    analysis = analyze_video_content(transcription.get('text', ''))
    if not analysis:
        return jsonify({'error': 'Erro na análise do conteúdo'}), 500
    
    # Gerar descrição
    description_data = generate_optimized_description(analysis, tone)
    if not description_data:
        return jsonify({'error': 'Erro na geração da descrição'}), 500
    
    # Gerar palavras-chave e dicas
    keywords_data = generate_keywords_and_tips(analysis)
    if not keywords_data:
        return jsonify({'error': 'Erro na geração de palavras-chave'}), 500
    
    # Formatar legendas
    subtitles = format_subtitles(transcription)
    
    return jsonify({
        'success': True,
        'analysis': analysis,
        'description': description_data['description'],
        'hashtags': description_data['hashtags'],
        'keywords': keywords_data,
        'subtitles': subtitles
    })

