from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import time
from .auth import require_auth

simple_content_bp = Blueprint('simple_content', __name__)

@simple_content_bp.route('/generate-all', methods=['POST'])
@cross_origin()
@require_auth
def generate_all_content():
    """Gera todo o conteúdo de uma vez (versão demonstração)"""
    data = request.get_json()
    
    if not data or 'transcription' not in data:
        return jsonify({'error': 'Transcrição não fornecida'}), 400
    
    # Obter dados do usuário
    theme = data.get('theme', 'produto digital')
    user_description = data.get('userDescription', '')
    product_link = data.get('productLink', '')
    platform = data.get('platform', 'Produto Digital')
    
    # Simular tempo de processamento
    time.sleep(2)
    
    # Dados mockados personalizados baseados no tema e link
    mock_analysis = {
        "produto": theme.title(),
        "plataforma": platform,
        "nicho": "Marketing Digital" if "digital" in theme.lower() else "Vendas Online",
        "publico_alvo": "Empreendedores e afiliados",
        "beneficios": ["Aumentar vendas", "Gerar renda passiva", "Automatizar processos"],
        "tom": "entusiasmado",
        "palavras_chave": [theme.lower(), "afiliados", "vendas", "renda", "digital"]
    }
    
    # Descrição personalizada baseada no tema e link
    if product_link:
        mock_description = f"""🔥 DESCOBERTA INCRÍVEL sobre {theme}! 

Encontrei este produto REVOLUCIONÁRIO na {platform} que vai TRANSFORMAR sua vida! 

✅ Resultados comprovados com {theme}
✅ Sistema testado e aprovado por milhares
✅ Implementação rápida e fácil
✅ Disponível na {platform} com desconto especial

{user_description if user_description else "Não perca essa oportunidade única de transformar sua vida!"}

👉 CLIQUE NO LINK e garante o seu agora:
{product_link}

⏰ Oferta por tempo limitado!
🚀 Frete grátis para todo o Brasil!

#CORRE #OFERTAIMPERDIVEL #TRANSFORMACAO"""
    else:
        mock_description = f"""🔥 DESCOBERTA INCRÍVEL sobre {theme}! 

Este produto vai REVOLUCIONAR sua estratégia de marketing! 

✅ Resultados comprovados com {theme}
✅ Sistema testado e aprovado por milhares
✅ Implementação rápida e fácil

{user_description if user_description else "Não perca essa oportunidade única de transformar sua vida!"}

👉 CLIQUE NO LINK e mude sua vida hoje mesmo!

⏰ Oferta por tempo limitado!"""
    
    # Hashtags personalizadas
    theme_words = theme.lower().replace(' ', '').replace('-', '')
    platform_tag = platform.lower().replace(' ', '')
    
    if product_link:
        mock_hashtags = f"#{theme_words} #{platform_tag} #ofertaimperdivel #desconto #fretegratis #marketingdigital #afiliados #rendapassiva #vendasonline #empreendedorismo #sucessodigital #marketingdeafiliados #negocioonline #promocao"
    else:
        mock_hashtags = f"#{theme_words} #marketingdigital #afiliados #rendapassiva #vendasonline #empreendedorismo #sucessodigital #marketingdeafiliados #negocioonline"
    
    # Keywords personalizadas
    keywords_list = [
        theme.lower(), f"marketing de {theme.lower()}", "renda passiva", "vendas online", 
        "empreendedorismo digital", "negócio online", "marketing digital",
        "afiliado profissional", "ganhar dinheiro", "trabalhar em casa",
        "liberdade financeira", "sucesso digital"
    ]
    
    if product_link:
        keywords_list.extend([f"{theme} {platform}", f"desconto {platform}", f"oferta {platform}"])
    
    mock_keywords = {
        "palavras_chave": keywords_list,
        "dicas_postagem": [
            f"Use o tema '{theme}' nos primeiros segundos do vídeo",
            "Poste entre 18h-21h para maior engajamento",
            "Use stories para aumentar o alcance orgânico",
            "Responda aos comentários nos primeiros 30 minutos",
            "Crie senso de urgência com ofertas limitadas",
            "Use depoimentos reais de clientes satisfeitos"
        ] + ([f"Destaque o link da {platform} na bio e stories"] if product_link else []),
        "melhor_horario": "18h-21h nos dias úteis, 14h-17h nos fins de semana",
        "tendencias": [f"{theme} viral", "IA no marketing", "automação de vendas", "marketing de influência"] + ([f"ofertas {platform}"] if product_link else [])
    }
    
    # Legendas personalizadas
    if product_link:
        mock_subtitles = [
            {"start": 0.0, "end": 2.0, "text": "Olá pessoal! Hoje vou falar sobre"},
            {"start": 2.0, "end": 4.5, "text": f"{theme}. Encontrei este produto"},
            {"start": 4.5, "end": 7.0, "text": f"incrível na {platform} que vai"},
            {"start": 7.0, "end": 9.5, "text": "revolucionar sua vida. Link na bio!"},
            {"start": 9.5, "end": 12.0, "text": "Corre que é oferta limitada!"}
        ]
    else:
        mock_subtitles = [
            {"start": 0.0, "end": 2.0, "text": "Olá pessoal! Hoje vou falar sobre"},
            {"start": 2.0, "end": 4.5, "text": f"{theme}. Este é um produto"},
            {"start": 4.5, "end": 7.0, "text": "incrível que vai revolucionar"},
            {"start": 7.0, "end": 9.5, "text": "sua vida. Oferece benefícios"},
            {"start": 9.5, "end": 12.0, "text": "únicos para seu sucesso!"}
        ]
    
    return jsonify({
        'success': True,
        'analysis': mock_analysis,
        'description': mock_description,
        'hashtags': mock_hashtags,
        'keywords': mock_keywords,
        'subtitles': mock_subtitles,
        'has_product_link': bool(product_link),
        'platform': platform
    })

@simple_content_bp.route('/generate-description', methods=['POST'])
@cross_origin()
@require_auth
def generate_description():
    """Gera descrição otimizada (versão demonstração)"""
    data = request.get_json()
    
    if not data or 'analysis' not in data:
        return jsonify({'error': 'Análise não fornecida'}), 400
    
    tone = data.get('tone', 'entusiasmado')
    
    descriptions = {
        'entusiasmado': """🚀 OPORTUNIDADE IMPERDÍVEL! 

Este produto vai TRANSFORMAR sua estratégia de marketing! 

💰 Resultados comprovados
🎯 Sistema testado e aprovado
⚡ Implementação rápida e fácil

👉 CLIQUE AGORA e mude sua vida!""",
        
        'profissional': """Apresentamos uma solução inovadora para otimização de resultados em marketing de afiliados.

• Metodologia comprovada cientificamente
• ROI superior a 250% em média
• Suporte técnico especializado

Acesse o link para mais informações.""",
        
        'casual': """Oi gente! 😊

Encontrei algo que realmente funciona para quem quer ganhar uma renda extra.

Já testei e os resultados são incríveis! 

Link na bio para quem quiser saber mais 👆"""
    }
    
    description = descriptions.get(tone, descriptions['entusiasmado'])
    hashtags = "#sucesso #marketing #renda #oportunidade #digital"
    
    return jsonify({
        'success': True,
        'description': description,
        'hashtags': hashtags
    })

@simple_content_bp.route('/generate-keywords', methods=['POST'])
@cross_origin()
@require_auth
def generate_keywords():
    """Gera palavras-chave e dicas (versão demonstração)"""
    data = request.get_json()
    
    if not data or 'analysis' not in data:
        return jsonify({'error': 'Análise não fornecida'}), 400
    
    keywords_data = {
        "palavras_chave": [
            "marketing de afiliados", "renda passiva", "vendas online", 
            "empreendedorismo", "negócio digital", "trabalho remoto",
            "liberdade financeira", "sucesso online", "estratégias de vendas"
        ],
        "dicas_postagem": [
            "Poste nos horários de pico de sua audiência",
            "Use call-to-actions claros e diretos",
            "Inclua prova social e depoimentos",
            "Crie senso de urgência limitada",
            "Interaja rapidamente com os comentários"
        ],
        "melhor_horario": "18h-21h durante a semana, 14h-17h nos fins de semana",
        "tendencias": ["marketing de influência", "automação", "IA", "conteúdo viral"]
    }
    
    return jsonify({
        'success': True,
        'keywords': keywords_data
    })

