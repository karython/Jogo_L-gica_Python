 // Estado do jogo
        let gameState = {
            currentLevel: 1,
            xp: 0,
            energy: 100,
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
                type: "input_output",
                task: "Crie um programa que peça o nome do usuário e sua idade, depois exiba uma mensagem de boas-vindas personalizada.",
                hint: "Use input() para coletar dados e print() para mostrar mensagens",
                solution_pattern: ["input", "print"],
                reward_xp: 100,
                reward_item: "🔧 Kit Básico do Dev"
            },
            2: {
                title: "🧮 A Calculadora Mágica",
                story: "Seu primeiro projeto foi um sucesso! Agora o chefe quer uma calculadora para ajudar com os cálculos de salários. Você precisa criar algo que faça operações matemáticas básicas.",
                type: "math_operations",
                task: "Desenvolva uma calculadora que peça dois números e uma operação (+, -, *, /) e mostre o resultado.",
                hint: "Use variáveis para armazenar os números e operadores matemáticos do Python",
                solution_pattern: ["float", "+", "-", "*", "/"],
                reward_xp: 150,
                reward_item: "🧮 Calculadora Dourada"
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

        // Função para atualizar a interface
        function updateUI() {
            document.getElementById('xp').textContent = gameState.xp;
            document.getElementById('level').textContent = gameState.currentLevel;
            document.getElementById('energy').textContent = gameState.energy;
            document.getElementById('knowledge').textContent = gameState.knowledge;
            
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
            const feedbackDiv = document.getElementById('feedback');
            feedbackDiv.innerHTML = `<div class="feedback ${type}">${message}</div>`;
            setTimeout(() => {
                feedbackDiv.innerHTML = '';
            }, 4000);
        }

        // Função para carregar um desafio
        function loadChallenge(levelNum) {
            const challenge = challenges[levelNum];
            const contentDiv = document.getElementById('game-content');
            
            if (levelNum === 10) {
                // Fase final especial
                contentDiv.innerHTML = `
                    <div class="story-text">
                        <h2>${challenge.title}</h2>
                        <p>${challenge.story}</p>
                        <div style="text-align: center; margin: 40px 0;">
                            <div style="font-size: 60px; margin: 20px 0;">🎉🏆🎉</div>
                            <h3>PARABÉNS, MESTRE PROGRAMADOR!</h3>
                            <p>Você completou todos os desafios e dominou a lógica de programação com Python!</p>
                            <div class="stats" style="margin: 30px 0;">
                                <div class="stat">
                                    <div>Total de XP</div>
                                    <div style="font-size: 24px; color: #00e676;">${gameState.xp}</div>
                                </div>
                                <div class="stat">
                                    <div>Itens Coletados</div>
                                    <div style="font-size: 24px; color: #00e676;">${gameState.inventory.length}</div>
                                </div>
                            </div>
                            <button class="btn" onclick="restartGame()">🔄 Jogar Novamente</button>
                            <button class="btn" onclick="shareResults()">📤 Compartilhar Resultado</button>
                        </div>
                    </div>
                `;
                
                // Recompensa final
                gameState.xp += challenge.reward_xp;
                gameState.inventory.push(challenge.reward_item);
                updateUI();
                return;
            }
            
            let challengeHTML = `
                <div class="story-text">
                    <h2>${challenge.title}</h2>
                    <p>${challenge.story}</p>
                </div>
                
                <div class="challenge-area">
                    <h3>🎯 Sua Missão:</h3>
                    <p>${challenge.task}</p>
                    <p><strong>💡 Dica:</strong> ${challenge.hint}</p>
                    
                    <div style="margin: 20px 0;">
                        <label for="code-input"><strong>Escreva seu código Python:</strong></label>
                        <textarea id="code-input" class="code-input" placeholder="# Digite seu código aqui...
# Exemplo: nome = input('Digite seu nome: ')"></textarea>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <button class="btn" onclick="runCode()">▶️ Executar Código</button>
                        <button class="btn" onclick="checkSolution()">✅ Verificar Solução</button>
                        <button class="btn" onclick="getHint()">💡 Dica Extra</button>
                    </div>
                    
                    <div id="code-output" class="code-output hidden">
                        <div>>>> Executando código...<span class="terminal-cursor">|</span></div>
                    </div>
                </div>
            `;
            
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
        }

        // Função para executar código (simulação)
        function runCode() {
            const code = document.getElementById('code-input').value;
            const outputDiv = document.getElementById('code-output');
            
            if (!code.trim()) {
                showFeedback('⚠️ Por favor, escreva algum código primeiro!', 'error');
                return;
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
            }, 1500);
        }

        // Função para verificar solução
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

        // Função para dar dicas extras
        function getHint() {
            const challenge = challenges[gameState.currentLevel];
            const hints = {
                1: "Exemplo: nome = input('Seu nome: '), depois print(f'Olá, {nome}!')",
                2: "Use float() para converter strings em números e operadores +, -, *, /",
                3: "Structure: if condição: ... elif outra_condição: ... else: ...",
                4: "Use while True: e break, ou while condição != 'fim':",
                5: "lista = [], lista.append(item), lista.remove(item)",
                6: "texto.upper(), texto.lower(), len(texto), 'texto'.replace()",
                7: "max(lista), min(lista), sum(lista), sum(lista)/len(lista)",
                8: "dicionario = {'chave': 'valor'}, dicionario['nova_chave'] = valor",
                9: "Combine tudo: listas de dicionários, loops para menu, if para opções",
                10: "Você já venceu! 🏆"
            };
            
            gameState.energy -= 5;
            showFeedback(`💡 Dica especial: ${hints[gameState.currentLevel]}`);
            updateUI();
        }

        // Função para testar programa (desafio 1)
        function testProgram() {
            const name = document.getElementById('test-name').value;
            const age = document.getElementById('test-age').value;
            const resultDiv = document.getElementById('test-result');
            
            if (!name || !age) {
                resultDiv.innerHTML = '<div class="feedback error">Preencha nome e idade para testar!</div>';
                return;
            }
            
            resultDiv.innerHTML = `
                <div class="feedback success">
                    <strong>Resultado do teste:</strong><br>
                    Se seu código estiver correto, deveria exibir algo como:<br>
                    "Olá, ${name}! Você tem ${age} anos. Bem-vindo(a) à empresa!"
                </div>
            `;
        }

        // Função para reiniciar o jogo
        function restartGame() {
            gameState = {
                currentLevel: 1,
                xp: 0,
                energy: 100,
                knowledge: 'Iniciante',
                inventory: [],
                completedChallenges: [],
                playerName: '',
                totalLevels: 10
            };
            updateUI();
            loadChallenge(1);
            showFeedback('🔄 Jogo reiniciado! Boa sorte na sua nova jornada!');
        }

        // Função para compartilhar resultados
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

        // Inicializar o jogo
        document.addEventListener('DOMContentLoaded', () => {
            updateUI();
            loadChallenge(1);
            showFeedback('🌟 Bem-vindo à Aventura do Programador Iniciante! Sua jornada começa agora!');
        });

        // Easter eggs e interações extras
        document.addEventListener('keydown', (e) => {
            // Konami Code: ↑↑↓↓←→←→BA
            if (e.code === 'ArrowUp') {
                // Easter egg simples
                if (Math.random() > 0.95) {
                    showFeedback('🐍 Python sussurra: "Continue codando, jovem desenvolvedor..."');
                }
            }
        });