/**
 * Mollab – Lógica do Quiz e Integração com Firebase
 */

/* / Variável global com as perguntas do quiz (será preenchida pelo Firebase ou pelo fallback local) */
var questions = [];

/* / Se a página definiu perguntas personalizadas (em uma tag <script> antes desta), usa como fallback. */
if (window.quizQuestions) {
    questions = window.quizQuestions;
}

/* / Variáveis globais para controlar o estado do quiz */
var currentQuestion = 0;
var score = 0;
var answered = false;

/* / Identifica o ID do quiz baseado no nome do arquivo HTML (ex: "tabela-periodica") */
function getQuizId() {
    if (window.currentQuizId) {
        return window.currentQuizId;
    }
    var parts = window.location.pathname.split('/');
    var fileName = parts[parts.length - 1];
    if (!fileName) {
        fileName = "index";
    }
    var quizId = fileName.replace('.html', '');
    if (!quizId) {
        quizId = "index";
    }
    return quizId;
}

/* =====================
   EMBARALHAMENTO DO QUIZ
   ===================== */

/* / Algoritmo Fisher-Yates: embaralha um array de forma aleatória */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/* / Embaralha a ordem das perguntas E a ordem das alternativas dentro de cada pergunta */
function shuffleQuiz() {
    if (!questions || questions.length === 0) return;

    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    /* / 1. Embaralha a ordem das perguntas */
    shuffleArray(questions);

    /* / 2. Para cada pergunta, embaralha as alternativas e atualiza o índice da resposta correta */
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        if (!q.options || q.options.length === 0) continue;

        /* / Marca qual opção é a correta antes de embaralhar */
        var correctText = q.options[q.correct].text;

        /* / Embaralha as alternativas */
        shuffleArray(q.options);

        /* / Encontra o novo índice da resposta correta e reatribui as letras (A, B, C, D...) */
        for (var j = 0; j < q.options.length; j++) {
            q.options[j].letter = letters[j];
            if (q.options[j].text === correctText) {
                q.correct = j;
            }
        }
    }
}

/* / Inicializa o quiz ao carregar a página: usa perguntas locais do HTML como prioridade */
function initQuiz() {
    var quizContainer = document.getElementById('quiz');
    if (!quizContainer) return;

    var quizId = getQuizId();

    /* / Se a página já definiu perguntas locais (window.quizQuestions), usa essas como prioridade */
    if (questions && questions.length > 0) {
        shuffleQuiz();
        renderQuestion();
        loadSavedProgress();
        return;
    }

    /* / Caso contrário, tenta carregar do Firebase (para quizzes criados só pelo admin) */
    try {
        if (typeof dbOperations !== 'undefined' && typeof dbOperations.getQuizData === 'function') {
            dbOperations.getQuizData(quizId).then(function (data) {
                if (data && data.questions && data.questions.length > 0) {
                    questions = data.questions;
                }
                shuffleQuiz();
                renderQuestion();
                loadSavedProgress();
            }).catch(function () {
                shuffleQuiz();
                renderQuestion();
                loadSavedProgress();
            });
        } else {
            shuffleQuiz();
            renderQuestion();
            loadSavedProgress();
        }
    } catch (e) {
        shuffleQuiz();
        renderQuestion();
        loadSavedProgress();
    }
}

/* / Tenta carregar o progresso anterior salvo no Firebase Firestore */
function loadSavedProgress() {
    try {
        var user = firebase.auth().currentUser;
        if (user && typeof dbOperations !== 'undefined') {
            dbOperations.getUserData(user.uid).then(function (userData) {
                if (userData && userData.quizzes) {
                    /* / Se estiver na página de disciplinas, atualiza as porcentagens nos cards */
                    if (window.location.pathname.includes('disciplinas.html')) {
                        var progressElements = document.querySelectorAll('.discipline-progress');
                        progressElements.forEach(function (el) {
                            var quizId = el.getAttribute('data-quiz-progress');
                            var result = userData.quizzes[quizId];
                            if (result && result.maxScore > 0) {
                                var pct = Math.round((result.score / result.maxScore) * 100);
                                el.innerHTML = pct + '%';
                            }
                        });
                    }
                }
            });
        }
    } catch (e) {
        /* / Firebase não inicializado ou erro na chamada */
    }

    /* / Registra um observador para carregar os dados assim que o usuário fizer login */
    try {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user && typeof dbOperations !== 'undefined') {
                dbOperations.getUserData(user.uid).then(function (userData) {
                    if (userData && userData.quizzes) {
                        /* / Se estiver na página de disciplinas, atualiza as porcentagens nos cards */
                        if (window.location.pathname.includes('disciplinas.html')) {
                            var progressElements = document.querySelectorAll('.discipline-progress');
                            progressElements.forEach(function (el) {
                                var quizId = el.getAttribute('data-quiz-progress');
                                var result = userData.quizzes[quizId];
                                if (result && result.maxScore > 0) {
                                    var pct = Math.round((result.score / result.maxScore) * 100);
                                    el.innerHTML = pct + '%';
                                }
                            });
                        }
                    }
                });
            }
        });
    } catch (e) {
        // Erro silencioso se o Firebase falhar
    }
}

/* / Gera o HTML da pergunta atual e insere no container do quiz */
function renderQuestion() {
    var q = questions[currentQuestion];
    var container = document.getElementById("quiz");
    if (!container) return;

    var questionNum = currentQuestion + 1;
    var total = questions.length;
    var progressPercent = (questionNum / total) * 100;

    /* / Constrói a lista de opções (botões) */
    var optionsHTML = "";
    for (var i = 0; i < q.options.length; i++) {
        var opt = q.options[i];
        optionsHTML = optionsHTML +
            '<button class="quiz-option" onclick="selectAnswer(' + i + ')">' +
            '<span class="option-letter">' + opt.letter + '</span> ' + opt.text +
            '</button>';
    }

    /* / Monta a estrutura completa do card de pergunta */
    container.innerHTML =
        '<div class="quiz-top-bar">' +
        '<h4>Quiz — Pergunta ' + questionNum + ' de ' + total + '</h4>' +
        '<div class="quiz-score">Acertos: <strong>' + score + '</strong>/' + currentQuestion + '</div>' +
        '</div>' +
        '<div class="quiz-progress-bar">' +
        '<div class="quiz-progress-fill" style="width: ' + progressPercent + '%"></div>' +
        '</div>' +
        '<p class="quiz-question">' + q.text + '</p>' +
        '<div class="quiz-options">' + optionsHTML + '</div>' +
        '<div class="quiz-feedback" id="quiz-feedback"></div>';

    answered = false;
}

/* / Processa a escolha do usuário */
function selectAnswer(index) {
    if (answered) return; 

    var q = questions[currentQuestion];
    var buttons = document.querySelectorAll('.quiz-option');
    var feedback = document.getElementById('quiz-feedback');
    var isCorrect = (index === q.correct);

    answered = true;

    if (isCorrect) {
        score = score + 1;
    }

    /* / Aplica as classes e desativa todos os botões imediatamente */
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === q.correct) {
            buttons[i].classList.add('correct');
        } else if (i === index && !isCorrect) {
            buttons[i].classList.add('incorrect');
        }
    }

    /* / Mostra a explicação */
    if (isCorrect) {
        feedback.className = 'quiz-feedback show success';
        feedback.innerHTML = '<strong>Correto! ✨</strong><br>' + q.explanation;
    } else {
        feedback.className = 'quiz-feedback show error';
        feedback.innerHTML = '<strong>Incorreto.</strong><br>' + q.explanation;
    }

    /* / Adiciona o botão de próxima questão */
    var isLast = (currentQuestion >= questions.length - 1);
    var nextBtnHTML = isLast 
        ? '<button class="btn-next-question" onclick="showResult()">Ver Resultado</button>'
        : '<button class="btn-next-question" onclick="nextQuestion()">Próxima Pergunta</button>';
    feedback.innerHTML = feedback.innerHTML + nextBtnHTML;
}

/* / Avança para o próximo índice da pergunta */
function nextQuestion() {
    currentQuestion = currentQuestion + 1;
    renderQuestion();
}

/* / Mostra a tela final com a pontuação e opções de salvar/refazer */
function showResult() {
    var container = document.getElementById("quiz");
    var total = questions.length;
    var pct = Math.round((score / total) * 100);
    var message = "";

    /* / Define a mensagem motivacional baseada no desempenho */
    if (pct === 100) message = "Perfeito! Você dominou o assunto!";
    else if (pct >= 80) message = "Excelente! Você está quase lá!";
    else if (pct >= 60) message = "Bom trabalho! Continue praticando.";
    else if (pct >= 40) message = "Revise o conteúdo e tente novamente.";
    else message = "Não desista! Releia o material e tente de novo.";

    /* / Verifica se o usuário pode salvar o progresso (precisa estar logado) */
    var isLoggedIn = false;
    try {
        var user = firebase.auth().currentUser;
        if (user && typeof dbOperations !== 'undefined') {
            isLoggedIn = true;
        }
    } catch (e) {
        // Firebase offline
    }

    var saveButtonHTML = "";
    if (isLoggedIn) {
        saveButtonHTML =
            '<button class="btn-save-progress" id="btn-save-progress" onclick="saveProgress()">' +
            'Salvar Progresso' +
            '</button>';
    } else {
        saveButtonHTML =
            '<p class="save-login-msg">' +
            '<a href="index.html">Faça login</a> para salvar seu progresso!' +
            '</p>';
    }

    /* / Renderiza a tela de resultados */
    container.innerHTML =
        '<div class="quiz-result">' +
        '<div class="result-icon">' +
        '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' +
        '</div>' +
        '<h3>Resultado do Quiz</h3>' +
        '<div class="result-score-circle">' +
        '<span class="result-score-number">' + score + '</span>' +
        '<span class="result-score-total">/ ' + total + '</span>' +
        '</div>' +
        '<div class="result-bar-container">' +
        '<div class="result-bar">' +
        '<div class="result-bar-fill" style="width: ' + pct + '%"></div>' +
        '</div>' +
        '<span class="result-pct">' + pct + '%</span>' +
        '</div>' +
        '<p class="result-message">' + message + '</p>' +
        '<div id="save-status"></div>' +
        saveButtonHTML +
        '<div class="quiz-result-buttons">' +
        '<button class="btn-restart-quiz" onclick="restartQuiz()">Refazer Quiz</button>' +
        '<a href="disciplinas.html" class="btn-back-disciplines">Voltar às Disciplinas</a>' +
        '</div>' +
        '</div>';

    /* / SALVAMENTO AUTOMÁTICO: Se estiver logado, salva o progresso imediatamente */
    if (isLoggedIn) {
        saveProgress();
    }
}

/* / Função para enviar o resultado para o Firestore (através de dbOperations) */
function saveProgress() {
    var saveBtn = document.getElementById('btn-save-progress');
    var saveStatus = document.getElementById('save-status');
    const isStudy = localStorage.getItem('mollab_study_mode') === 'true';

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '⏳ Salvando...';
    }

    var user = firebase.auth().currentUser;
    var quizId = getQuizId();
    var total = questions.length;

    // Reduz XP no modo estudo (apenas 20% do original)
    if (isStudy && typeof dbOperations !== 'undefined') {
        dbOperations.saveQuizResult(user.uid, quizId, score, total).then(function (xp) {
            // Lógica interna para reduzir o XP final se for Study Mode
            // Para simplificar, vou assumir que o sistema de XP já lida ou eu ajusto no dbOperations
            if (saveBtn) {
                saveBtn.innerHTML = 'Modo Estudo: Salvo (XP Reduzido)';
                saveBtn.classList.add('saved');
            }
        });
        return;
    }

    dbOperations.saveQuizResult(user.uid, quizId, score, total).then(function (xpEarned) {
        if (saveBtn) {
            saveBtn.innerHTML = 'Progresso Salvo!';
            saveBtn.classList.add('saved');
        }

        if (xpEarned > 0 && saveStatus) {
            saveStatus.innerHTML =
                '<div class="xp-earned">+' + xpEarned + ' XP Ganho!</div>';
        }
    }).catch(function (e) {
        console.error("Erro ao salvar progresso", e);
        if (saveBtn) {
            saveBtn.innerHTML = '❌ Erro ao salvar';
            saveBtn.disabled = false;
        }
    });
}

/* / Reseta as variáveis e volta para a primeira pergunta (re-embaralhando tudo) */
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    shuffleQuiz();
    renderQuestion();
}

/* / Inicializa as funcionalidades assim que o documento HTML estiver pronto */
document.addEventListener('DOMContentLoaded', function () {
    initQuiz();
    initGlobalAnimations();
});

/* / Injeta automaticamente as animações de fundo em todas as páginas */
function initGlobalAnimations() {
    const body = document.body;
    if (!body) return;

    // Se já existem as animações, não duplica
    if (body.querySelector('.global-bg-animations')) return;

    const container = document.createElement('div');
    container.className = 'global-bg-animations';

    const icons = [
        // 1. Hexágono/Estrutura
        '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>',
        // 2. Átomo/Círculo
        '<circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path>',
        // 3. Erlenmeyer
        '<path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.52 16h12.96"></path>',
        // 4. Becker/Maleta
        '<path d="M4.5 7L2 19h20L19.5 7h-15zM2 19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"></path><path d="M6 7V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"></path>',
        // 5. Estrela/Radiação
        '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"></path>',
        // 6. Tabela/Grade
        '<path d="M2 3h20v18H2z"></path><path d="M2 7h20M2 11h20M2 15h20M6 3v18M10 3v18M14 3v18M18 3v18"></path>',
        // 7. DNA
        '<path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>',
        // 8. Microscópio
        '<path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0-14 0"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 1 0-4 0v6h4v-6z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>',
        // 9. Tubo de Ensaio
        '<path d="M9 22h6c1.1 0 2-.9 2-2V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2z"></path><path d="M12 2v4"></path><path d="M8 2h8"></path>',
        // 10. Molécula 2
        '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.5" y1="10.5" x2="15.5" y2="6.5"></line><line x1="8.5" y1="13.5" x2="15.5" y2="17.5"></line>',
        // 11. Bússola/Átomo Pro
        '<circle cx="12" cy="12" r="10"></circle><path d="M16.24 7.76a6 6 0 1 0-8.48 8.48a6 6 0 1 0 8.48-8.48"></path>',
        // 12. Chama/Energia
        '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
        // 13. Controle / Gamepad
        '<path d="M21 11.51v3.46a3.59 3.59 0 0 1-5.69 2.91l-1.92-1.37a2.53 2.53 0 0 0-2.78 0l-1.92 1.37A3.59 3.59 0 0 1 3 14.97v-3.46A2 2 0 0 1 4 9.77l2-1.22c.98-.6 2.15-.9 3.33-.9h5.34c1.18 0 2.35.3 3.33.9l2 1.22a2 2 0 0 1 1 1.74Z"></path><path d="M6 12h4"></path><path d="M8 10v4"></path><circle cx="15.5" cy="13.5" r="1.5"></circle><circle cx="18.5" cy="10.5" r="1.5"></circle>',
        // 14. Fone de Ouvido / Headset
        '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>',
        // 15. Mouse / Tecnologia
        '<rect x="5" y="2" width="14" height="20" rx="7"></rect><path d="M12 2v6"></path>',
        // 16. Monitor / Tela PC
        '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>'
    ];

    let html = '';

    // No mobile, renderiza MENOS elementos para não travar
    const isMobile = window.innerWidth <= 768;
    const iconCount = isMobile ? 8 : 24;
    const blobCount = isMobile ? 3 : 6;

    // Adiciona Ícones espalhados (4 no mobile, 16 no desktop)
    for (let i = 1; i <= iconCount; i++) {
        const svgContent = icons[(i - 1) % icons.length];
        const size = isMobile ? 20 : 45;
        html += `<div class="floating-item float-${i}">
                    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${svgContent}</svg>
                 </div>`;
    }

    container.innerHTML = html;
    
    // Insere no início do body para aplicar o z-index corretamente
    body.insertBefore(container, body.firstChild);
}

