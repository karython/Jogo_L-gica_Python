// ============================================================================
// scripts.js — Aventura do Programador com IA
// Arquivo único e definitivo: merge de scripts.js + frontend-with-api.js
// Correções aplicadas:
//   FIX 1 — totalLevels inicializado com Object.keys(challenges).length
//   FIX 2 — apiOnline global + checkApiHealth/validateWithAI corrigidos
//   FIX 3 — sem monkey-patch; updateUI já inclui inventory/progress
//   FIX 4 — botão desabilitado + proteção contra XP duplicado
// ============================================================================


// ============================================================================
// PYODIDE — INTERPRETADOR PYTHON
// ============================================================================

let pyodide = null;
let pyodideReady = false;

async function initPyodide() {
    const loadingDiv = document.getElementById('pyodide-loading');
    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        pyodide = await loadPyodide();

        await pyodide.runPythonAsync(`
import sys
from io import StringIO

class InputSimulator:
    def __init__(self):
        self.inputs = []
        self.index = 0

    def set_inputs(self, inputs):
        self.inputs = inputs if isinstance(inputs, list) else inputs.split('\\n')
        self.index = 0

    def __call__(self, prompt=''):
        if self.index < len(self.inputs):
            value = self.inputs[self.index]
            self.index += 1
            print(prompt + value)
            return value
        return ''

_input_simulator = InputSimulator()
input = _input_simulator
        `);

        pyodideReady = true;
        console.log('✅ Pyodide carregado com sucesso!');
        if (loadingDiv) loadingDiv.style.display = 'none';

    } catch (error) {
        console.error('Erro ao carregar Pyodide:', error);
        if (loadingDiv) {
            loadingDiv.innerHTML = '<div style="color:#ff5722;">❌ Erro ao carregar interpretador Python</div>';
            setTimeout(() => { if (loadingDiv) loadingDiv.style.display = 'none'; }, 3000);
        }
    }
}

async function executePythonCode(code, inputs = []) {
    if (!pyodideReady) {
        return { success: false, output: 'Interpretador Python ainda carregando...', error: null };
    }

    try {
        if (inputs && inputs.length > 0) {
            await pyodide.runPythonAsync(`_input_simulator.set_inputs(${JSON.stringify(inputs)})`);
        }

        await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
        await pyodide.runPythonAsync(code);
        const output = await pyodide.runPythonAsync('sys.stdout.getvalue()');

        return { success: true, output: output || '(código executado sem saída)', error: null };

    } catch (error) {
        return { success: false, output: null, error: error.message };
    }
}

async function testPythonCodeBasic(code, testCases) {
    if (!pyodideReady) {
        return { success: false, message: 'Interpretador Python ainda carregando...', passedTests: 0, totalTests: testCases.length };
    }

    let passedTests = 0;
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        try {
            const inputs = test.input ? test.input.split('\n') : [];

            if (inputs.length > 0) {
                await pyodide.runPythonAsync(`_input_simulator.set_inputs(${JSON.stringify(inputs)})`);
            }

            await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
            await pyodide.runPythonAsync(code);
            const output = await pyodide.runPythonAsync('sys.stdout.getvalue()');

            const passed = test.expectedOutput
                ? output.includes(test.expectedOutput) || output.trim() === test.expectedOutput.trim()
                : test.validator ? test.validator(output) : true;

            if (passed) passedTests++;

            results.push({ testNumber: i + 1, passed, input: test.input || 'N/A', expected: test.expectedOutput || 'Validação customizada', got: output.trim() });

        } catch (error) {
            results.push({ testNumber: i + 1, passed: false, input: test.input || 'N/A', expected: test.expectedOutput || 'Validação customizada', error: error.message });
        }
    }

    return {
        success: passedTests === testCases.length,
        message: `${passedTests}/${testCases.length} testes passaram`,
        passedTests,
        totalTests: testCases.length,
        results
    };
}


// ============================================================================
// API BACKEND — CONFIGURAÇÃO E COMUNICAÇÃO
// FIX 2: apiOnline como flag global; todas as funções dependem dela
// ============================================================================

const API_URL = 'https://jogo-l-gica-python-ea6n.onrender.com/api';
let apiOnline = false;

async function checkApiHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('✅ API Backend conectada:', data.message);
        apiOnline = true;
        updateApiStatus(true);
        return true;
    } catch (error) {
        console.warn('⚠️ API Backend offline. Usando validação básica.');
        apiOnline = false;
        updateApiStatus(false);
        return false;
    }
}

async function validateWithAI(code, challenge, testOutput) {
    // FIX 2: curto-circuita imediatamente se API offline
    if (!apiOnline) return null;

    try {
        const response = await fetch(`${API_URL}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                challenge: { title: challenge.title, task: challenge.task, hint: challenge.hint },
                test_output: testOutput
            })
        });

        if (!response.ok) {
            console.warn('validateWithAI: resposta não-ok', response.status);
            return null;
        }
        return await response.json();

    } catch (e) {
        console.warn('validateWithAI falhou, usando fallback:', e.message);
        return null;
    }
}

async function getSmartHint(code, challenge) {
    if (!apiOnline) return null;

    try {
        const response = await fetch(`${API_URL}/hint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, challenge: { task: challenge.task, hint: challenge.hint } })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.success ? data.hint : null;
    } catch (e) {
        console.warn('getSmartHint falhou:', e.message);
        return null;
    }
}

async function explainError(code, error) {
    if (!apiOnline) return null;

    try {
        const response = await fetch(`${API_URL}/explain-error`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, error })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.success ? data.explanation : null;
    } catch (e) {
        console.warn('explainError falhou:', e.message);
        return null;
    }
}


// ============================================================================
// DESAFIOS
// ============================================================================

const challenges = {
    1: {
        title: "🏠 Olá, Mundo!",
        story: "Bem-vindo ao mundo da programação! Todo programador começa com o clássico 'Olá, Mundo!'. É hora de dar seu primeiro passo.",
        task: "Crie um programa que exiba a mensagem 'Olá, Mundo!' na tela.",
        hint: "Use print() para exibir mensagens na tela.",
        starterCode: "# Escreva seu código aqui\n",
        testCases: [{ description: "Exibir 'Olá, Mundo!'", validator: (o) => o.includes("Olá") || o.includes("Mundo") || o.toLowerCase().includes("hello") }],
        reward_xp: 100, reward_item: "🌍 Globo do Conhecimento"
    },
    2: {
        title: "👋 Cumprimentando pelo Nome",
        story: "Você impressionou seu chefe! Agora ele quer um programa que cumprimente as pessoas pelo nome.",
        task: "Peça o nome do usuário e exiba uma mensagem de boas-vindas personalizada.",
        hint: "Use input() para coletar dados do usuário.",
        starterCode: "# Peça o nome e exiba uma saudação\n",
        testCases: [{ description: "Cumprimentar João", input: "João", validator: (o) => o.includes("João") }],
        reward_xp: 120, reward_item: "👤 Badge de Identificação"
    },
    3: {
        title: "🔢 Somador Básico",
        story: "A empresa precisa somar valores rapidamente. Crie um programa que soma dois números.",
        task: "Peça dois números ao usuário, some-os e exiba o resultado.",
        hint: "Lembre-se de converter as entradas para números!",
        starterCode: "# Peça dois números, some e exiba o resultado\n",
        testCases: [
            { description: "Somar 5 + 3", input: "5\n3", validator: (o) => o.includes("8") },
            { description: "Somar 10 + 15", input: "10\n15", validator: (o) => o.includes("25") }
        ],
        reward_xp: 150, reward_item: "➕ Símbolo da Soma"
    },
    4: {
        title: "🧮 Calculadora Simples",
        story: "Agora precisamos de uma calculadora completa! Crie um programa que faça as 4 operações básicas.",
        task: "Peça dois números e um operador (+, -, *, /). Execute a operação e exiba o resultado.",
        hint: "Use condicionais para decidir qual operação fazer.",
        starterCode: "# Crie uma calculadora com as 4 operações\n",
        testCases: [{ description: "Multiplicar 6 * 7", input: "6\n7\n*", validator: (o) => o.includes("42") }],
        reward_xp: 180, reward_item: "🧮 Calculadora Básica"
    },
    5: {
        title: "🎯 Maior ou Menor",
        story: "Seu chefe quer comparar valores. Crie um sistema que identifique qual número é maior.",
        task: "Peça dois números ao usuário e informe qual deles é o maior (ou se são iguais).",
        hint: "Use operadores de comparação.",
        starterCode: "# Compare dois números\n",
        testCases: [
            { description: "Comparar 10 e 5", input: "10\n5", validator: (o) => o.includes("10") && (o.toLowerCase().includes("maior") || o.includes(">")) },
            { description: "Números iguais", input: "7\n7", validator: (o) => o.toLowerCase().includes("iguais") || o.toLowerCase().includes("mesmo") }
        ],
        reward_xp: 200, reward_item: "⚖️ Balança da Comparação"
    },
    6: {
        title: "🔢 Par ou Ímpar",
        story: "A empresa precisa classificar números. Crie um detector de paridade!",
        task: "Peça um número ao usuário e diga se ele é par ou ímpar.",
        hint: "O operador % pode ajudar você a descobrir o resto de uma divisão.",
        starterCode: "# Verifique se é par ou ímpar\n",
        testCases: [
            { description: "Número par (10)", input: "10", validator: (o) => { const l = o.toLowerCase(); return l.includes("par") && !l.includes("ímpar") && !l.includes("impar"); } },
            { description: "Número ímpar (7)", input: "7", validator: (o) => { const l = o.toLowerCase(); return l.includes("ímpar") || l.includes("impar"); } }
        ],
        reward_xp: 220, reward_item: "⚖️ Medidor de Paridade"
    },
    7: {
        title: "🔄 Contador Regressivo",
        story: "A empresa precisa de um contador para uma apresentação importante!",
        task: "Crie um programa que conte de 10 até 1 e depois exiba 'LANÇAMENTO!'",
        hint: "Loops podem ajudar com contagens. Pense em como contar de forma decrescente.",
        starterCode: "# Faça uma contagem regressiva\n",
        testCases: [{ description: "Contagem de 10 a 1", validator: (o) => o.includes("10") && o.includes("1") && (o.includes("LANÇAMENTO") || o.includes("lançamento")) }],
        reward_xp: 250, reward_item: "🚀 Foguete do Loop"
    },
    8: {
        title: "📊 Calculadora de Média",
        story: "Seu chefe precisa calcular a média de notas dos funcionários.",
        task: "Peça 3 notas ao usuário, calcule e exiba a média.",
        hint: "Média é a soma dividida pela quantidade.",
        starterCode: "# Calcule a média de 3 notas\n",
        testCases: [{ description: "Média de 8, 7 e 9", input: "8\n7\n9", validator: (o) => o.includes("8") || o.includes("8.0") }],
        reward_xp: 280, reward_item: "📐 Régua da Precisão"
    },
    9: {
        title: "🔐 Verificador de Senha",
        story: "A segurança da empresa está em suas mãos! Crie um sistema que verifique senhas.",
        task: "Defina uma senha secreta no código. Peça ao usuário para digitar a senha e diga se está correta ou incorreta.",
        hint: "Compare a senha digitada com a senha definida no seu código.",
        starterCode: "# Defina uma senha e peça ao usuário\n",
        testCases: [{ description: "Senha correta", input: "python123", validator: (o) => o.toLowerCase().includes("correta") || o.toLowerCase().includes("acesso") || o.toLowerCase().includes("bem-vindo") }],
        reward_xp: 300, reward_item: "🔒 Cadeado Digital"
    },
    10: {
        title: "🎲 Jogo de Adivinhação",
        story: "Crie um jogo simples onde o computador 'pensa' em um número!",
        task: "Defina um número secreto no código (entre 1 e 10). Peça ao usuário para adivinhar. Diga se acertou ou se o número secreto é maior/menor.",
        hint: "Use comparações para dar dicas ao jogador.",
        starterCode: "# Crie um jogo de adivinhação\n",
        testCases: [{ description: "Usuário acerta o número", input: "7", validator: (o) => o.toLowerCase().includes("acertou") || o.toLowerCase().includes("parabéns") || o.toLowerCase().includes("correto") }],
        reward_xp: 320, reward_item: "🎲 Dado da Sorte"
    },
    11: {
        title: "📈 Caçador do Maior",
        story: "Seu chefe precisa encontrar o maior valor rapidamente!",
        task: "Peça 5 números ao usuário e exiba qual é o maior.",
        hint: "Compare cada número e guarde o maior que encontrar.",
        starterCode: "# Encontre o maior entre 5 números\n",
        testCases: [{ description: "Encontrar maior entre 5 números", input: "10\n50\n30\n80\n20", validator: (o) => o.includes("80") }],
        reward_xp: 350, reward_item: "📊 Lupa Analítica"
    },
    12: {
        title: "📝 Lista de Tarefas",
        story: "A empresa precisa de um sistema simples para gerenciar tarefas!",
        task: "Crie uma lista vazia. Peça ao usuário para adicionar 3 tarefas à lista e depois exiba todas elas.",
        hint: "Listas podem armazenar múltiplos valores. Pesquise como adicionar itens a uma lista.",
        starterCode: "# Crie uma lista e adicione tarefas\n",
        testCases: [{ description: "Adicionar 3 tarefas", input: "Estudar Python\nFazer exercícios\nRevisar código", validator: (o) => o.includes("Estudar Python") && o.includes("exercícios") && o.includes("código") }],
        reward_xp: 380, reward_item: "📋 Pergaminho de Tarefas"
    },
    13: {
        title: "🔤 Contador de Vogais",
        story: "Um cliente quer analisar textos e contar vogais!",
        task: "Peça uma palavra ao usuário e conte quantas vogais ela possui.",
        hint: "Percorra cada letra e verifique se é uma vogal (a, e, i, o, u).",
        starterCode: "# Conte as vogais de uma palavra\n",
        testCases: [
            { description: "Contar vogais em 'Python'", input: "Python", validator: (o) => o.includes("1") || o.includes("uma") },
            { description: "Contar vogais em 'Programacao'", input: "Programacao", validator: (o) => o.includes("5") || o.includes("cinco") }
        ],
        reward_xp: 400, reward_item: "🎵 Detector de Vogais"
    },
    14: {
        title: "🔄 Inversor de Texto",
        story: "Um cliente pediu uma ferramenta que inverta textos para mensagens secretas!",
        task: "Peça uma palavra ou frase ao usuário e exiba ela invertida.",
        hint: "Python tem formas especiais de manipular strings. Pesquise sobre fatiamento de strings.",
        starterCode: "# Inverta um texto\n",
        testCases: [{ description: "Inverter 'Python'", input: "Python", validator: (o) => o.includes("nohtyP") }],
        reward_xp: 420, reward_item: "🔄 Espelho de Texto"
    },
    15: {
        title: "🧮 Tabuada Completa",
        story: "Crie um gerador de tabuada para ajudar estudantes!",
        task: "Peça um número ao usuário e exiba a tabuada desse número (de 1 a 10).",
        hint: "Use um loop para multiplicar o número por 1, 2, 3... até 10.",
        starterCode: "# Gere uma tabuada\n",
        testCases: [{ description: "Tabuada do 5", input: "5", validator: (o) => o.includes("5") && o.includes("10") && (o.includes("50") || o.includes("= 50")) }],
        reward_xp: 450, reward_item: "✖️ Tabela Multiplicadora"
    },
    16: {
        title: "🔢 Calculadora de Fatorial",
        story: "A equipe de matemática precisa calcular fatoriais rapidamente!",
        task: "Peça um número ao usuário e calcule seu fatorial. Ex: 5! = 5×4×3×2×1 = 120",
        hint: "Use um loop para multiplicar números em sequência.",
        starterCode: "# Calcule o fatorial\n",
        testCases: [
            { description: "Fatorial de 5", input: "5", validator: (o) => o.includes("120") },
            { description: "Fatorial de 3", input: "3", validator: (o) => o.includes("6") }
        ],
        reward_xp: 480, reward_item: "✖️ Multiplicador Fatorial"
    },
    17: {
        title: "💰 Conversor de Moedas",
        story: "A empresa expandiu internacionalmente! Crie um conversor de Real para Dólar.",
        task: "Peça um valor em Reais ao usuário e converta para Dólares (use cotação de 5.0). Exiba o resultado.",
        hint: "Divida o valor em reais pela cotação para obter o valor em dólares.",
        starterCode: "# Converta Real para Dólar\n",
        testCases: [{ description: "Converter R$ 100", input: "100", validator: (o) => o.includes("20") || o.includes("20.0") }],
        reward_xp: 500, reward_item: "💵 Nota de Dólar"
    },
    18: {
        title: "🎯 Verificador de Nota",
        story: "Crie um sistema que classifique alunos baseado em suas notas!",
        task: "Peça uma nota (0-100). Classifique: A (90-100), B (80-89), C (70-79), D (60-69), F (0-59).",
        hint: "Use estruturas condicionais para verificar os intervalos.",
        starterCode: "# Classifique a nota\n",
        testCases: [
            { description: "Nota 95 = A", input: "95", validator: (o) => o.includes("A") },
            { description: "Nota 75 = C", input: "75", validator: (o) => o.includes("C") }
        ],
        reward_xp: 520, reward_item: "🎓 Diploma de Avaliação"
    },
    19: {
        title: "🔍 Localizador de Letra",
        story: "Crie uma ferramenta que encontre a posição de uma letra em uma palavra!",
        task: "Peça uma palavra e uma letra. Exiba todas as posições onde a letra aparece.",
        hint: "Percorra a palavra e anote as posições onde encontrar a letra.",
        starterCode: "# Encontre posições de uma letra\n",
        testCases: [{ description: "Letra 'o' em 'Python'", input: "Python\no", validator: (o) => o.includes("4") }],
        reward_xp: 550, reward_item: "🔍 Lente de Busca"
    },
    20: {
        title: "📊 Estatísticas de Lista",
        story: "Crie um analisador estatístico completo!",
        task: "Peça 5 números. Calcule e exiba: soma, média, maior e menor valor.",
        hint: "Existem funções prontas em Python para calcular soma, máximo e mínimo.",
        starterCode: "# Calcule estatísticas\n",
        testCases: [{ description: "Analisar números", input: "10\n20\n30\n40\n50", validator: (o) => o.includes("150") && o.includes("30") && o.includes("50") && o.includes("10") }],
        reward_xp: 600, reward_item: "📈 Analisador Estatístico"
    },
    21: {
        title: "🎮 Mini Sistema de RPG",
        story: "Crie um mini sistema de RPG com personagem e batalha!",
        task: "Crie um personagem com nome e vida (100). Peça quantos ataques ele sofreu. Cada ataque tira 15 de vida. Exiba se sobreviveu ou morreu.",
        hint: "Subtraia o dano da vida e verifique se ainda tem vida positiva.",
        starterCode: "# Crie um sistema de vida\n",
        testCases: [{ description: "Personagem sobrevive (3 ataques)", input: "Herói\n3", validator: (o) => { const l = o.toLowerCase(); return l.includes("vivo") || l.includes("sobrevive") || o.includes("55"); } }],
        reward_xp: 700, reward_item: "⚔️ Espada do Guerreiro"
    },
    22: {
        title: "🌟 O Mestre Supremo",
        story: "PARABÉNS! Você se tornou um verdadeiro mestre da lógica de programação! Completou todos os 21 desafios e está pronto para enfrentar qualquer problema!",
        type: "celebration",
        task: "Você venceu! Receba sua recompensa final e compartilhe sua conquista!",
        hint: "Você é incrível! 🎉",
        testCases: [],
        reward_xp: 2000, reward_item: "🏆 Troféu de Lógica Suprema"
    }
};


// ============================================================================
// DICAS
// ============================================================================

const extraHints = {
    1:  ["A função print() exibe mensagens na tela", "Coloque o texto entre aspas (simples ou duplas)", "Não esqueça os parênteses após print"],
    2:  ["A função input() captura o que o usuário digita", "Você pode combinar input() com print() para exibir mensagens", "Guarde o resultado do input() em uma variável"],
    3:  ["Use int() ou float() para transformar texto em número", "Você precisa converter AMBAS as entradas", "O símbolo de soma em Python é +"],
    4:  ["Use if, elif e else para testar diferentes operadores", "Compare o operador digitado com '+', '-', '*' e '/'", "Não esqueça de converter os números antes de operar"],
    5:  ["Use > para maior, < para menor", "Não esqueça do caso onde os números são iguais", "Teste todos os três casos: maior, menor e igual"],
    6:  ["O operador % retorna o resto da divisão", "Se o resto da divisão por 2 é zero, o número é par", "Caso contrário, o número é ímpar"],
    7:  ["Loops ajudam a repetir ações múltiplas vezes", "Pense em como fazer a contagem ir de 10 para 1", "Não esqueça da mensagem final após o loop"],
    8:  ["Média = soma de todos / quantidade de números", "Você precisa somar as 3 notas primeiro", "Divida o resultado por 3"],
    9:  ["Defina a senha no próprio código antes de pedir ao usuário", "Compare a senha digitada com a senha que você definiu", "Use == para comparar se são iguais"],
    10: ["Defina o número secreto no código antes de pedir o palpite", "Compare o palpite com o número secreto", "Dê diferentes mensagens para: acertou, muito alto, muito baixo"],
    11: ["Comece guardando o primeiro número como o maior", "Para cada novo número, compare se é maior que o atual maior", "Se for maior, atualize sua variável"],
    12: ["Crie uma lista vazia com colchetes: []", "Pesquise como adicionar itens a uma lista em Python", "Você pode usar um loop para pedir 3 tarefas"],
    13: ["Use um contador começando em zero", "Percorra cada letra da palavra", "Verifique se a letra é 'a', 'e', 'i', 'o' ou 'u'"],
    14: ["Python permite fatiar strings de várias formas", "Pesquise sobre 'string slicing' em Python", "Há uma forma especial de inverter usando [::]"],
    15: ["Use um loop de 1 até 10", "Em cada iteração, multiplique o número pelo contador", "Exiba o resultado de cada multiplicação"],
    16: ["Comece com o resultado igual a 1", "Multiplique por cada número de 1 até n", "Use um loop para fazer as multiplicações"],
    17: ["Defina a cotação como uma constante (5.0)", "Divida o valor em reais pela cotação", "O resultado será o valor em dólares"],
    18: ["Use estruturas condicionais (if, elif, else)", "Comece verificando do maior para o menor", "A >= 90, B >= 80, C >= 70, D >= 60, F < 60"],
    19: ["Use um loop para percorrer cada posição da palavra", "Guarde as posições onde encontrar a letra", "Lembre-se que a primeira posição é 0"],
    20: ["Guarde os 5 números em uma lista", "Python tem funções prontas: sum(), max(), min(), len()", "Média = sum(lista) / len(lista)"],
    21: ["Comece com vida = 100", "Cada ataque reduz 15 de vida", "Verifique se a vida ficou maior que 0"],
    22: ["Você já venceu! 🏆", "Compartilhe sua conquista!", "Continue praticando para se tornar ainda melhor!"]
};

const genericHints = [
    "Revise o enunciado com atenção, ele já contém pistas importantes.",
    "Teste seu código em pequenos passos, não tente resolver tudo de uma vez.",
    "Use variáveis com nomes claros para não se perder.",
    "Você pode testar partes do código separadamente.",
    "Leia a mensagem de erro com atenção - ela indica o problema.",
    "Tente resolver com um exemplo simples primeiro."
];

let usedHintsByLevel = {};


// ============================================================================
// ESTADO DO JOGO
// FIX 1: totalLevels vem de Object.keys(challenges).length — nunca undefined
// ============================================================================

let gameState = {
    currentLevel: 1,
    totalLevels: Object.keys(challenges).length,  // 22
    xp: 0,
    energy: 2,
    knowledge: 'Iniciante',
    inventory: [],
    completedChallenges: [],
    playerName: ''
};


// ============================================================================
// UI — ATUALIZAÇÃO
// FIX 3: updateUI já inclui inventory count e progress text — sem monkey-patch
// ============================================================================

function updateUI() {
    document.getElementById('xp').textContent = gameState.xp;
    document.getElementById('level').textContent = gameState.currentLevel;
    document.getElementById('energy').textContent = gameState.energy;

    // Nível de conhecimento baseado em XP
    if (gameState.xp >= 3500)      gameState.knowledge = '🌟 Mestre Supremo';
    else if (gameState.xp >= 2500) gameState.knowledge = '👑 Mestre';
    else if (gameState.xp >= 1500) gameState.knowledge = '🎓 Avançado';
    else if (gameState.xp >= 800)  gameState.knowledge = '⚡ Intermediário';
    else if (gameState.xp >= 300)  gameState.knowledge = '🔥 Novato+';
    document.getElementById('knowledge').textContent = gameState.knowledge;

    // Barra de progresso (fases 1–21; fase 22 é celebração)
    const realTotal = gameState.totalLevels - 1;
    const progressPct = Math.min(Math.round((gameState.currentLevel / realTotal) * 100), 100);
    const progressBar = document.getElementById('progress');
    if (progressBar) progressBar.style.width = progressPct + '%';

    // Textos de progresso (FIX 3: direto aqui, sem monkey-patch)
    const progressText = document.getElementById('progress-text');
    const currentPhase = document.getElementById('current-phase');
    const totalPhases  = document.getElementById('total-phases');
    if (progressText) progressText.textContent = `${progressPct}%`;
    if (currentPhase) currentPhase.textContent  = `Fase ${gameState.currentLevel}`;
    if (totalPhases)  totalPhases.textContent   = `de ${realTotal}`;

    // Inventário
    const inventoryDiv = document.getElementById('inventory');
    if (inventoryDiv) {
        inventoryDiv.innerHTML = '';
        gameState.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.textContent = item;
            inventoryDiv.appendChild(itemDiv);
        });
    }

    // Contagem de itens (FIX 3: direto aqui, sem monkey-patch)
    const inventoryCount = document.getElementById('inventory-count');
    if (inventoryCount) {
        const n = gameState.inventory.length;
        inventoryCount.textContent = n === 1 ? '1 item' : `${n} itens`;
    }

    updateHintButton();
}

function updateHintButton() {
    const btn = document.getElementById('btnHintUI');
    if (btn) {
        btn.disabled = gameState.energy <= 0;
        btn.title = gameState.energy <= 0
            ? 'Sem energia — avance de fase para recuperar'
            : 'Usa 1 energia para dica extra';
    }
}

function updateHintsField() {
    const level = gameState.currentLevel;
    const total = extraHints[level]?.length || 0;
    const el = document.getElementById('hintCount');
    if (el) el.textContent = `💡 ${total}`;
}

function updateApiStatus(isOnline) {
    const indicator = document.getElementById('api-status-indicator');
    if (!indicator) return;
    const dot  = indicator.querySelector('.status-dot');
    const text = indicator.querySelector('.status-text');
    if (isOnline) { dot.className = 'status-dot online';  text.textContent = 'IA Online'; }
    else          { dot.className = 'status-dot offline'; text.textContent = 'Modo Offline'; }
}

function showAILoading(message = 'Analisando seu código...') {
    const loading = document.getElementById('ai-loading');
    const status  = document.getElementById('ai-loading-status');
    if (loading) { loading.style.display = 'flex'; if (status) status.textContent = message; }
}

function hideAILoading() {
    const loading = document.getElementById('ai-loading');
    if (loading) loading.style.display = 'none';
}

function showScoreBadge(score) {
    const badge = document.getElementById('score-badge');
    if (!badge) return;

    const scoreValue     = document.getElementById('score-value');
    const badgeContent   = badge.querySelector('.score-badge-content');
    const progressCircle = document.getElementById('score-circle-progress');

    if (badgeContent) {
        let level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
        badgeContent.setAttribute('data-score', level);
    }

    if (progressCircle) {
        const offset = 283 - (score / 100) * 283;
        progressCircle.style.strokeDashoffset = offset;
    }

    badge.style.display = 'block';

    let current = 0;
    const increment = score / (1000 / 16);
    const animate = () => {
        current += increment;
        if (current >= score) { if (scoreValue) scoreValue.textContent = Math.round(score); }
        else { if (scoreValue) scoreValue.textContent = Math.round(current); requestAnimationFrame(animate); }
    };
    animate();

    setTimeout(() => { badge.style.display = 'none'; }, 5000);
}

function showFeedback(message, type = 'success') {
    const old = document.getElementById('customAlert');
    if (old) old.remove();

    const alertDiv = document.createElement('div');
    alertDiv.id = 'customAlert';
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.innerHTML = message;

    const codeInput = document.getElementById('code-input');
    if (codeInput && codeInput.parentElement && codeInput.parentElement.parentElement) {
        codeInput.parentElement.parentElement.insertBefore(alertDiv, codeInput.parentElement);
    } else {
        document.body.appendChild(alertDiv);
    }

    setTimeout(() => {
        alertDiv.classList.add('hide');
        setTimeout(() => alertDiv.remove(), 600);
    }, 5000);
}


// ============================================================================
// CARREGAR DESAFIO
// ============================================================================

function loadChallenge(levelNum) {
    const challenge  = challenges[levelNum];
    const contentDiv = document.getElementById('game-content');

    // Energia por fase
    if      (levelNum === 1)               gameState.energy = 2;
    else if (levelNum >= 2 && levelNum <= 20) gameState.energy = Math.min(levelNum, 15);
    else if (levelNum === 21)              gameState.energy = 20;
    else                                   gameState.energy = 2;

    updateUI();

    // Tela de celebração (fase 22)
    if (levelNum === 22) {
        const energyStat = document.getElementById('energy');
        if (energyStat && energyStat.parentElement) {
            energyStat.parentElement.style.display = 'none';
        }

        // Só adiciona XP/item da celebração uma vez
        if (!gameState.completedChallenges.includes(22)) {
            gameState.xp += challenge.reward_xp;
            gameState.inventory.push(challenge.reward_item);
            gameState.completedChallenges.push(22);
            updateUI();
        }

        contentDiv.innerHTML = `
            <div class="story-text">
                <h2 style="color:#00e676;">🌟 MESTRE SUPREMO!</h2>
                <p>${challenge.story}</p>
            </div>
            <div style="text-align:center;margin:40px 0;">
                <div style="font-size:80px;margin:20px 0;">🎉🏆🎉</div>
                <h3 style="color:#00e676;">VOCÊ É UM MESTRE!</h3>
                <p style="font-size:1.2rem;">Completou todos os ${gameState.totalLevels - 1} desafios!</p>
                <div class="stats" style="margin:30px 0;display:flex;justify-content:center;gap:40px;">
                    <div class="stat"><div>Total de XP</div><div style="font-size:28px;color:#00e676;">${gameState.xp}</div></div>
                    <div class="stat"><div>Itens Coletados</div><div style="font-size:28px;color:#00e676;">${gameState.inventory.length}</div></div>
                </div>
                <button class="btn" onclick="restartGame()">🔄 Jogar Novamente</button>
                <button class="btn" onclick="shareResults()">📤 Compartilhar Resultado</button>
            </div>`;

        if (typeof confetti === 'function') {
            confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => confetti({ particleCount: 150, angle: 60,  spread: 70, origin: { x: 0 } }), 300);
            setTimeout(() => confetti({ particleCount: 150, angle: 120, spread: 70, origin: { x: 1 } }), 600);
        }
        return;
    }

    contentDiv.innerHTML = `
        <div class="story-text">
            <h2>${challenge.title}</h2>
            <p>${challenge.story}</p>
        </div>
        <div class="challenge-area">
            <h3>🎯 Sua Missão:</h3>
            <p>${challenge.task}</p>
            <p><strong>💡 Dica:</strong> ${challenge.hint}</p>
            <p><strong>⚡ Energia:</strong> ${gameState.energy}</p>
            <div style="margin:20px 0;">
                <label for="code-input"><strong>Escreva seu código Python:</strong></label>
                <textarea id="code-input" class="code-input" placeholder="${challenge.starterCode || '# Digite seu código aqui...'}">${challenge.starterCode || ''}</textarea>
            </div>
            <div style="margin:20px 0;display:flex;gap:10px;flex-wrap:wrap;">
                <button class="btn" onclick="runCode()">▶️ Executar Código</button>
                <button class="btn" onclick="checkSolution()">✅ Verificar Solução</button>
                <button class="btn" onclick="getHint()" id="btnHintUI">💡 Dica Extra</button>
                <button class="btn" onclick="showUsedHints()" id="btnUsedHints">📜 Ver Dicas Usadas</button>
            </div>
            <div id="code-output" class="code-output hidden"></div>
            <div id="test-results" class="test-results hidden"></div>
        </div>`;

    if (!Array.isArray(usedHintsByLevel[levelNum])) usedHintsByLevel[levelNum] = [];
    updateHintsField();
}


// ============================================================================
// EXECUTAR CÓDIGO
// ============================================================================

async function runCode() {
    const code      = document.getElementById('code-input').value;
    const outputDiv = document.getElementById('code-output');

    if (!code.trim()) { showFeedback('⚠️ Por favor, escreva algum código primeiro!', 'error'); return; }
    if (!pyodideReady) { showFeedback('⏳ Aguarde o interpretador Python carregar...', 'error'); return; }

    outputDiv.classList.remove('hidden');
    outputDiv.innerHTML = '<div style="color:#00e676;">>>> Executando código...<span class="terminal-cursor">|</span></div>';

    const result = await executePythonCode(code, []);

    if (result.success) {
        outputDiv.innerHTML = `
            <div style="color:#00e676;">✅ Código executado com sucesso!</div>
            <div style="margin-top:10px;padding:10px;background:#0a1929;border-radius:5px;">
                <strong>Saída:</strong><br>
                <pre style="margin:5px 0;white-space:pre-wrap;">${result.output || '(sem saída)'}</pre>
            </div>`;
    } else {
        const explanation = await explainError(code, result.error);
        outputDiv.innerHTML = `
            <div style="color:#ff5722;">❌ Erro na execução!</div>
            <div style="margin-top:10px;padding:10px;background:#0a1929;border-radius:5px;">
                <strong>Erro:</strong><br>
                <pre style="margin:5px 0;color:#ff5722;white-space:pre-wrap;">${result.error}</pre>
            </div>
            ${explanation ? `
            <div style="margin-top:10px;padding:10px;background:#1a2332;border-radius:5px;border-left:3px solid #00e676;">
                <strong>💡 Explicação:</strong><br><p style="margin:5px 0;">${explanation}</p>
            </div>` : ''}`;
    }
}


// ============================================================================
// AVANÇO DE FASE — função isolada
// FIX 1+2+3+4: ponto único de verdade para avançar; usa totalLevels garantido
// ============================================================================

function advanceLevel() {
    const total = gameState.totalLevels || Object.keys(challenges).length;
    console.log(`⏭️ advanceLevel: atual=${gameState.currentLevel}, total=${total}`);

    if (gameState.currentLevel < total) {
        gameState.currentLevel++;
        console.log('✅ Avançou para fase', gameState.currentLevel);
        loadChallenge(gameState.currentLevel);
        updateUI();
    } else {
        console.log('🎉 Todas as fases completadas!');
    }
}


// ============================================================================
// RESULTADO DA VALIDAÇÃO — funções separadas para legibilidade
// ============================================================================

function handleAISuccess(aiValidation, challenge, testResultsDiv) {
    // FIX 4: evita XP/item duplicado em duplo clique
    if (!gameState.completedChallenges.includes(gameState.currentLevel)) {
        gameState.xp += challenge.reward_xp;
        gameState.inventory.push(challenge.reward_item);
        gameState.completedChallenges.push(gameState.currentLevel);
        updateUI();
    }

    const suggestions = aiValidation.suggestions?.length > 0
        ? `<br><br><strong>💡 Sugestões de melhoria:</strong><br>${aiValidation.suggestions.map(s => `• ${s}`).join('<br>')}`
        : '';

    testResultsDiv.innerHTML = `
        <div style="color:#00e676;font-size:1.2rem;margin-bottom:10px;">✅ PARABÉNS! Você passou! 🎉</div>
        <div style="padding:15px;background:#1b4332;border-radius:8px;border:2px solid #00e676;">
            <strong>Pontuação:</strong> ${aiValidation.score}/100<br>
            <strong>Feedback:</strong> ${aiValidation.feedback}<br>
            <strong>Recompensas:</strong> 💪 +${challenge.reward_xp} XP | ${challenge.reward_item}
            ${suggestions}
        </div>`;

    showFeedback(`🎉 ${aiValidation.feedback}`);
    showScoreBadge(aiValidation.score);
    if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => advanceLevel(), 3000);
}

function handleAIFailure(aiValidation, testResultsDiv) {
    const suggestions = aiValidation.suggestions?.length > 0
        ? `<br><br><strong>💡 Sugestões:</strong><br>${aiValidation.suggestions.map(s => `• ${s}`).join('<br>')}`
        : '';

    testResultsDiv.innerHTML = `
        <div style="color:#ff9800;font-size:1.1rem;margin-bottom:10px;">⚠️ Ainda não passou (${aiValidation.score}/100)</div>
        <div style="padding:15px;background:#3a2a1a;border-radius:8px;border:2px solid #ff9800;">
            <strong>Feedback:</strong> ${aiValidation.feedback}${suggestions}
        </div>`;

    showFeedback(aiValidation.feedback, 'error');
    showScoreBadge(aiValidation.score);
}

function handleFallbackSuccess(testResult, challenge, testResultsDiv) {
    // FIX 4: mesma proteção
    if (!gameState.completedChallenges.includes(gameState.currentLevel)) {
        gameState.xp += challenge.reward_xp;
        gameState.inventory.push(challenge.reward_item);
        gameState.completedChallenges.push(gameState.currentLevel);
        updateUI();
    }

    testResultsDiv.innerHTML = `
        <div style="color:#00e676;font-size:1.2rem;margin-bottom:10px;">✅ TODOS OS TESTES PASSARAM! 🎉</div>
        <div style="padding:15px;background:#1b4332;border-radius:8px;border:2px solid #00e676;">
            <strong>Recompensas:</strong><br>💪 +${challenge.reward_xp} XP<br>${challenge.reward_item}
        </div>`;

    showFeedback(`🎉 Excelente! Você ganhou ${challenge.reward_xp} XP!`);
    if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => advanceLevel(), 3000);
}

function handleFallbackFailure(testResult, testResultsDiv) {
    let html = `<div style="color:#ff9800;font-size:1.1rem;margin-bottom:10px;">⚠️ Alguns testes falharam (${testResult.passedTests}/${testResult.totalTests})</div>`;

    testResult.results.forEach(test => {
        const icon  = test.passed ? '✅' : '❌';
        const color = test.passed ? '#00e676' : '#ff5722';
        html += `
            <div style="margin:10px 0;padding:10px;background:#0a1929;border-left:3px solid ${color};border-radius:5px;">
                <div style="color:${color};"><strong>${icon} Teste ${test.testNumber}</strong></div>
                ${test.input !== 'N/A' ? `<div><strong>Entrada:</strong> ${test.input.replace(/\n/g, ', ')}</div>` : ''}
                ${test.error ? `<div style="color:#ff5722;"><strong>Erro:</strong> ${test.error}</div>` : ''}
                ${test.got   ? `<div><strong>Saída obtida:</strong> ${test.got}</div>` : ''}
            </div>`;
    });

    testResultsDiv.innerHTML = html;
    showFeedback(`Quase lá! ${testResult.passedTests}/${testResult.totalTests} testes passaram.`, 'error');
}


// ============================================================================
// CHECK SOLUTION — função principal
// FIX 2: usa apiOnline  |  FIX 4: botão desabilitado + try/finally
// ============================================================================

async function checkSolution() {
    // FIX 4: bloqueia duplo clique
    const submitBtn = document.querySelector('button[onclick="checkSolution()"]');
    if (submitBtn) submitBtn.disabled = true;

    const code           = document.getElementById('code-input').value;
    const challenge      = challenges[gameState.currentLevel];
    const testResultsDiv = document.getElementById('test-results');

    try {
        if (!code.trim()) {
            showFeedback('⚠️ Por favor, escreva seu código primeiro!', 'error');
            return;
        }
        if (!pyodideReady) {
            showFeedback('⏳ Aguarde o interpretador Python carregar...', 'error');
            return;
        }

        testResultsDiv.classList.remove('hidden');
        testResultsDiv.innerHTML = '<div style="color:#00e676;">🧪 Executando testes...<span class="terminal-cursor">|</span></div>';

        // Rodar Python
        const inputs     = challenge.testCases[0]?.input ? challenge.testCases[0].input.split('\n') : [];
        const execResult = await executePythonCode(code, inputs);
        const outputOrError = execResult.output || execResult.error || '';

        showAILoading('Validando com IA...');
        const aiValidation = await validateWithAI(code, challenge, outputOrError);
        hideAILoading();

        if (aiValidation && aiValidation.success) {
            // Rota IA
            if (aiValidation.passed) handleAISuccess(aiValidation, challenge, testResultsDiv);
            else                     handleAIFailure(aiValidation, testResultsDiv);
        } else {
            // Rota fallback
            console.log('⚠️ API offline — usando validação básica');
            const testResult = await testPythonCodeBasic(code, challenge.testCases);
            if (testResult.success) handleFallbackSuccess(testResult, challenge, testResultsDiv);
            else                    handleFallbackFailure(testResult, testResultsDiv);
        }

    } catch (err) {
        hideAILoading();
        console.error('Erro em checkSolution:', err);
        showFeedback('❌ Erro inesperado: ' + err.message, 'error');
    } finally {
        // FIX 4: sempre reabilita o botão
        if (submitBtn) submitBtn.disabled = false;
    }
}


// ============================================================================
// DICAS
// ============================================================================

async function getHint() {
    const level = gameState.currentLevel;

    if (gameState.energy <= 0) {
        const energyCard = document.getElementById('energy')?.parentElement;
        if (energyCard?.classList.contains('stat')) {
            energyCard.classList.add('energy-zero-anim');
            setTimeout(() => energyCard.classList.remove('energy-zero-anim'), 800);
        }
        showFeedback('⚡ Energia insuficiente! Passe de fase para ganhar mais.', 'error');
        return;
    }

    const code      = document.getElementById('code-input')?.value || '';
    const challenge = challenges[level];
    let hintToShow  = null;

    if (code.trim()) hintToShow = await getSmartHint(code, challenge);

    if (!hintToShow) {
        if (!Array.isArray(usedHintsByLevel[level])) usedHintsByLevel[level] = [];
        const phaseHints = extraHints[level] || [];
        const used       = usedHintsByLevel[level].length;

        hintToShow = used < phaseHints.length
            ? phaseHints[used]
            : genericHints[(used - phaseHints.length) % genericHints.length];

        usedHintsByLevel[level].push(hintToShow);
    }

    gameState.energy = Math.max(0, gameState.energy - 1);

    const energyEl = document.getElementById('energy');
    if (energyEl) {
        energyEl.classList.add('energy-anim');
        setTimeout(() => energyEl.classList.remove('energy-anim'), 600);
    }

    showFeedback(`💡 Dica especial: ${hintToShow}`);
    updateUI();
    updateHintsField();
}

function showUsedHints() {
    const level = gameState.currentLevel;
    const used  = usedHintsByLevel[level] || [];
    if (!used.length) { showFeedback('Nenhuma dica utilizada ainda.', 'error'); return; }
    const html = used.map((h, i) => `<div><strong>Dica ${i + 1}:</strong> ${h}</div>`).join('');
    showFeedback(`<strong>Dicas usadas (fase ${level}):</strong><br>${html}`);
}


// ============================================================================
// REINICIAR E COMPARTILHAR
// ============================================================================

function restartGame() {
    gameState = {
        currentLevel: 1,
        totalLevels: Object.keys(challenges).length,
        xp: 0,
        energy: 2,
        knowledge: 'Iniciante',
        inventory: [],
        completedChallenges: [],
        playerName: ''
    };

    const energyStat = document.getElementById('energy');
    if (energyStat?.parentElement) energyStat.parentElement.style.display = '';

    updateUI();
    loadChallenge(1);
    showFeedback('🔄 Jogo reiniciado! Boa sorte na sua nova jornada!');
}

function shareResults() {
    const message = `🎉 Completei a Aventura do Programador Iniciante!\nXP Total: ${gameState.xp}\nItens Coletados: ${gameState.inventory.length}\nConhecimento: ${gameState.knowledge}\n#PythonLogic #Programming #GameLearning`;

    if (navigator.share) {
        navigator.share({ title: 'Aventura do Programador Iniciante', text: message });
    } else {
        navigator.clipboard.writeText(message).then(() => showFeedback('📋 Resultado copiado para a área de transferência!'));
    }
}

function showWelcomePopup() {
    const overlay = document.createElement('div');
    overlay.className = 'trophy-overlay';
    overlay.id = 'welcomePopup';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="trophy-anim" style="max-width:450px;padding:35px;background:rgba(30,60,114,0.98);border-radius:18px;border:3px solid #00e676;box-shadow:0 8px 32px #000a;text-align:center;">
            <img src="static/img/serpente.png" alt="Serpente" style="width:100px;margin-bottom:20px;filter:drop-shadow(0 0 12px #00e67688);">
            <h2 style="color:#00e676;margin-bottom:15px;">Aventura do Programador com IA!</h2>
            <p style="color:#fff;font-size:1.15rem;margin-bottom:25px;">
                <strong>21 desafios</strong> de lógica Python com:<br>
                🤖 <strong>Validação inteligente por IA</strong><br>
                💡 <strong>Dicas personalizadas</strong><br>
                🐍 <strong>Interpretador Python real</strong>
            </p>
            <button id="btnStartGame" style="padding:14px 36px;font-size:1.15rem;background:#00e676;color:#1e3c72;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">Iniciar Jogo</button>
        </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    document.getElementById('btnStartGame').onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 300);
    };
}


// ============================================================================
// INICIALIZAÇÃO
// FIX 3: sem monkey-patch; tudo está em updateUI diretamente
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    showWelcomePopup();
    updateUI();
    loadChallenge(1);
    initPyodide();

    // Verificar API após 2s (não bloqueia o carregamento)
    setTimeout(() => checkApiHealth(), 2000);
});
