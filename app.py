"""
Backend Flask para Validação Inteligente de Código Python
Usa Groq API (gratuita) com Llama 3 para avaliar código de forma contextual
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from groq import Groq
import json
from dotenv import load_dotenv
import threading
import time
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

# =========================
# CONFIGURAÇÃO GROQ
# =========================

groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))


# =========================
# KEEP ALIVE (Render Free)
# =========================

def keep_alive():
    """
    Envia ping para o próprio servidor a cada 4 minutos
    para evitar inatividade no Render Free.
    """
    base_url = os.getenv("RENDER_EXTERNAL_URL")

    if not base_url:
        print("[KEEP-ALIVE] RENDER_EXTERNAL_URL não encontrada. Rodando localmente.")
        base_url = "https://jogo-l-gica-python-ea6n.onrender.com"

    url = f"{base_url}/api/health"

    while True:
        try:
            response = requests.get(url, timeout=10)
            print(f"[KEEP-ALIVE] Ping enviado - Status: {response.status_code}")
        except Exception as e:
            print(f"[KEEP-ALIVE] Erro ao enviar ping: {e}")

        time.sleep(240)  # 4 minutos


# Inicia automaticamente (funciona com Gunicorn)
threading.Thread(target=keep_alive, daemon=True).start()


# =========================
# FUNÇÃO DE VALIDAÇÃO IA
# =========================

def validate_code_with_ai(code, challenge_info, test_output):

    prompt = f"""Você é um avaliador de código Python para iniciantes.

DESAFIO:
{challenge_info.get('task', '')}

CÓDIGO DO ALUNO:
{code}

SAÍDA:
{test_output}

Responda APENAS em JSON no formato:
{{
    "passou": true/false,
    "pontuacao": 0-100,
    "feedback": "texto curto",
    "sugestoes": []
}}
"""

    try:
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": "Você é um professor paciente de Python."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=500
        )

        result_text = response.choices[0].message.content.strip()

        if "```" in result_text:
            result_text = result_text.split("```")[1].replace("json", "").strip()

        result = json.loads(result_text)
        return result

    except Exception as e:
        print(f"Erro IA: {e}")
        return {
            "passou": False,
            "pontuacao": 0,
            "feedback": "Erro ao validar com IA.",
            "sugestoes": []
        }


# =========================
# ROTAS
# =========================

@app.route('/api/validate', methods=['POST'])
def validate_code():
    try:
        data = request.json
        code = data.get('code', '')
        challenge = data.get('challenge', {})
        test_output = data.get('test_output', '')

        if not code:
            return jsonify({'success': False, 'message': 'Código não fornecido'}), 400

        ai_result = validate_code_with_ai(code, challenge, test_output)
        passed = ai_result.get('pontuacao', 0) >= 70

        return jsonify({
            'success': True,
            'passed': passed,
            'score': ai_result.get('pontuacao', 0),
            'feedback': ai_result.get('feedback', ''),
            'suggestions': ai_result.get('sugestoes', [])
        })

    except Exception as e:
        print(f"Erro endpoint validate: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/hint', methods=['POST'])
def get_smart_hint():
    try:
        data = request.json
        code = data.get('code', '')
        challenge = data.get('challenge', {})

        prompt = f"""Desafio: {challenge.get('task','')}
Código atual: {code}

Dê uma dica curta e objetiva.
"""

        response = groq_client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": "Você é um professor paciente."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )

        return jsonify({
            'success': True,
            'hint': response.choices[0].message.content.strip()
        })

    except Exception as e:
        print(f"Erro hint: {e}")
        return jsonify({'success': False}), 500


@app.route('/api/explain-error', methods=['POST'])
def explain_error():
    try:
        data = request.json
        code = data.get('code', '')
        error = data.get('error', '')

        prompt = f"""Explique este erro para iniciante sem revelar a resposta:

Código:
{code}

Erro:
{error}
"""

        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": "Explique de forma simples."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=200
        )

        return jsonify({
            'success': True,
            'explanation': response.choices[0].message.content.strip()
        })

    except Exception as e:
        print(f"Erro explain: {e}")
        return jsonify({'success': False}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'groq_configured': bool(os.getenv('GROQ_API_KEY'))
    })


# =========================
# EXECUÇÃO LOCAL
# =========================

if __name__ == '__main__':
    print("🚀 Rodando localmente em http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
