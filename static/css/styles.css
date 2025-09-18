/* ALTERAÇÃO: Animação de entrada e saída suave para o popup de boas-vindas */
.popup-anim-enter {
    animation: popupEnterUpSmooth 0.7s cubic-bezier(.4,1.4,.6,1);
    filter: blur(0);
}
.popup-anim-exit {
    animation: popupEnterUpSmooth 0.7s cubic-bezier(.4,1.4,.6,1) reverse forwards;
    filter: blur(0);
}
@keyframes popupEnterUpSmooth {
    0% { opacity: 0; transform: translateY(80px) scale(0.95); filter: blur(3px); }
    40% { opacity: 0.7; transform: translateY(-10px) scale(1.01); filter: blur(1.5px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
/* ALTERAÇÃO: Efeito visual e animação para o botão 'Iniciar Jogo' */
#btnStartGame {
    position: relative;
    overflow: hidden;
}
#btnStartGame::before {
    content: '';
    position: absolute;
    top: 0; left: -75%;
    width: 50%; height: 100%;
    background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.45) 100%);
    transform: skewX(-25deg);
    transition: left 0.6s cubic-bezier(.4,1.4,.6,1);
    pointer-events: none;
    z-index: 3;
}
#btnStartGame:hover::before {
    left: 120%;
    transition: left 0.6s cubic-bezier(.4,1.4,.6,1);
}
#btnStartGame:hover {
    background: linear-gradient(90deg, #00e676 60%, #00b85c 100%);
    color: #fff;
    box-shadow: 0 0 36px 10px #00e676cc, 0 0 0 4px #fff2 inset;
    transform: scale(1.11) rotate(-1deg);
    border: 2px solid #00e676;
    letter-spacing: 2px;
    filter: brightness(1.13) saturate(1.28);
    z-index: 2;
    animation: btnBounce 0.45s cubic-bezier(.4,1.4,.6,1);
}
/* ALTERAÇÃO: Animação de bounce para o botão 'Iniciar Jogo' */
@keyframes btnBounce {
    0% { transform: scale(1) rotate(0); }
    40% { transform: scale(1.15) rotate(-2deg); }
    60% { transform: scale(1.09) rotate(-1deg); }
    100% { transform: scale(1.11) rotate(-1deg); }
}
/* Animation for popup exit (slide up) */
.popup-exit-up {
    animation: popupExitUp 0.6s forwards cubic-bezier(.4,1.4,.6,1);
}
@keyframes popupExitUp {
    0% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-80px) scale(0.95); }
}
/* Hover effect for 'Iniciar Jogo' button */
#btnStartGame {
    transition: background 0.35s cubic-bezier(.4,1.4,.6,1),
                color 0.25s cubic-bezier(.4,1.4,.6,1),
                box-shadow 0.35s cubic-bezier(.4,1.4,.6,1),
                transform 0.35s cubic-bezier(.4,1.4,.6,1),
                border 0.25s cubic-bezier(.4,1.4,.6,1),
                letter-spacing 0.25s cubic-bezier(.4,1.4,.6,1),
                filter 0.25s cubic-bezier(.4,1.4,.6,1);
}
#btnStartGame:hover {
    background: linear-gradient(90deg, #00e676 60%, #00b85c 100%);
    color: #fff;
    box-shadow: 0 0 32px 8px #00e676cc, 0 0 0 4px #fff2 inset;
    transform: scale(1.13) rotate(-2deg);
    border: 2px solid #00e676;
    letter-spacing: 2px;
    filter: brightness(1.12) saturate(1.25);
    z-index: 2;
}
/* ALTERAÇÃO: Ajuste visual para elementos finais de troféu/cobrinha */
.closer-trophy {
    gap: 2px !important;
}
/* ALTERAÇÃO: Layout especial para animação final (coluna reversa) */
.column-reverse-final {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-end;
}
.column-reverse-final .snake-congrats-balloon {
    position: static !important;
    left: auto !important;
    transform: none !important;
    margin-top: 18px;
    margin-bottom: 0;
}
/* ALTERAÇÃO: Layout especial para animação final (lado a lado) */
.side-by-side-final {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
    margin-left: auto;
    margin-right: auto;
}
.side-by-side-final .snake-jump-below {
    width: 80px;
    height: 80px;
    animation: snakeFinalDance 0.7s infinite alternate cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #00e67688);
    margin: 0;
}
.side-by-side-final .trophy-final-static {
    width: 60px;
    height: 60px;
    margin: 0 0 8px 0;
    filter: drop-shadow(0 0 12px #ffd70088);
}
@media (max-width: 600px) {
    .side-by-side-final .snake-jump-below {
        width: 48px;
        height: 48px;
    }
    .side-by-side-final .trophy-final-static {
        width: 36px;
        height: 36px;
        margin-bottom: 4px;
    }
}
/* Espaço visual para corrida da cobrinha e troféu */
/* ALTERAÇÃO: Espaço visual para corrida da cobrinha e troféu */
.snake-trophy-run-space {
    width: 480px;
    height: 120px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: none;
    pointer-events: none;
    margin: 24px auto 0 auto;
    position: relative;
}
@media (max-width: 700px) {
    .snake-trophy-run-space {
        width: 98vw;
        min-width: 0;
        height: 80px;
        padding: 0 2vw;
    }
}
/* ALTERAÇÃO: Corrida lado a lado para o centro (cobrinha e troféu) */
.snake-trophy-run-together {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    gap: 12px;
    pointer-events: none;
    position: relative;
}
/* Corrida lado a lado para o centro */
.snake-trophy-run-together {
    width: 220px;
    height: 90px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 12px;
    pointer-events: none;
    position: relative;
}
/* ALTERAÇÃO: Animação da cobrinha correndo para o centro */
.snake-run-together {
    width: 80px;
    height: 80px;
    position: relative;
    left: -90px;
    animation: snakePairRunToCenter 2.2s cubic-bezier(.4,1.4,.6,1) forwards;
    z-index: 2;
}
/* ALTERAÇÃO: Animação do troféu correndo para o centro */
.trophy-run-together {
    width: 80px;
    height: 80px;
    position: relative;
    left: -60px;
    animation: trophyPairRunToCenter 2.2s cubic-bezier(.4,1.4,.6,1) forwards;
    z-index: 3;
    filter: drop-shadow(0 0 12px #ffd70088);
}
@keyframes snakePairRunToCenter {
    0% { left: -90px; }
    80% { left: 0; }
    100% { left: 0; }
}
@keyframes trophyPairRunToCenter {
    0% { left: -60px; }
    80% { left: 0; }
    100% { left: 0; }
}
/* Par pulando juntos centralizados */
.center-conquer {
    width: 220px;
    min-width: 160px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    gap: 0;
    margin: 24px auto 0 auto;
    position: relative;
    margin-left: auto;
    margin-right: auto;
}
.center-conquer .snake-congrats-balloon {
    margin-bottom: 8px;
    margin-top: 48px;
    margin-top: 0;
    min-width: 120px;
    text-align: center;
    font-size: 1.08rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: auto;
    margin-right: auto;
}
.center-conquer .trophy-jump {
    margin-bottom: 0;
    margin-top: 0;
    width: 80px;
    height: 80px;
    left: auto;
}
.center-conquer .snake-jump-below {
    width: 80px;
    height: 80px;
    margin-top: 0;
}
@media (max-width: 600px) {
    .center-conquer {
        width: 98vw;
        min-width: 0;
        padding: 0 2vw;
    }
    .center-conquer .trophy-jump,
    .center-conquer .snake-jump-below {
        width: 48px;
        height: 48px;
    }
    .center-conquer .snake-congrats-balloon {
        font-size: 0.98rem;
        min-width: 80px;
        max-width: 98vw;
        margin-bottom: 6px;
    }
}
@media (max-width: 600px) {
    .snake-trophy-run-together,
    .center-conquer {
        width: 98vw;
        min-width: 0;
        padding: 0 2vw;
    }
    .snake-run-together,
    .trophy-run-together,
    .jump-pair .trophy-jump,
    .jump-pair .snake-jump-below {
        width: 48px;
        height: 48px;
    }
    .center-conquer .snake-congrats-balloon {
        font-size: 0.98rem;
        min-width: 80px;
        max-width: 98vw;
        margin-bottom: 6px;
    }
}
/* Centraliza o wrap de conquista */
/* Centralização e responsividade do conjunto troféu, balão e cobrinha */
.center-conquer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10010;
    width: auto;
    max-width: 100%;
    min-width: 0;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    gap: 0;
    margin-left: auto;
    margin-right: auto;
}
.center-conquer .trophy-jump {
    margin-bottom: 2px;
    margin-top: 18px;
    left: 60%;
    transform: none;
    height: 80px;
}
.center-conquer .snake-congrats-balloon {
    margin-bottom: 2px;
    max-width: 90vw;
    width: auto;
    min-width: 120px;
    text-align: center;
    font-size: 1.08rem;
    opacity: 1 !important;
    animation: none !important;
}
.center-conquer .snake-jump-below {
    width: 80px;
    height: 80px;
}
@media (max-width: 600px) {
    .center-conquer {
        max-width: 98vw;
        min-width: 0;
        padding: 0 2vw;
    }
    .center-conquer .trophy-jump,
    .center-conquer .snake-jump-below {
        width: 48px;
        height: 48px;
    }
    .center-conquer .snake-congrats-balloon {
        font-size: 0.98rem;
        min-width: 80px;
        max-width: 98vw;
        margin-bottom: 6px;
    }
}
@media (max-width: 600px) {
    .center-conquer {
        width: 120px;
        height: 120px;
    }
}
/* Animação de pulo para cobrinha e troféu */
.snake-jump-below {
    width: 80px;
    height: 80px;
    animation: snakeFinalDance 0.6s infinite alternate cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #00e67688);
    margin-top: 0;
    z-index: 2;
}
.trophy-jump {
    width: 80px;
    height: 80px;
    margin-bottom: -18px;
    z-index: 3;
    animation: trophyJump 1s infinite cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #ffd70088);
}
@keyframes snakeJump {
    0% { transform: translateY(0); }
    20% { transform: translateY(-30px) scale(1.08); }
    40% { transform: translateY(0); }
    100% { transform: translateY(0); }
}
@keyframes trophyJump {
    0% { transform: translateY(0); }
    20% { transform: translateY(-38px) scale(1.10); }
    40% { transform: translateY(0); }
    100% { transform: translateY(0); }
}
@media (max-width: 600px) {
    .snake-jump-below,
    .trophy-jump {
        width: 48px;
        height: 48px;
        margin-bottom: -10px;
    }
    .center-conquer {
        height: 80px;
    }
}
/* Balão de fala de parabéns da cobrinha */
.snake-congrats-balloon {
    position: static;
    left: auto;
    top: auto;
    transform: none;
    margin-top: 24px;
    background: linear-gradient(120deg, #1e3c72 70%, #00e676 100%);
    color: #fff;
    border-radius: 18px 18px 18px 6px;
    padding: 10px 18px;
    font-size: 1.08rem;
    font-weight: 500;
    box-shadow: 0 4px 18px #0007;
    min-width: 140px;
    max-width: 130vw;
    word-break: normal;
    overflow-wrap: break-word;
    white-space: pre-line;
    z-index: 10;
    animation: snakeCongratsShow 0.5s cubic-bezier(.4,1.4,.6,1);
}
@keyframes snakeCongratsShow {
    0% { opacity: 0; transform: translate(-50%, -130%) scale(0.9); }
    100% { opacity: 1; transform: translate(-50%, -110%) scale(1); }
}
@media (max-width: 600px) {
    .snake-trophy-wait-center,
    .snake-trophy-run-center,
    .snake-trophy-conquer-wrap {
        height: 80px;
        margin-bottom: 8px;
        margin-top: 4px;
    }
    .snake-wait-center,
    .snake-run-from-left,
    .snake-dance-below,
    .trophy-center-wait,
    .trophy-conquer {
        width: 48px;
        height: 48px;
    }
    .snake-run-from-left {
        left: -60px;
    }
    .trophy-center-wait {
        left: 50%;
        transform: translateX(-50%);
    }
}
/* Cobrinha corre da esquerda para o centro, troféu já está no centro */
.snake-run-from-left {
    width: 80px;
    height: 80px;
    position: absolute;
    left: -90px;
    bottom: 0;
    animation: snakeFromLeftToCenter 2.2s cubic-bezier(.4,1.4,.6,1) forwards;
    z-index: 2;
}
.trophy-center-wait {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    z-index: 3;
    filter: drop-shadow(0 0 12px #ffd70088);
}
@keyframes snakeFromLeftToCenter {
    0% { left: -90px; }
    80% { left: 44vw; }
    100% { left: 44vw; }
}
/* Cobrinha parada aguardando clique */
.snake-trophy-wait-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 100vw;
    height: 120px;
    position: relative;
    margin-bottom: 10px;
    margin-top: -12px;
    margin-top: 10px;
}
.snake-wait-center {
    width: 80px;
    height: 80px;
    filter: drop-shadow(0 0 12px #00e67688);
    transition: transform 0.2s;
}
.snake-wait-center:hover {
    transform: scale(1.08) rotate(-7deg);
}
/* Corrida centralizada para a cobrinha e troféu */
.snake-trophy-run-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 100vw;
    height: 120px;
    position: relative;
    margin-bottom: 18px;
    margin-top: 10px;
}
.snake-run-center {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 10vw;
    bottom: 0;
    animation: snakeRunToCenter 2.2s cubic-bezier(.4,1.4,.6,1) forwards;
    z-index: 2;
}
.trophy-run-center {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 18vw;
    bottom: 0;
    animation: trophyRunToCenter 2.2s cubic-bezier(.4,1.4,.6,1) forwards;
    z-index: 3;
}
@keyframes snakeRunToCenter {
    0% { left: 10vw; }
    80% { left: 44vw; }
    100% { left: 44vw; }
}
@keyframes trophyRunToCenter {
    0% { left: 18vw; }
    80% { left: 48vw; }
    100% { left: 48vw; }
}
/* Troféu acima da cobrinha após corrida */
.snake-trophy-conquer-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 100vw;
    height: 140px;
    margin-bottom: 18px;
    margin-top: 10px;
    position: relative;
}
.trophy-conquer {
    width: 80px;
    height: 80px;
    margin-bottom: -18px;
    z-index: 3;
    animation: trophyFinalDance 1.2s infinite alternate-reverse cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #ffd70088);
}
.snake-dance-below {
    width: 80px;
    height: 80px;
    animation: snakeFinalDance 1.2s infinite alternate cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #00e67688);
    margin-top: 0;
    z-index: 2;
}
/* Cobrinha correndo atrás do troféu na tela final */
.snake-trophy-run-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 0;
    margin-bottom: 18px;
    margin-top: 10px;
    position: relative;
    min-height: 80px;
    width: 480px;
    max-width: 98vw;
    margin-left: auto;
    margin-right: auto;
    height: 80px;
}
.snake-run {
    width: 70px;
    height: 70px;
    position: absolute;
        margin-top: 0;
    left: 0;
    bottom: 0;
    animation: snakeRunAnim 2.2s cubic-bezier(.4,1.4,.6,1) forwards;
    z-index: 2;
}
.trophy-run {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    display: block;
    margin-left: 0;
    margin-right: 0;
    z-index: 3;
}
@keyframes snakeRunAnim {
    0% { left: 0; }
    80% { left: calc(50% + 45px); }
    100% { left: calc(50% + 45px); }
}
@keyframes trophyRunAnim {
    0% { left: 120px; }
    80% { left: 64vw; }
    100% { left: 48vw; }
}
/* Cobrinha e troféu dançando na tela final */
.snake-trophy-dance-wrap {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 32px;
    margin-bottom: 18px;
    margin-top: 10px;
}
.snake-dance {
    width: 70px;
    height: 70px;
    animation: snakeFinalDance 1.2s infinite alternate cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #00e67688);
}
.trophy-dance {
    width: 70px;
    height: 70px;
    animation: trophyFinalDance 1.2s infinite alternate-reverse cubic-bezier(.4,1.4,.6,1);
    filter: drop-shadow(0 0 12px #ffd70088);
}
@keyframes snakeFinalDance {
    0% { transform: rotate(-10deg) scale(1); }
    100% { transform: rotate(10deg) scale(1.12); }
}
@keyframes trophyFinalDance {
    0% { transform: rotate(10deg) scale(1); }
    100% { transform: rotate(-10deg) scale(1.12); }
}
/* Cobrinha do easter egg */
.snake-balloon-container {
    position: fixed;
    z-index: 9999;
    left: 2vw;
    bottom: 2vw;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    opacity: 0;
    transform: translateY(40px) scale(0.95);
    transition: all 0.5s cubic-bezier(.4,1.4,.6,1);
    pointer-events: none;
}
.snake-balloon-container.show {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.snake-balloon-img {
    width: 54px;
    height: 54px;
    filter: drop-shadow(0 0 8px #00e67688);
    animation: snakeWiggle 1.2s infinite alternate cubic-bezier(.4,1.4,.6,1);
}
@keyframes snakeWiggle {
    0% { transform: rotate(-7deg) scale(1); }
    100% { transform: rotate(7deg) scale(1.08); }
}
.snake-balloon-bubble {
    background: linear-gradient(120deg, #1e3c72 70%, #00e676 100%);
    color: #fff;
    border-radius: 18px 18px 18px 6px;
    padding: 16px 22px;
    font-size: 1.08rem;
    font-weight: 500;
    box-shadow: 0 4px 18px #0007;
    position: relative;
    max-width: 90vw;
    min-width: 120px;
    word-break: normal;
    overflow-wrap: break-word;
    white-space: pre-line;
}
.snake-balloon-bubble:after {
    display: none;
}
@media (max-width: 600px) {
    .snake-balloon-container {
        left: 2vw;
        bottom: 2vw;
        gap: 6px;
    }
    .snake-balloon-img {
        width: 38px;
        height: 38px;
    }
    .snake-balloon-bubble {
        font-size: 0.98rem;
        padding: 10px 12px;
        min-width: 80px;
        max-width: 98vw;
    }
}
/* Loader animado para o botão Executar Código */
.loader-spin {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #fff;
    border-top: 3px solid #00e676;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    text-align: center;
    margin-bottom: 30px;
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from { text-shadow: 0 0 20px #4fc3f7; }
    to { text-shadow: 0 0 30px #29b6f6, 0 0 40px #0288d1; }
}

.game-screen {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 30px;
    backdrop-filter: blur(10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.story-text {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 25px;
    text-align: center;
    animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.challenge-area {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    padding: 25px;
    margin: 20px 0;
    border-left: 5px solid #00e676;
}

.code-input {
    width: 100%;
    min-height: 120px;
    background: #1a1a1a;
    color: #00ff00;
    border: 2px solid #00e676;
    border-radius: 10px;
    padding: 15px;
    font-family: 'Courier New', monospace;
    font-size: 16px;
    resize: vertical;
    transition: all 0.3s ease;
}

.code-input:focus {
    outline: none;
    box-shadow: 0 0 20px rgba(0, 230, 118, 0.5);
    border-color: #4caf50;
}

.input-field {
    width: 100%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    margin: 10px 0;
    transition: all 0.3s ease;
}

.input-field:focus {
    outline: none;
    transform: scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn {
    background: linear-gradient(45deg, #00e676, #4caf50);
    color: white;
    border: none;
    padding: 11px 22px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 4px 2px;
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 110px;
    display: inline-block;
}
.btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin-bottom: 8px;
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 230, 118, 0.4);
}

.btn:active {
    transform: translateY(0);
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00e676, #4caf50);
    border-radius: 10px;
    transition: width 0.5s ease;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}

.stats {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
    flex-wrap: wrap;
}

.stat {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    min-width: 120px;
    margin: 5px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.feedback {
    padding: 20px;
    border-radius: 15px;
    margin: 15px 0;
    text-align: center;
    font-weight: bold;
    animation: slideIn 0.5s ease;
}

@keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.feedback.success {
    background: linear-gradient(45deg, #4caf50, #8bc34a);
    border: 2px solid #00e676;
}

.feedback.error {
    background: linear-gradient(45deg, #f44336, #e57373);
    border: 2px solid #ff5722;
}

.inventory {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 20px 0;
}

.item {
    background: linear-gradient(45deg, #9c27b0, #e91e63);
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    animation: bounce 1s ease;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

.hidden {
    display: none;
}

.code-output {
    background: #000;
    color: #00ff00;
    padding: 15px;
    border-radius: 10px;
    font-family: 'Courier New', monospace;
    margin: 15px 0;
    border: 2px solid #00e676;
    min-height: 100px;
    white-space: pre-line;
}

.terminal-cursor {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

.trophy-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(30,60,114,0.85); /* azul escuro translúcido */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeInOverlay 0.5s;
}

.trophy-anim {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); /* azul escuro para azul claro */
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    padding: 32px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    position: relative;
    animation: popUp 0.7s cubic-bezier(.68,-0.55,.27,1.55);
    opacity: 0;
    transform: scale(0.7);
    animation-fill-mode: forwards;
    border: 2px solid #00e676; /* verde neon */
}

.trophy-img {
    width: 240px;
    height: auto;
    margin-bottom: 0;
    animation: trophyBounce 1.2s infinite alternate;
    filter: drop-shadow(0 0 18px #00e67688);
}

.trophy-winner-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #00e676;
    box-shadow: 0 0 16px #00e67699;
}

.trophy-label {
    font-size: 2.1rem;
    font-weight: bold;
    color: #4fc3f7; /* azul claro */
    text-shadow: 0 2px 8px #00e67699;
    margin-top: 0;
    letter-spacing: 1px;
}

@keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes popUp {
    0% { opacity: 0; transform: scale(0.7); }
    80% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes trophyBounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-18px); }
}

.energy-anim {
    animation: energyDown 0.6s;
}
@keyframes energyDown {
    0% { background: #ff5252; color: #fff; transform: scale(1.2); }
    60% { background: #ff5252; color: #fff; transform: scale(1.1); }
    100% { background: none; color: inherit; transform: scale(1); }
}

.energy-zero-anim {
    animation: energyZero 0.8s;
}
@keyframes energyZero {
    0% { background: #ff5252; color: #fff; transform: scale(1.2); }
    40% { background: #ff5252; color: #fff; transform: scale(1.1); }
    60% { background: #fff; color: #ff5252; transform: scale(1.2); }
    100% { background: none; color: inherit; transform: scale(1); }
}

.stat.energy-zero-anim {
    animation: energyZeroBox 0.8s;
}
@keyframes energyZeroBox {
    0% { background: #ff5252; color: #fff; box-shadow: 0 0 20px #ff5252; transform: scale(1.05); }
    40% { background: #ff5252; color: #fff; box-shadow: 0 0 30px #ff5252; transform: scale(1.03); }
    60% { background: #fff; color: #ff5252; box-shadow: 0 0 20px #fff; transform: scale(1.07); }
    100% { background: none; color: inherit; box-shadow: none; transform: scale(1); }
}

.stat.raio-anim {
    animation: raioReal 1.2s cubic-bezier(.68,-0.55,.27,1.55);
    box-shadow: 0 0 40px #ffd700, 0 0 80px #fff700;
    border: 2px solid #ffd700;
}
@keyframes raioReal {
    0% { background: #fff700; color: #222; box-shadow: 0 0 80px #fff700; transform: scale(1.1) rotate(-2deg); }
    20% { background: #ffd700; color: #fff; box-shadow: 0 0 60px #ffd700; transform: scale(1.15) rotate(2deg); }
    40% { background: #fff700; color: #222; box-shadow: 0 0 80px #fff700; transform: scale(1.1) rotate(-2deg); }
    60% { background: #ffd700; color: #fff; box-shadow: 0 0 60px #ffd700; transform: scale(1.15) rotate(2deg); }
    80% { background: #fff700; color: #222; box-shadow: 0 0 80px #fff700; transform: scale(1.1) rotate(-2deg); }
    100% { background: none; color: inherit; box-shadow: none; border: none; transform: scale(1) rotate(0deg); }
}

@media (max-width: 768px) {
    .container { padding: 10px; }
    .game-screen { padding: 15px; }
    .stats { flex-direction: column; }
}
footer {
  background-color: #1e1e2f; /* tom escuro elegante */
  color: #ffffff;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  bottom: 0;
  width: 100%;
}

footer a {
  color: #4fc3f7; /* azul suave */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

footer a:hover {
  color: #81d4fa; /* tom mais claro ao passar o mouse */
}

.custom-alert {
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto 12px auto;
    padding: 18px 28px;
    border-radius: 12px;
    font-size: 1.15rem;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 6px 24px #0003;
    z-index: 10001;
    animation: slideDown 0.6s cubic-bezier(.68,-0.55,.27,1.55);
    background: linear-gradient(90deg, #00e676 0%, #4fc3f7 100%);
    color: #1e3c72;
    border: 2px solid #00e676;
}
.custom-alert.error {
    background: linear-gradient(90deg, #f44336 0%, #e57373 100%);
    color: #fff;
    border: 2px solid #ff5722;
}
.custom-alert.hide {
    animation: slideUp 0.6s cubic-bezier(.68,-0.55,.27,1.55);
    opacity: 0;
}
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-40px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-40px); }
}