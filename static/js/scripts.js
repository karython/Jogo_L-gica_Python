// ALTERAÇÃO: Easter egg - cobrinha falante no canto inferior
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        if (Math.random() > 0.95) {
            showSnakeBalloon('"Continue codando, jovem desenvolvedor..."');
        }
    }
});

// ALTERAÇÃO: Função de balão da cobrinha (Easter egg)
function showSnakeBalloon(message) {
    // Remove se já existir
    const old = document.getElementById('snakeBalloon');
    if (old) old.remove();
    // Cria container
    const container = document.createElement('div');
    container.id = 'snakeBalloon';
    container.className = 'snake-balloon-container';
    container.innerHTML = `
        <div class="snake-balloon-bubble">
            <span>${message}</span>
        </div>
        <img src="static/img/serpente.png" alt="Cobrinha" class="snake-balloon-img">
    `;
    document.body.appendChild(container);
    setTimeout(() => {
        container.classList.add('show');
    }, 50);
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 600);
    }, 4000);
}
// ALTERAÇÃO: Pop-up de boas-vindas com overlay customizado
function showWelcomePopup() {
    const overlay = document.createElement('div');
    overlay.className = 'trophy-overlay';
    overlay.id = 'welcomePopup';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10001';
    overlay.innerHTML = `
        <div class="trophy-anim" style="max-width: 400px; padding: 32px 32px 24px 32px; background: rgba(30,60,114,0.98); border-radius: 18px; border: 3px solid #00e676; box-shadow: 0 8px 32px #000a; text-align: center;">
            <img src="static/img/serpente.png" alt="Serpente" style="width: 90px; margin-bottom: 18px; filter: drop-shadow(0 0 12px #00e67688);">
            <h2 style="color: #00e676; margin-bottom: 12px;">Bem-vindo(a) à Aventura do Programador Iniciante!</h2>
            <p style="color: #fff; font-size: 1.1rem; margin-bottom: 24px;">Prepare-se para uma jornada épica de lógica e desafios em Python.<br>Quando estiver pronto, clique em <b>Iniciar Jogo</b>!</p>
            <button id="btnStartGame" style="padding: 12px 32px; font-size: 1.1rem; background: #00e676; color: #1e3c72; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s;">Iniciar Jogo</button>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    // ALTERAÇÃO: Animação de entrada/saída do popup de boas-vindas
    overlay.classList.add('popup-anim-enter');
    setTimeout(() => {
        overlay.classList.remove('popup-anim-enter');
    }, 700);
    document.getElementById('btnStartGame').onclick = function() {
        overlay.style.pointerEvents = 'none';
        overlay.style.willChange = 'opacity, transform, filter';
        void overlay.offsetWidth;
        overlay.classList.remove('popup-anim-enter');
        overlay.classList.add('popup-anim-exit');
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 700);
    };
}


// ALTERAÇÃO: Dicas genéricas para quando acabar as específicas da fase
const genericHints = [
    "Revise o enunciado com atenção, ele já contém pistas importantes.",
    "Teste seu código em pequenos passos, não tente resolver tudo de uma vez.",
    "Use variáveis com nomes claros para não se perder.",
    "Lembre-se: você pode imprimir valores intermediários para debugar."
];

// ALTERAÇÃO: Objeto para armazenar dicas usadas por fase
let usedHintsByLevel = {};
// ========================================================================


// ALTERAÇÃO: Função para tornar o número de dicas responsivo ao número da página (fase)
// Exemplo: página 6 = dica 6
function getResponsiveHint(level) {
    // Se existir dica específica para a página, retorna ela
    if (extraHints[level] && extraHints[level].length >= level) {
        return extraHints[level][level - 1];
    }
    // Se não houver dica específica suficiente, retorna uma genérica
    return genericHints[(level - 1) % genericHints.length];
}


// ALTERAÇÃO: Função para atualizar o botão de dicas dentro da UI
function updateHintButton() {
    const btnHintUI = document.getElementById('btnHintUI');
    if (btnHintUI) {
        btnHintUI.disabled = gameState.energy <= 0;
        btnHintUI.title = gameState.energy <= 0
            ? 'Sem energia — avance de fase para recuperar'
            : 'Usa 1 energia para dica extra';
    }
}

// ALTERAÇÃO: Chamada sempre que atualizamos a UI
function updateUI() {
    // ... (seu código de atualização XP, energia, nível etc.)
    updateHintButton();
    // ALTERAÇÃO: Removida a checagem de pop-up de conhecimento daqui. Agora só na transição de página.
}

// ALTERAÇÃO: Função para usar a dica
function getHint() {
    if (gameState.energy > 0) {
        gameState.energy--;

        // Mostrar dica do desafio atual
        const hintBox = document.getElementById('hintBox');
        if (hintBox && challenges[gameState.currentLevel]) {
            hintBox.textContent = challenges[gameState.currentLevel].hint;
            hintBox.style.display = 'block';
        }

        // Atualizar interface (XP, energia e botão)
        updateUI();
    } else {
        alert("Sem energia para usar dica!");
    }
}
function updateHintsField() {
    const level = gameState.currentLevel;
    // O número de dicas disponíveis para a página é igual ao número de dicas em extraHints[level]
    // O saldo não deve ser herdado de outras páginas
    const totalHints = extraHints[level]?.length || 0;
    const used = usedHintsByLevel[level]?.length || 0;
    // Mostra sempre o total de dicas disponíveis para a página atual
    const hintCountEl = document.getElementById("hintCount");
    if (hintCountEl) {
        hintCountEl.textContent = `💡 ${totalHints}`;
    }
}
// ALTERAÇÃO: Evento de DOM carregado
document.addEventListener('DOMContentLoaded', function () {
    // ALTERAÇÃO: Removido função de viajar entre as páginas (seleção manual de página)

    // Atualiza estado do botão
    const btnHintUI = document.getElementById("btnHintUI");
    if (btnHintUI) {
        btnHintUI.disabled = (gameState.energy <= 0);
        btnHintUI.title = btnHintUI.disabled
            ? "Sem energia — avance de fase para recuperar"
            : "Use 1 energia para dica extra";
    }
});
// Estado do jogo
        let gameState = {
            currentLevel: 1,
            xp: 0,
            energy: 2,
            knowledge: 'Iniciante',
            inventory: [],
            completedChallenges: [],
            playerName: '',
            totalLevels: 10
        };

        // Desafios do jogo
       
        const challenges = {
            1: {
                title: "🏠 Bem-vindo à Programação!",
                story: "Você é um jovem desenvolvedor que acabou de conseguir seu primeiro emprego! Seu chefe precisa de um programa simples para coletar informações dos novos funcionários. Vamos começar com o básico!",
                task: "Crie um programa que peça o nome e a idade do usuário e exiba uma mensagem de boas-vindas.",
                hint: "Use input() para coletar dados e print() para exibir a mensagem.",
                solution_pattern: ["input", "print", "nome", "idade"],
                reward_xp: 150,
                reward_item: "🧮 Calculadora Dourada"
            },
            2: {
                title: "🧮 Calculadora Simples",
                story: "Seu chefe agora precisa de uma calculadora simples para somar, subtrair, multiplicar e dividir dois números. Implemente essa calculadora para ajudar a equipe!",
                type: "calculator",
                task: "Crie um programa que peça dois números e um operador (+, -, *, /) e exiba o resultado da operação.",
                hint: "Use float() para converter entradas em números e if/elif para decidir a operação.",
                solution_pattern: ["input", "+", "-", "*", "/", "if", "elif"],
                reward_xp: 180,
                reward_item: "🧮 Calculadora Básica"
            },
            3: {
                title: "🤖 O Robô Decisor",
                story: "A empresa está impressionada com seu trabalho! Agora eles querem um sistema que tome decisões automáticas. Você precisa criar um programa que use estruturas condicionais.",
                type: "conditionals",
                task: "Crie um programa que avalie se um funcionário tem direito a férias (mais de 1 ano na empresa) e se tem direito a bônus (vendas acima de 10000).",
                hint: "Use if, elif e else para criar diferentes caminhos no código",
                solution_pattern: ["if", "elif", "else"],
                reward_xp: 200,
                reward_item: "🎯 Cristal da Decisão"
            },
            4: {
                title: "🔄 A Máquina de Repetições",
                story: "Seu chefe ficou maluco! Ele quer que você processe dados de 100 funcionários. Fazer isso manualmente seria impossível. É hora de usar loops!",
                type: "loops",
                task: "Crie um programa que calcule a média de salários de vários funcionários. Use um loop para continuar pedindo salários até o usuário digitar 'fim'.",
                hint: "Use while ou for para repetir ações. Mantenha uma variável contadora e soma",
                solution_pattern: ["while", "for"],
                reward_xp: 250,
                reward_item: "🔄 Anel da Repetição Infinita"
            },
            5: {
                title: "📝 O Organizador de Dados",
                story: "Parabéns! Você foi promovido a desenvolvedor pleno! Agora precisa organizar dados de funcionários usando listas. A empresa cresceu e os dados estão uma bagunça.",
                type: "lists",
                task: "Crie um programa que gerencie uma lista de funcionários. Deve permitir adicionar, remover e listar todos os funcionários.",
                hint: "Use append(), remove(), e loops para manipular listas",
                solution_pattern: ["append", "remove", "list"],
                reward_xp: 300,
                reward_item: "📋 Pergaminho dos Dados"
            },
            6: {
                title: "🔤 O Decodificador de Strings",
                story: "Um hacker invadiu o sistema da empresa! Todas as senhas foram embaralhadas. Você precisa criar ferramentas para manipular strings e restaurar a ordem.",
                type: "strings",
                task: "Desenvolva um programa que analise passwords: conte caracteres, converta para maiúsculas/minúsculas e verifique se contém números.",
                hint: "Use len(), upper(), lower(), isdigit() e outros métodos de string",
                solution_pattern: ["len", "upper", "lower", "replace"],
                reward_xp: 350,
                reward_item: "🗝️ Chave Decodificadora"
            },
            7: {
                title: "🔢 A Academia dos Números",
                story: "Você descobriu talentos especiais com números! A empresa quer que você crie um sistema de análise de dados numéricos para relatórios financeiros.",
                type: "number_analysis",
                task: "Crie um analisador que receba uma lista de vendas e calcule: maior venda, menor venda, total e média.",
                hint: "Use max(), min(), sum() e len() para análise de dados",
                solution_pattern: ["max", "min", "sum"],
                reward_xp: 400,
                reward_item: "📊 Esfera da Análise"
            },
            8: {
                title: "🏪 O Mercado Virtual",
                story: "Sua fama se espalhou! Agora você foi contratado para criar um sistema de loja virtual. Precisa gerenciar produtos, preços e estoque usando estruturas de dados avançadas.",
                type: "dictionaries",
                task: "Desenvolva um sistema de estoque usando dicionários. Deve permitir consultar preços, atualizar quantidades e adicionar novos produtos.",
                hint: "Use dicionários para associar produtos a informações (preço, quantidade, etc.)",
                solution_pattern: ["dict", "keys", "values"],
                reward_xp: 500,
                reward_item: "🏺 Baú do Tesouro Digital"
            },
            9: {
                title: "🎮 O Grande Desafio",
                story: "Chegou a hora do teste final! O CEO da empresa quer um sistema completo que combine tudo que você aprendeu. Este será seu projeto mais ambicioso!",
                type: "final_project",
                task: "Crie um mini-sistema de RH que: cadastre funcionários (nome, idade, salário), liste todos, calcule folha de pagamento e gere relatórios.",
                hint: "Combine listas, dicionários, loops e condicionais em um programa completo",
                solution_pattern: ["dict", "list", "while", "if"],
                reward_xp: 1000,
                reward_item: "👑 Coroa do Mestre Programador"
            },
            10: {
                title: "🌟 O Mestre Supremo",
                story: "PARABÉNS! Você se tornou um verdadeiro mestre da lógica de programação! Agora pode enfrentar qualquer desafio que aparecer pela frente.",
                type: "celebration",
                task: "Você venceu! Receba sua recompensa final e compartilhe sua conquista!",
                hint: "Você é incrível! 🎉",
                solution_pattern: [],
                reward_xp: 2000,
                reward_item: "🏆 Troféu de Lógica Suprema"
            }
        };

        // Dicas extras por tema
const extraHints = {
    1: [
        "Use input() para coletar dados do usuário.",
        "Utilize print() para exibir mensagens.",
        "Você pode usar f-strings para formatar a mensagem: print(f'Olá, {nome}!')"
    ],
    2: [
        "Use float() para converter entradas em números.",
        "Verifique o operador com if/elif.",
        "Utilize funções para organizar o código da calculadora."
    ],
    3: [
        "Estruturas condicionais: if, elif, else.",
        "Compare valores usando operadores lógicos.",
        "Use variáveis para armazenar resultados das condições."
    ],
    4: [
        "Loops: while ou for.",
        "Use break para sair do loop.",
        "Mantenha uma soma e contador para calcular a média."
    ],
    5: [
        "Listas: append(), remove(), len().",
        "Use for para percorrer a lista.",
        "Crie funções para adicionar e remover funcionários."
    ],
    6: [
        "Métodos de string: upper(), lower(), isdigit().",
        "Use len() para contar caracteres.",
        "Utilize replace() para modificar textos."
    ],
    7: [
        "Funções: max(), min(), sum(), len().",
        "Use listas para armazenar vendas.",
        "Calcule média: sum(lista)/len(lista)."
    ],
    8: [
        "Dicionários: dict(), keys(), values().",
        "Atualize valores com dicionario[chave] = valor.",
        "Use for para percorrer produtos."
    ],
    9: [
        "Combine listas e dicionários.",
        "Use menus interativos com while.",
        "Crie funções para cada operação do RH."
    ],
    10: [
        "Você já venceu! 🏆",
        "Compartilhe sua conquista!",
        "Continue praticando para se tornar ainda melhor."
    ]
};

// Campo para dicas já utilizadas
let usedHints = [];

        // Função para atualizar a interface
        function updateUI() {
            document.getElementById('xp').textContent = gameState.xp;
            document.getElementById('level').textContent = gameState.currentLevel;
            document.getElementById('energy').textContent = gameState.energy;
            document.getElementById('knowledge').textContent = gameState.knowledge;
        // ALTERAÇÃO: Não existe mais card de raios, apenas energia
            
            const progress = (gameState.currentLevel / gameState.totalLevels) * 100;
            document.getElementById('progress').style.width = progress + '%';
            
            // Atualizar conhecimento baseado no XP
            if (gameState.xp >= 2000) gameState.knowledge = '🌟 Mestre Supremo';
            else if (gameState.xp >= 1500) gameState.knowledge = '👑 Mestre';
            else if (gameState.xp >= 1000) gameState.knowledge = '🎓 Avançado';
            else if (gameState.xp >= 500) gameState.knowledge = '⚡ Intermediário';
            else if (gameState.xp >= 200) gameState.knowledge = '🔥 Novato+';
            
            // Atualizar inventário
            const inventoryDiv = document.getElementById('inventory');
            inventoryDiv.innerHTML = '';
            gameState.inventory.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.textContent = item;
                inventoryDiv.appendChild(itemDiv);
            });
        }

        // Função para mostrar feedback
        function showFeedback(message, type = 'success') {
            // Remove alert anterior se existir
            const oldAlert = document.getElementById('customAlert');
            if (oldAlert) oldAlert.remove();
            // Cria novo alerta
            const alertDiv = document.createElement('div');
            alertDiv.id = 'customAlert';
            alertDiv.className = `custom-alert ${type}`;
            alertDiv.innerHTML = message;
            // Insere acima do campo de código
            const codeInput = document.getElementById('code-input');
            if (codeInput && codeInput.parentElement) {
                codeInput.parentElement.parentElement.insertBefore(alertDiv, codeInput.parentElement);
            } else {
                document.body.appendChild(alertDiv);
            }
            setTimeout(() => {
                alertDiv.classList.add('hide');
                setTimeout(() => alertDiv.remove(), 600);
            }, 4000);
        }

        // Função para carregar um desafio
        function loadChallenge(levelNum) {
            const challenge = challenges[levelNum];
            const contentDiv = document.getElementById('game-content'); 
            // Energia inicial por fase (não soma +1 ao avançar)
            if (levelNum === 1) {
                gameState.energy = 2;
            } else if (levelNum >= 2 && levelNum <= 8) {
                gameState.energy = levelNum;
            } else if (levelNum === 9) {
                gameState.energy = 10; // Desafio final
            } else {
                gameState.energy = 2;
            }
            // Atualiza XP da recompensa ANTES de atualizar a UI
            if (levelNum === 10) {
                // ALTERAÇÃO: agora a animação só inicia ao clicar na cobrinha, ver lógica mais abaixo
                // ALTERAÇÃO: Só adiciona XP da recompensa se não foi navegação manual
                if (!window.manualXPSet) {
                    gameState.xp += challenge.reward_xp;
                }
                window.manualXPSet = false;
            }
            // Atualiza o DOM e conhecimento antes de salvar o valor anterior
            updateUI();
            // Salva o nível de conhecimento já atualizado no DOM
            const prevKnowledge = document.getElementById('knowledge').getAttribute('data-prev') || document.getElementById('knowledge').textContent;
            // ALTERAÇÃO: Trigger energy card animation on page advance
            if (typeof triggerRaioAnim === 'function') {
                triggerRaioAnim();
            }
            // ALTERAÇÃO: Após atualizar a UI, verifica se mudou o nível de conhecimento e mostra pop-up só na transição de página
            if (gameState.knowledge !== prevKnowledge) {
                // Atualiza o atributo data-prev para o próximo ciclo
                document.getElementById('knowledge').setAttribute('data-prev', gameState.knowledge);
                let title = '';
                let color = '';
                let emoji = '';
                let message = '';
                switch (gameState.knowledge) {
                    case '🔥 Novato+':
                        title = '🔥 Novato+';
                        color = '#ff5722';
                        emoji = '🔥';
                        message = 'Você agora é um Novato+! Continue praticando para subir de nível!';
                        break;
                    case '⚡ Intermediário':
                        title = '⚡ Intermediário';
                        color = '#ff9800';
                        emoji = '⚡';
                        message = 'Parabéns! Você alcançou o nível Intermediário!';
                        break;
                    case '🎓 Avançado':
                        title = '🎓 Avançado';
                        color = '#2196f3';
                        emoji = '🎓';
                        message = 'Incrível! Agora você é um Programador Avançado!';
                        break;
                    case '👑 Mestre':
                        title = '👑 Mestre';
                        color = '#ffd700';
                        emoji = '👑';
                        message = 'Uau! Você se tornou um Mestre da Programação!';
                        break;
                    case '🌟 Mestre Supremo':
                        title = '🌟 Mestre Supremo';
                        color = '#00e676';
                        emoji = '🌟';
                        message = 'Épico! Você atingiu o nível máximo: Mestre Supremo!';
                        break;
                }
                if (title) { // ALTERAÇÃO: Mostra pop-up de novo nível de conhecimento
                    const overlay = document.createElement('div');
                    overlay.className = 'trophy-overlay';
                    overlay.id = 'knowledgePopup';
                    overlay.innerHTML = `
                        <div class="trophy-anim" style="max-width: 400px; padding: 32px 32px 24px 32px; background: rgba(30,60,114,0.98); border-radius: 18px; border: 3px solid ${color}; box-shadow: 0 8px 32px #000a; text-align: center;">
                            <div style="font-size: 3rem;">${emoji}</div>
                            <div class="trophy-label" style="color: ${color}; font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">${title}</div>
                            <div style="margin: 18px 0; font-size: 1.2rem; color: #fff;">${message}</div>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                    setTimeout(() => {
                        overlay.remove();
                    }, 3500);
                }
            }
            if (levelNum === 10) {
                // ALTERAÇÃO: Remove o card de energia imediatamente ao entrar na página 10
                const energyStat = document.getElementById('energy');
                if (energyStat && energyStat.parentElement) {
                    energyStat.parentElement.style.display = 'none';
                }
                // ALTERAÇÃO: Só adiciona XP da recompensa se não foi navegação manual
                if (!window.manualXPSet) {
                    gameState.xp += challenge.reward_xp;
                }
                window.manualXPSet = false;
                gameState.inventory.push(challenge.reward_item);
                updateUI();

                // ALTERAÇÃO: Fase final especial
                let finalTitle = '';
                let finalEmoji = '';
                let finalColor = '';
                if (gameState.xp >= 2000) {
                    finalTitle = '🌟 MESTRE SUPREMO!';
                    finalEmoji = '🎉🏆🎉';
                    finalColor = '#00e676';
                }

                let popupHtml = `
                    <div class="story-text">
                        <h2 style="color: ${finalColor};">${finalTitle}</h2>
                        <p>${challenge.story}</p>
                    </div>
                <div style="text-align: center; margin: 40px 0;">
                    <div style="font-size: 60px, margin: 20px 0; color: ${finalColor};">${finalEmoji}</div>
                    <h3 style="color: ${finalColor};">${finalTitle}</h3>
                    <p>Você completou todos os desafios e dominou a lógica de programação com Python!</p>
                    <div class="stats" style="margin: 30px 0;">
                        <div class="stat">
                            <div>Total de XP</div>
                            <div style="font-size: 24px; color: ${finalColor};">${gameState.xp}</div>
                        </div>
                        <div class="stat">
                            <div>Itens Coletados</div>
                            <div style="font-size: 24px; color: ${finalColor};">${gameState.inventory.length}</div>
                        </div>
                    </div>
                    <button class="btn" onclick="restartGame()">🔄 Jogar Novamente</button>
                    <button class="btn" onclick="shareResults()">📤 Compartilhar Resultado</button>
                </div>
            </div>
        `;
                contentDiv.innerHTML = popupHtml;

                // ALTERAÇÃO: Pop-up e confete só se XP >= 2000
                if (gameState.xp >= 2000) {
                    showChampionPopup({
                        teamName: 'Mestre Supremo',
                        trophyImg: 'static/img/trofeu_mestre_supremo.png',
                        duration: 4000,
                        confettiOptions: [
                            { particleCount: 150, spread: 70, origin: { y: 0.6 } },
                            { particleCount: 100, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } },
                            { particleCount: 100, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }
                        ]
                    });
                    // ALTERAÇÃO: Exibe a cobrinha parada e só inicia a animação ao clicar nela
                    setTimeout(() => {
                        let danceDiv = document.getElementById('snake-trophy-dance');
                        if (!danceDiv) {
                            danceDiv = document.createElement('div');
                            danceDiv.id = 'snake-trophy-dance';
                            danceDiv.innerHTML = `
                                <div class="snake-trophy-wait-center">
                                    <img src="static/img/serpente.png" class="snake-wait-center" alt="Cobrinha esperando" id="snakeWaitImg" style="cursor:pointer;">
                                </div>
                            `;
                            const gameContent = document.getElementById('game-content');
                            if (gameContent) {
                                gameContent.insertBefore(danceDiv, gameContent.firstChild);
                            }
                            // ALTERAÇÃO: Ao clicar na cobrinha, inicia a animação de corrida e conquista
                            const snakeWaitImg = document.getElementById('snakeWaitImg');
                            if (snakeWaitImg) {
                                snakeWaitImg.addEventListener('click', function startRunAnim() {
                                    // ALTERAÇÃO: Troféu fixo no centro, cobrinha corre separada até ele
                                    danceDiv.innerHTML = `
                                        <div class=\"snake-trophy-run-wrap\">\n\t<img src=\"static/img/trofeu_mestre_supremo.png\" class=\"trophy-run\" alt=\"Troféu central\" id=\"trophyRunImg\">\n\t<img src=\"static/img/correndo-removebg-preview.png\" class=\"snake-run\" alt=\"Cobrinha correndo\" id=\"snakeRunImg\">\n</div>`;
                                    // ALTERAÇÃO: Após a corrida, ambos pulam juntos, balão acima, centralizados
                                    setTimeout(() => {
                                        const runSpace = danceDiv.querySelector('.snake-trophy-run-space');
                                        if (runSpace) {
                                            runSpace.innerHTML = `
                                                <div class=\"snake-trophy-conquer-wrap center-conquer\">\n\	<div class=\"snake-congrats-balloon\">Conseguimos jovem! Parabéns!!</div>\n\	<div class=\"side-by-side-final closer-trophy\">\n\	<img src=\"static/img/serpente.png\" class=\"snake-jump-below\" alt=\"Cobrinha pulando feliz\">\n\	<img src=\"static/img/trofeu_mestre_supremo.png\" class=\"trophy-final-static\" alt=\"Troféu conquistado\">\n\	</div>\n</div>`;
                                        } else {
                                            danceDiv.innerHTML = `
                                                <div class=\"snake-trophy-conquer-wrap center-conquer\">\n\	<div class=\"snake-congrats-balloon\">Conseguimos jovem! Parabéns!!</div>\n\	<div class=\"side-by-side-final closer-trophy\">\n\	<img src=\"static/img/serpente.png\" class=\"snake-jump-below\" alt=\"Cobrinha pulando feliz\">\n\	<img src=\"static/img/trofeu_mestre_supremo.png\" class=\"trophy-final-static\" alt=\"Troféu conquistado\">\n\	</div>\n</div>`;
                                        }
                                    }, 2200);
                                }, { once: true });
                            }
                        }
                    }, 4000); // Espera o pop-up de campeão sumir (4000ms)
                }
                return;
}
            
            let challengeHTML = `
                <div class="story-text">
                    <h2>${challenge.title}</h2>
                    <p>${challenge.story}</p>
                </div>
            `;
            if (levelNum !== 10) {
                challengeHTML += `
                <div class="challenge-area">
                    <h3>🎯 Sua Missão:</h3>
                    <p>${challenge.task}</p>
                    <p><strong>💡 Dica:</strong> ${challenge.hint}</p>
                        <p><strong>⚡ Energia:</strong> ${gameState.energy}</p>
                        <div style="margin: 20px 0;">
                            <label for="code-input"><strong>Escreva seu código Python:</strong></label>
                            <textarea id="code-input" class="code-input" placeholder="# Digite seu código aqui...
    # Exemplo: nome = input('Digite seu nome: ')"></textarea>
                        </div>
                        <div style="margin: 20px 0;">
                            <button class="btn" onclick="runCode()">▶️ Executar Código</button>
                            <button class="btn" id="btnCheckSolution">✅ Verificar Solução</button>
                            <button class="btn" onclick="getHint()" id="btnHintUI">💡 Dica Extra</button>
                            <button class="btn" onclick="showUsedHints()" id="btnUsedHints">📜 Ver Dicas Usadas</button>
                        </div>
                        <div id="code-output" class="code-output hidden">
                            <div>>>> Executando código...<span class="terminal-cursor">|</span></div>
                        </div>
                    </div>
                    `;
            } else {
                // ALTERAÇÃO: Remove qualquer card de dicas, botões ou campos residuais na página 10
                setTimeout(() => {
                    const btnHint = document.getElementById('btnHintUI');
                    if (btnHint) btnHint.style.display = 'none';
                    const btnUsedHints = document.getElementById('btnUsedHints');
                    if (btnUsedHints) btnUsedHints.style.display = 'none';
                    const hintCountEl = document.getElementById('hintCount');
                    if (hintCountEl) hintCountEl.style.display = 'none';
                    // Oculta o card de energia
                    const energyStat = document.getElementById('energy');
                    if (energyStat && energyStat.parentElement) {
                        energyStat.parentElement.style.display = 'none';
                    }
                }, 100);
            }
            
            // Adicionar campos específicos baseado no tipo do desafio
            if (challenge.type === 'input_output' && levelNum === 1) {
                challengeHTML += `
                    <div class="challenge-area" style="border-left-color: #2196f3;">
                        <h3>🎮 Teste Interativo:</h3>
                        <p>Teste seu programa aqui antes de submeter:</p>
                        <input type="text" id="test-name" class="input-field" placeholder="Digite um nome para testar">
                        <input type="number" id="test-age" class="input-field" placeholder="Digite uma idade para testar">
                        <button class="btn" onclick="testProgram()">🧪 Testar Programa</button>
                        <div id="test-result"></div>
                    </div>
                `;
            }
            
            contentDiv.innerHTML = challengeHTML;
            usedHints = [];
            // Ao avançar de página, só inicializa dicas usadas se ainda não existir (não sobrescreve se voltar para uma página já visitada)
            if (!Array.isArray(usedHintsByLevel[levelNum])) {
                usedHintsByLevel[levelNum] = [];
            }
            // Energia inicial por fase
            if (levelNum === 1) {
                gameState.energy = 2;
            } else if (levelNum >= 2 && levelNum <= 8) {
                gameState.energy = levelNum;
            } else if (levelNum === 9) {
                gameState.energy = 10; // Desafio final
            } else {
                gameState.energy = 2;
            }
            updateHintsField();

            // ALTERAÇÃO: Garante que o botão de verificar solução chama a função correta
            setTimeout(() => {
                const btnCheck = document.getElementById('btnCheckSolution');
                if (btnCheck) {
                    // Remove event listeners antigos, se houver
                    const newBtn = btnCheck.cloneNode(true);
                    newBtn.onclick = null;
                    newBtn.addEventListener('click', checkSolution);
                    btnCheck.parentNode.replaceChild(newBtn, btnCheck);
                }
            }, 0);
        }

    // ALTERAÇÃO: Função para executar código (simulação)
        function runCode() {
            const code = document.getElementById('code-input').value;
            const outputDiv = document.getElementById('code-output');
            const btns = document.querySelectorAll('button.btn');
            const btnExec = Array.from(btns).find(b => b.textContent.includes('Executar Código'));

            if (!code.trim()) {
                showFeedback('⚠️ Por favor, escreva algum código primeiro!', 'error');
                return;
            }

            // Loader animado no botão
            if (btnExec) {
                btnExec.disabled = true;
                btnExec.dataset.oldText = btnExec.innerHTML;
                btnExec.innerHTML = '<span class="loader-spin"></span> Executando...';
            }

            outputDiv.classList.remove('hidden');
            outputDiv.innerHTML = '<div>>>> Executando código...<span class="terminal-cursor">|</span></div>';

            setTimeout(() => {
                // Simulação simples de execução
                let output = '>>> Código executado com sucesso!\n';

                if (code.includes('input(')) {
                    output += '(Programa aguardaria entrada do usuário)\n';
                }
                if (code.includes('print(')) {
                    output += 'Mensagem seria exibida na tela\n';
                }

                output += '>>> Pronto para verificação!<span class="terminal-cursor">|</span>';
                outputDiv.innerHTML = output;
                if (btnExec) {
                    btnExec.disabled = false;
                    btnExec.innerHTML = btnExec.dataset.oldText;
                }
            }, 1500);
        }

        // Função para verificar solução

// ALTERAÇÃO: Função global para verificar solução
function checkSolution() {
    const code = document.getElementById('code-input').value.toLowerCase();
    const challenge = challenges[gameState.currentLevel];
    if (!code.trim()) {
        showFeedback('⚠️ Por favor, escreva seu código primeiro!', 'error');
        return;
    }
    // Verificação simples baseada em palavras-chave
    let correctPatterns = 0;
    challenge.solution_pattern.forEach(pattern => {
        if (code.includes(pattern.toLowerCase())) {
            correctPatterns++;
        }
    });
    const accuracy = challenge.solution_pattern.length > 0 ? 
        (correctPatterns / challenge.solution_pattern.length) : 1;
    if (accuracy >= 0.5) {
        // Sucesso!
        gameState.xp += challenge.reward_xp;
        gameState.inventory.push(challenge.reward_item);
        gameState.completedChallenges.push(gameState.currentLevel);
        showFeedback(`🎉 Excelente! Você ganhou ${challenge.reward_xp} XP e um novo item: ${challenge.reward_item}!`);
        setTimeout(() => {
            if (gameState.currentLevel < gameState.totalLevels) {
                gameState.currentLevel++;
                loadChallenge(gameState.currentLevel);
            }
        }, 3000);
    } else {
        gameState.energy -= 10;
        showFeedback(`❌ Quase lá! Seu código está ${Math.round(accuracy * 100)}% correto. Tente usar: ${challenge.solution_pattern.join(', ')}`, 'error');
    }
    updateUI();
}

// ALTERAÇÃO: Garante que o botão 'Verificar Solução' está sempre ligado à função checkSolution
document.addEventListener('DOMContentLoaded', function () {
    const btnCheck = document.getElementById('btnCheckSolution');
    if (btnCheck) {
        btnCheck.addEventListener('click', checkSolution);
    }
});


// ALTERAÇÃO: Função para dar dicas extras
// Função para usar a dica
function getHint() {
    const level = gameState.currentLevel;

    if (gameState.energy <= 0) {
        // animação especial se não há energia
        const energyDiv = document.getElementById('energy');
        const energyCard = energyDiv ? energyDiv.parentElement : null;
        if (energyCard && energyCard.classList.contains('stat')) {
            energyCard.classList.add('energy-zero-anim');
            setTimeout(() => energyCard.classList.remove('energy-zero-anim'), 800);
        }
        showFeedback('⚡ Energia insuficiente! Passe de fase para ganhar mais.', 'error');
        return;
    }

    // inicializa array de dicas usadas para a fase atual

        // Inicializa dicas usadas para a página atual se necessário
        if (!Array.isArray(usedHintsByLevel[level])) {
            usedHintsByLevel[level] = [];
        }

        const phaseHints = extraHints[level] || [];
        let usedThisLevel = usedHintsByLevel[level].length;

        // Permite usar apenas até o número de dicas específicas da página antes de passar para as genéricas
        let hintToShow = null;
        if (usedThisLevel < phaseHints.length) {
            hintToShow = phaseHints[usedThisLevel];
            // Só registra e gasta energia se ainda não usou todas as dicas específicas
            gameState.energy = Math.max(0, gameState.energy - 1);
            usedHintsByLevel[level].push(hintToShow);
        } else {
            // Só permite dicas genéricas se todas as específicas já foram usadas
            const nextGenericIndex = usedThisLevel - phaseHints.length;
            hintToShow = genericHints[nextGenericIndex % genericHints.length];
            gameState.energy = Math.max(0, gameState.energy - 1);
            usedHintsByLevel[level].push(hintToShow);
        }

    // Animação de energia
    const energyDiv = document.getElementById('energy');
    if (energyDiv) {
        energyDiv.classList.add('energy-anim');
        setTimeout(() => energyDiv.classList.remove('energy-anim'), 600);
    }

    showFeedback(`💡 Dica especial: ${hintToShow}`);
    updateUI();
    updateHintsField();
}

// ALTERAÇÃO: Função para mostrar dicas já utilizadas na fase atual
function showUsedHints() {
    const level = gameState.currentLevel;
    const used = usedHintsByLevel[level] || [];
    if (!used.length) {
        showFeedback('Nenhuma dica utilizada ainda.', 'error');
        return;
    }
    const html = used.map((h, i) => `<div><strong>Dica ${i + 1}:</strong> ${h}</div>`).join('');
    showFeedback(`<strong>Dicas já utilizadas (fase ${level}):</strong><br>${html}`);
}
// Função para mostrar dicas já utilizadas na fase atual
function showUsedHints() {
    const level = gameState.currentLevel;
    const used = usedHintsByLevel[level] || [];
    if (!used.length) {
        showFeedback('Nenhuma dica utilizada ainda.', 'error');
        return;
    }
    const html = used.map((h, i) => `<div><strong>Dica ${i + 1}:</strong> ${h}</div>`).join('');
    showFeedback(`<strong>Dicas já utilizadas (fase ${level}):</strong><br>${html}`);
}
    // ALTERAÇÃO: Função para reiniciar o jogo
        function restartGame() {
            gameState = {
                currentLevel: 1,
                xp: 0,
                energy: 2,
                knowledge: 'Iniciante',
                inventory: [],
                completedChallenges: [],
                playerName: '',
                totalLevels: 10
            };
            // Garante que o card de energia volte a aparecer
            const energyStat = document.getElementById('energy');
            if (energyStat && energyStat.parentElement) {
                energyStat.parentElement.style.display = '';
            }
            updateUI();
            loadChallenge(1);
            showFeedback('🔄 Jogo reiniciado! Boa sorte na sua nova jornada!');
        }

    // ALTERAÇÃO: Função para compartilhar resultados
        function shareResults() {
            const message = `🎉 Completei a Aventura do Programador Iniciante! 
XP Total: ${gameState.xp} 
Itens Coletados: ${gameState.inventory.length}
Conhecimento: ${gameState.knowledge}
#PythonLogic #Programming #GameLearning`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Aventura do Programador Iniciante',
                    text: message,
                });
            } else {
                navigator.clipboard.writeText(message).then(() => {
                    showFeedback('📋 Resultado copiado para a área de transferência!');
                });
            }
        }

    // ALTERAÇÃO: Inicializar o jogo
        document.addEventListener('DOMContentLoaded', () => {
            updateUI();
            loadChallenge(1);
        });
    // ALTERAÇÃO: Função utilitária para mostrar confete
    function showConfetti(options = {}) {
        if (typeof confetti === 'function') {
            confetti(Object.assign({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            }, options));
        } else {
            console.warn('canvas-confetti não carregado.');
        }
    }

    // ALTERAÇÃO: Função utilitária para mostrar popup de campeão
    function showChampionPopup({ teamName, trophyImg = 'static/img/taca_champions.png', duration = 3500, confettiOptions = [] }) {
        const overlay = document.createElement('div');
        overlay.className = 'trophy-overlay';
        overlay.id = 'trophyOverlay';
        overlay.innerHTML = `
            <div class="trophy-anim">
                <img src="${trophyImg}" alt="Taça da Champions" class="trophy-img">
                <div class="trophy-label">${teamName} Campeão!</div>
            </div>
        `;
        document.body.appendChild(overlay);
        // Confete centralizado ao lado do pop-up, com destaque
        if (typeof confetti === 'function') {
            const rect = overlay.querySelector('.trophy-anim').getBoundingClientRect();
            const centerX = (rect.left + rect.right) / 2 / window.innerWidth;
            const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight;
            confetti({ particleCount: 180, spread: 90, origin: { x: centerX - 0.18, y: centerY }, zIndex: 10000 });
            confetti({ particleCount: 180, spread: 90, origin: { x: centerX + 0.18, y: centerY }, zIndex: 10000 });
        } else {
            console.warn('canvas-confetti não carregado.');
        }
        setTimeout(() => {
            overlay.remove();
        }, duration);
    }
    // ALTERAÇÃO: Função de desenvolvedor para acessar qualquer parte do jogo e finalizar com XP customizado
    function devAccessGame({ level = 1, xp = 0, energy = 100, knowledge = 'Iniciante', inventory = [], completedChallenges = [], playerName = 'Dev', totalLevels = 10 }) {
        gameState.currentLevel = level;
        gameState.xp = xp;
        gameState.energy = energy;
        gameState.knowledge = knowledge;
        gameState.inventory = inventory;
        gameState.completedChallenges = completedChallenges;
        gameState.playerName = playerName;
        gameState.totalLevels = totalLevels;
        updateUI();
    }

    // ALTERAÇÃO: Função para finalizar o jogo com XP escolhido
    function devFinishGameWithXP(finalXP) {
        gameState.xp = finalXP;
        gameState.currentLevel = gameState.totalLevels;
        updateUI();
        showChampionPopup({
            teamImg: 'static/img/serpente.png',
            teamName: gameState.playerName || 'Desenvolvedor',
            trophyImg: 'static/img/taca_champions.png',
            duration: 4000
        });
    }

    // ALTERAÇÃO: Adiciona evento ao botão de desenvolvedor
    window.addEventListener('DOMContentLoaded', function() {
    // ALTERAÇÃO: Pop-up de boas-vindas ao carregar a página
    showWelcomePopup();
    // ALTERAÇÃO: Botão dev removido
        const devGoBtn = document.getElementById('devGoBtn');
    if (devGoBtn) {
        devGoBtn.onclick = function() {
            const level = parseInt(document.getElementById('devLevel').value);
            const knowledge = document.getElementById('devKnowledge').value;
            let xp = 0;
            switch (knowledge) {
                case '🌟 Mestre Supremo': xp = 2000; break;
                case '👑 Mestre': xp = 1500; break;
                case '🎓 Avançado': xp = 1000; break;
                case '⚡ Intermediário': xp = 500; break;
                case '🔥 Novato+': xp = 200; break;
                default: xp = 0;
            }
            devAccessGame({ level: level, xp: xp, knowledge: knowledge, playerName: 'Dev Teste' });
            loadChallenge(level);
            // Mostra pop-up para qualquer nível de conhecimento selecionado
            setTimeout(() => {
                updateUI();
            }, 100);
        };
    }
    });
    // ALTERAÇÃO: Função de animação de energia (raio)
    function triggerRaioAnim() {
    const energyDiv = document.getElementById('energy');
    const energyCard = energyDiv ? energyDiv.parentElement : null;
    if (energyCard && energyCard.classList.contains('stat')) {
        energyCard.classList.remove('raio-anim'); // Garante reset
        void energyCard.offsetWidth; // Força reflow para reiniciar animação
        energyCard.classList.add('raio-anim');
        setTimeout(() => {
            energyCard.classList.remove('raio-anim');
        }, 1200);
    }
}