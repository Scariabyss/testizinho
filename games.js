/**
 * Mollab – Motor de Mini-Games (Nativo JS)
 */

function openGame(gameId) {
    const modal = document.getElementById('game-modal');
    const container = document.getElementById('game-container');
    if (!modal || !container) return;

    modal.style.display = 'flex';
    container.innerHTML = '<div class="rank-loading">Preparando laboratório...</div>';

    if (gameId === 'glassware') {
        renderGlasswareGame();
    }
}

function closeGame() {
    const modal = document.getElementById('game-modal');
    if (modal) modal.style.display = 'none';
}

/**
 * JOGO 1: Mestre das Vidrarias (Click to Match)
 */
function renderGlasswareGame() {
    const container = document.getElementById('game-container');
    
    // Dados do jogo
    const items = [
        { id: 1, name: 'Beacker', desc: 'Usado para misturar líquidos e aquecimento simples.', icon: '🧪' },
        { id: 2, name: 'Erlenmeyer', desc: 'Ideal para titulações e evitar salpicos.', icon: '📐' },
        { id: 3, name: 'Proveta', desc: 'Medição precisa de volumes de líquidos.', icon: '📏' },
        { id: 4, name: 'Tubo de Ensaio', desc: 'Para pequenas reações e testes rápidos.', icon: '🧪' },
        { id: 5, name: 'Pipeta', desc: 'Transporte de volumes exatos de líquidos.', icon: '💉' }
    ];

    // Embaralhar opções
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    const shuffledNames = [...items].sort(() => Math.random() - 0.5);

    let selectedIcon = null;
    let selectedName = null;
    let matches = 0;

    container.innerHTML = `
        <div class="game-header" style="text-align:center; margin-bottom:30px;">
            <h2 style="color:var(--accent-cyan); font-size:1.8rem; margin-bottom:10px;">Mestre das Vidrarias</h2>
            <p>Combine o instrumento com seu nome correto!</p>
        </div>
        <div class="game-playarea" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div id="icons-column" style="display: flex; flex-direction: column; gap: 10px;"></div>
            <div id="names-column" style="display: flex; flex-direction: column; gap: 10px;"></div>
        </div>
        <div id="game-feedback" style="margin-top:30px; text-align:center; min-height:50px; font-weight:700;"></div>
    `;

    const iconsCol = document.getElementById('icons-column');
    const namesCol = document.getElementById('names-column');

    shuffledItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'game-card-btn';
        btn.innerHTML = `<span style="font-size:2rem; display:block;">${item.icon}</span> <small>${item.desc}</small>`;
        btn.onclick = () => {
            if (btn.classList.contains('matched')) return;
            document.querySelectorAll('#icons-column .game-card-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedIcon = item.id;
            checkMatch();
        };
        iconsCol.appendChild(btn);
    });

    shuffledNames.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'game-card-btn';
        btn.innerText = item.name;
        btn.onclick = () => {
            if (btn.classList.contains('matched')) return;
            document.querySelectorAll('#names-column .game-card-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedName = item.id;
            checkMatch();
        };
        namesCol.appendChild(btn);
    });

    function checkMatch() {
        const feedback = document.getElementById('game-feedback');
        if (selectedIcon && selectedName) {
            if (selectedIcon === selectedName) {
                // Sucesso
                document.querySelectorAll('.game-card-btn.selected').forEach(b => {
                    b.classList.remove('selected');
                    b.classList.add('matched');
                    b.disabled = true;
                });
                feedback.innerHTML = '<span style="color:var(--color-success);">✨ Combinação correta!</span>';
                matches++;
                if (matches === items.length) {
                    finishGame();
                }
            } else {
                // Erro
                feedback.innerHTML = '<span style="color:var(--color-error);">❌ Tente novamente...</span>';
                setTimeout(() => {
                    document.querySelectorAll('.game-card-btn.selected').forEach(b => b.classList.remove('selected'));
                }, 500);
            }
            selectedIcon = null;
            selectedName = null;
        }
    }

    function finishGame() {
        const user = firebase.auth().currentUser;
        if (user && typeof dbOperations !== 'undefined') {
            dbOperations.saveQuizResult(user.uid, 'game_glassware', 5, 5).then(() => {
                container.innerHTML = `
                    <div style="text-align:center; padding:40px;">
                        <h2 style="font-size:2.5rem; color:var(--accent-cyan); margin-bottom:20px;">Parabéns!</h2>
                        <p style="font-size:1.2rem; margin-bottom:30px;">Você dominou as vidrarias e ganhou <strong>50 XP</strong>!</p>
                        <button class="btn-experiment" onclick="closeGame()" style="padding:15px 40px; font-size:1.1rem;">Voltar ao Lab</button>
                    </div>
                `;
            });
        } else {
            container.innerHTML = `
                <div style="text-align:center; padding:40px;">
                    <h2 style="font-size:2.5rem; color:var(--accent-cyan); margin-bottom:20px;">Incrível!</h2>
                    <p style="margin-bottom:30px;">Você completou o desafio! Faça login para salvar seu XP.</p>
                    <button class="btn-experiment" onclick="closeGame()">Fechar</button>
                </div>
            `;
        }
    }

    // Injetar estilos do jogo
    if (!document.getElementById('game-styles')) {
        const style = document.createElement('style');
        style.id = 'game-styles';
        style.innerHTML = `
            .game-card-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(157, 78, 221, 0.2);
                color: #fff;
                padding: 15px;
                border-radius: 12px;
                text-align: center;
                transition: 0.3s;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            }
            .game-card-btn:hover:not(:disabled) {
                background: rgba(157, 78, 221, 0.1);
                border-color: var(--accent-purple);
            }
            .game-card-btn.selected {
                background: rgba(157, 78, 221, 0.3);
                border-color: var(--accent-cyan);
                box-shadow: 0 0 15px var(--accent-glow);
            }
            .game-card-btn.matched {
                background: rgba(16, 185, 129, 0.2);
                border-color: #10b981;
                opacity: 0.6;
                cursor: default;
            }
            .game-card-btn small {
                display: block;
                font-size: 0.7rem;
                color: var(--text-secondary);
                margin-top: 5px;
                font-weight: 400;
            }
        `;
        document.head.appendChild(style);
    }
}
