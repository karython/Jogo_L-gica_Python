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

load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# Configurar Groq API (gratuita)
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

def validate_code_with_ai(code, challenge_info, test_output):
    """
    Usa IA para validar se o código atende aos requisitos do desafio
    """
    
    prompt = f"""Você é um avaliador de código Python para iniciantes. Analise se o código do aluno atende aos requisitos do desafio.

**DESAFIO:**
{challenge_info['task']}

**CÓDIGO DO ALUNO:**
```python
{code}
```

**SAÍDA DO CÓDIGO:**
{test_output}

**CRITÉRIOS DE AVALIAÇÃO:**
1. O código executa sem erros graves?
2. O código produz uma saída relacionada ao objetivo?
3. O aluno usou os conceitos solicitados (mesmo que de forma diferente)?
4. A saída está correta (aceite variações como "Olá Mundo", "Hello World", "olá, mundo!", etc)?

**SEJA FLEXÍVEL:**
- Aceite variações de escrita (maiúsculas/minúsculas, pontuação)
- Aceite diferentes abordagens que chegam ao mesmo resultado
- Considere se o objetivo foi alcançado, não apenas se está "perfeito"
- Para iniciantes, foco no conceito, não na perfeição

**RESPONDA APENAS EM JSON:**
{{
    "passou": true/false,
    "pontuacao": 0-100,
    "feedback": "Explicação curta e motivadora",
    "sugestoes": ["dica 1", "dica 2"] ou []
}}

Exemplos de flexibilidade esperada:
- "Olá, Mundo!" = "olá mundo" = "Hello World" ✅
- Usar 'nome = input(); print(nome)' = 'print(input())' ✅
- Pequenas variações de sintaxe que funcionam ✅"""

    try:
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",  # Modelo gratuito e poderoso
            messages=[
                {
                    "role": "system",
                    "content": "Você é um professor paciente de Python que avalia código de iniciantes. Seja encorajador e flexível, focando no aprendizado."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,  # Mais determinístico
            max_tokens=500
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Extrair JSON da resposta
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(result_text)
        return result
        
    except Exception as e:
        print(f"Erro na validação com IA: {e}")
        # Fallback: validação básica
        return {
            "passou": False,
            "pontuacao": 0,
            "feedback": "Erro ao validar com IA. Tente novamente.",
            "sugestoes": []
        }

@app.route('/api/validate', methods=['POST'])
def validate_code():
    """
    Endpoint principal para validar código do aluno
    """
    try:
        data = request.json
        code = data.get('code', '')
        challenge = data.get('challenge', {})
        test_output = data.get('test_output', '')
        
        if not code:
            return jsonify({
                'success': False,
                'message': 'Código não fornecido'
            }), 400
        
        # Validar com IA
        ai_result = validate_code_with_ai(code, challenge, test_output)
        
        # Determinar se passou (pontuação >= 70)
        passed = ai_result['pontuacao'] >= 70
        
        return jsonify({
            'success': True,
            'passed': passed,
            'score': ai_result['pontuacao'],
            'feedback': ai_result['feedback'],
            'suggestions': ai_result.get('sugestoes', [])
        })
        
    except Exception as e:
        print(f"Erro no endpoint: {e}")
        return jsonify({
            'success': False,
            'message': f'Erro ao processar: {str(e)}'
        }), 500

@app.route('/api/hint', methods=['POST'])
def get_smart_hint():
    """
    Gera dica inteligente baseada no código atual do aluno
    """
    try:
        data = request.json
        code = data.get('code', '')
        challenge = data.get('challenge', {})
        
        prompt = f"""Você é um professor de Python. O aluno está tentando resolver este desafio:

**DESAFIO:** {challenge.get('task', '')}
**DICA ORIGINAL:** {challenge.get('hint', '')}

**CÓDIGO ATUAL DO ALUNO:**
```python
{code if code else '(ainda não escreveu código)'}
```

Dê UMA dica específica e útil baseada no que o aluno já fez (ou não fez). 
Seja breve (máximo 2 frases), encorajador e direcione para o próximo passo.

Responda apenas a dica, sem formatação extra."""

        response = groq_client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": "Você é um professor paciente de Python."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        hint = response.choices[0].message.content.strip()
        
        return jsonify({
            'success': True,
            'hint': hint
        })
        
    except Exception as e:
        print(f"Erro ao gerar dica: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro ao gerar dica'
        }), 500

@app.route('/api/explain-error', methods=['POST'])
def explain_error():
    """
    Explica erros de Python em linguagem simples
    """
    try:
        data = request.json
        code = data.get('code', '')
        error = data.get('error', '')
        
        prompt = f"""Você é um professor de Python. Explique este erro para um iniciante em linguagem SIMPLES mas nao fale exatamente o erro que ele cometeu para nao mostrar a resposta:

**CÓDIGO:**
```python
{code}
```

**ERRO:**
{error}



Seja breve e didático. Máximo 3 frases."""

        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": "Você é um professor paciente que explica erros de forma simples."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=200
        )
        
        explanation = response.choices[0].message.content.strip()
        
        return jsonify({
            'success': True,
            'explanation': explanation
        })
        
    except Exception as e:
        print(f"Erro ao explicar: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro ao explicar'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Verifica se a API está funcionando
    """
    return jsonify({
        'status': 'ok',
        'message': 'API de validação inteligente funcionando!',
        'groq_configured': bool(os.getenv('GROQ_API_KEY'))
    })

if __name__ == '__main__':
    # Verificar se a chave da API está configurada
    if not os.getenv('GROQ_API_KEY'):
        print("⚠️  AVISO: GROQ_API_KEY não configurada!")
        print("Configure no arquivo .env para usar validação inteligente")
    else:
        print("✅ Groq API configurada!")
    
    print("\n🚀 Servidor iniciando em http://localhost:5000")
    print("📚 Documentação: http://localhost:5000/api/health\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)