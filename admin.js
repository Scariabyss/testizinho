/**
 * Mollab – Lógica do Painel de Administração
 * Controla a autenticação de admin, CRUD de quizzes e seed de dados padrão.
 */

/* =====================
   MAPEAMENTO DAS DISCIPLINAS
   ===================== */
var DISCIPLINES_MAP = {
    'estrutura-atomica':   { name: 'Estrutura Atômica',   file: 'estrutura-atomica.html' },
    'tabela-periodica':    { name: 'Tabela Periódica',    file: 'tabela-periodica.html' },
    'ligacoes-quimicas':   { name: 'Ligações Químicas',   file: 'ligacoes-quimicas.html' },
    'funcoes-organicas':   { name: 'Funções Orgânicas',   file: 'funcoes-organicas.html' },
    'hidrocarbonetos':     { name: 'Hidrocarbonetos',     file: 'hidrocarbonetos.html' },
    'termoquimica':        { name: 'Termoquímica',        file: 'termoquimica.html' },
    'cinetica-quimica':    { name: 'Cinética Química',    file: 'cinetica-quimica.html' },
    'balancamento':        { name: 'Balanceamento',       file: 'balancamento.html' },
    'neutralizacao':       { name: 'Neutralização',       file: 'neutralizacao.html' }
};

/* =====================
   DADOS DEFAULT DOS QUIZZES (Seed inicial)
   ===================== */
var DEFAULT_QUIZZES = {
    'estrutura-atomica': {
        title: 'Estrutura Atômica',
        questions: [
            {
                text: "Qual é a partícula subatômica com carga elétrica negativa?",
                options: [
                    { letter: "A", text: "Próton" },
                    { letter: "B", text: "Nêutron" },
                    { letter: "C", text: "Elétron" },
                    { letter: "D", text: "Fóton" }
                ],
                correct: 2,
                explanation: "Os elétrons são partículas subatômicas com carga elétrica negativa que orbitam o núcleo do átomo."
            },
            {
                text: "O que é o número atômico (Z) de um elemento?",
                options: [
                    { letter: "A", text: "O número de nêutrons no núcleo" },
                    { letter: "B", text: "O número de prótons no núcleo" },
                    { letter: "C", text: "A soma de prótons e nêutrons" },
                    { letter: "D", text: "O número de elétrons na eletrosfera" }
                ],
                correct: 1,
                explanation: "O número atômico (Z) corresponde ao número de prótons no núcleo, sendo a identidade de cada elemento químico."
            },
            {
                text: "Qual modelo atômico introduziu a ideia de órbitas quantizadas?",
                options: [
                    { letter: "A", text: "Modelo de Dalton" },
                    { letter: "B", text: "Modelo de Thomson" },
                    { letter: "C", text: "Modelo de Rutherford" },
                    { letter: "D", text: "Modelo de Bohr" }
                ],
                correct: 3,
                explanation: "Niels Bohr propôs que os elétrons giram em órbitas com energias definidas (quantizadas) ao redor do núcleo."
            },
            {
                text: "Íons com carga positiva são chamados de:",
                options: [
                    { letter: "A", text: "Ânions" },
                    { letter: "B", text: "Cátions" },
                    { letter: "C", text: "Isótopos" },
                    { letter: "D", text: "Isóbaros" }
                ],
                correct: 1,
                explanation: "Cátions são átomos que perderam elétrons, ficando com carga positiva. Ânions são o oposto (carga negativa)."
            }
        ]
    },
    'tabela-periodica': {
        title: 'Tabela Periódica',
        questions: [
            {
                text: "Como os elementos são organizados na Tabela Periódica moderna?",
                options: [
                    { letter: "A", text: "Ordem decrescente de massa" },
                    { letter: "B", text: "Ordem crescente de número atômico" },
                    { letter: "C", text: "Ordem alfabética de nomes" },
                    { letter: "D", text: "Pela cor de cada elemento" }
                ],
                correct: 1,
                explanation: "Diferente de Mendeleev, a tabela atual segue a ordem crescente do número de prótons (número atômico)."
            },
            {
                text: "O que as colunas verticais da tabela representam?",
                options: [
                    { letter: "A", text: "Períodos" },
                    { letter: "B", text: "Famílias ou Grupos" },
                    { letter: "C", text: "Isótopos" },
                    { letter: "D", text: "Estados físicos" }
                ],
                correct: 1,
                explanation: "As colunas verticais são chamadas de grupos ou famílias e reúnem elementos com propriedades químicas semelhantes."
            },
            {
                text: "Qual destes elementos é um Gás Nobre?",
                options: [
                    { letter: "A", text: "Hidrogênio" },
                    { letter: "B", text: "Oxigênio" },
                    { letter: "C", text: "Hélio" },
                    { letter: "D", text: "Ferro" }
                ],
                correct: 2,
                explanation: "O Hélio pertence ao Grupo 18, a família dos Gases Nobres, conhecidos por sua baixa reatividade."
            }
        ]
    },
    'ligacoes-quimicas': {
        title: 'Ligações Químicas',
        questions: [
            {
                text: "O que diz a Regra do Octeto?",
                options: [
                    { letter: "A", text: "Átomos são estáveis com 2 elétrons" },
                    { letter: "B", text: "Átomos buscam ter 8 elétrons na camada de valência" },
                    { letter: "C", text: "Átomos devem ter 8 prótons no núcleo" },
                    { letter: "D", text: "Ligações ocorrem apenas entre 8 átomos" }
                ],
                correct: 1,
                explanation: "A Regra do Octeto estabelece que os átomos tendem a se ligar para atingir 8 elétrons na camada externa, assemelhando-se aos gases nobres."
            },
            {
                text: "Qual ligação ocorre pela transferência definitiva de elétrons?",
                options: [
                    { letter: "A", text: "Ligação Covalente" },
                    { letter: "B", text: "Ligação Metálica" },
                    { letter: "C", text: "Ligação Iônica" },
                    { letter: "D", text: "Ponte de Hidrogênio" }
                ],
                correct: 2,
                explanation: "Na ligação iônica, um átomo (metal) doa elétrons para outro (ametal), resultando na atração entre íons opostos."
            },
            {
                text: "A água (H₂O) possui qual tipo de ligação entre seus átomos?",
                options: [
                    { letter: "A", text: "Iônica" },
                    { letter: "B", text: "Covalente" },
                    { letter: "C", text: "Metálica" },
                    { letter: "D", text: "Não há ligação" }
                ],
                correct: 1,
                explanation: "Na molécula de água, os átomos de hidrogênio e oxigênio compartilham elétrons, caracterizando uma ligação covalente."
            }
        ]
    },
    'funcoes-organicas': {
        title: 'Funções Orgânicas',
        questions: [
            {
                text: "O prefixo -ol indica qual função orgânica?",
                options: [
                    { letter: "A", text: "Ácidos" },
                    { letter: "B", text: "Éteres" },
                    { letter: "C", text: "Álcoois" },
                    { letter: "D", text: "Hidrocarbonetos" }
                ],
                correct: 2,
                explanation: "O sufixo -ol é a marca registrada dos álcoois, como o Etanol (álcool comum)."
            },
            {
                text: "Qual grupo funcional caracteriza os Ácidos Carboxílicos?",
                options: [
                    { letter: "A", text: "-OH" },
                    { letter: "B", text: "-CHO" },
                    { letter: "C", text: "-COOH" },
                    { letter: "D", text: "-O-" }
                ],
                correct: 2,
                explanation: "O grupo Carboxila (-COOH) é a união da carbonila com a hidroxila num mesmo carbono."
            },
            {
                text: "A acetona (propanona) pertence a qual grupo?",
                options: [
                    { letter: "A", text: "Aldeído" },
                    { letter: "B", text: "Cetona" },
                    { letter: "C", text: "Éster" },
                    { letter: "D", text: "Fenol" }
                ],
                correct: 1,
                explanation: "A Propanona possui uma carbonila entre dois carbonos, o que a classifica como uma cetona."
            }
        ]
    },
    'hidrocarbonetos': {
        title: 'Hidrocarbonetos',
        questions: [
            {
                text: "Qual é a principal diferença entre um alcano e um alceno?",
                options: [
                    { letter: "A", text: "Alcanos têm oxigênio" },
                    { letter: "B", text: "Alcenos possuem ao menos uma ligação dupla" },
                    { letter: "C", text: "Alcanos são formados por nitrogênio" },
                    { letter: "D", text: "Não há diferença" }
                ],
                correct: 1,
                explanation: "Alcenos são hidrocarbonetos insaturados que contêm pelo menos uma ligação dupla entre átomos de carbono."
            },
            {
                text: "O metano (CH₄) pertence a qual classe?",
                options: [
                    { letter: "A", text: "Alceno" },
                    { letter: "B", text: "Alcino" },
                    { letter: "C", text: "Alcano" },
                    { letter: "D", text: "Aromático" }
                ],
                correct: 2,
                explanation: "O metano possui apenas ligações simples entre o carbono e os hidrogênios, sendo o alcano mais simples."
            },
            {
                text: "Qual o sufixo utilizado na nomenclatura de alcinos?",
                options: [
                    { letter: "A", text: "-ano" },
                    { letter: "B", text: "-eno" },
                    { letter: "C", text: "-ino" },
                    { letter: "D", text: "-ol" }
                ],
                correct: 2,
                explanation: "Seguindo a regra da IUPAC, o sufixo -ino identifica os hidrocarbonetos que possuem ligações triplas."
            }
        ]
    },
    'termoquimica': {
        title: 'Termoquímica',
        questions: [
            {
                text: "Uma reação que libera calor para o ambiente é chamada de:",
                options: [
                    { letter: "A", text: "Endotérmica" },
                    { letter: "B", text: "Isotérmica" },
                    { letter: "C", text: "Exotérmica" },
                    { letter: "D", text: "Adiabática" }
                ],
                correct: 2,
                explanation: "Processos exotérmicos liberam energia térmica, resultando em um aumento da temperatura ao redor."
            },
            {
                text: "O que significa um ΔH negativo?",
                options: [
                    { letter: "A", text: "Absorção de calor" },
                    { letter: "B", text: "Liberação de calor" },
                    { letter: "C", text: "Reação impossível" },
                    { letter: "D", text: "Temperatura constante" }
                ],
                correct: 1,
                explanation: "ΔH < 0 indica que o sistema perdeu energia, logo a reação é exotérmica."
            },
            {
                text: "A combustão da madeira é um exemplo de processo:",
                options: [
                    { letter: "A", text: "Endotérmico" },
                    { letter: "B", text: "Exotérmico" },
                    { letter: "C", text: "Neutro" },
                    { letter: "D", text: "Isolante" }
                ],
                correct: 1,
                explanation: "Toda combustão (queima) libera grande quantidade de energia, sendo um clássico exemplo exotérmico."
            }
        ]
    },
    'cinetica-quimica': {
        title: 'Cinética Química',
        questions: [
            {
                text: "O que um catalisador faz em uma reação química?",
                options: [
                    { letter: "A", text: "Aumenta o ΔH da reação" },
                    { letter: "B", text: "Diminui a energia de ativação" },
                    { letter: "C", text: "É consumido durante o processo" },
                    { letter: "D", text: "Torna a reação endotérmica" }
                ],
                correct: 1,
                explanation: "Os catalisadores oferecem um caminho alternativo com menor barreira de energia, sem serem consumidos."
            },
            {
                text: "Como o aumento da temperatura afeta a velocidade da maioria das reações?",
                options: [
                    { letter: "A", text: "Diminui a velocidade" },
                    { letter: "B", text: "Aumenta a velocidade" },
                    { letter: "C", text: "Não afeta" },
                    { letter: "D", text: "Cessa a reação" }
                ],
                correct: 1,
                explanation: "Temperaturas maiores resultam em moléculas mais rápidas, aumentando a frequência e a força das colisões."
            },
            {
                text: "Para que uma colisão seja efetiva, é necessário:",
                options: [
                    { letter: "A", text: "Apenas contato físico" },
                    { letter: "B", text: "Orientação favorável e energia mínima" },
                    { letter: "C", text: "Luz solar constante" },
                    { letter: "D", text: "Um meio líquido" }
                ],
                correct: 1,
                explanation: "A teoria das colisões exige geometria espacial correta e energia superior à energia de ativação."
            }
        ]
    },
    'balancamento': {
        title: 'Balanceamento Químico',
        questions: [
            {
                text: "Quem enunciou a Lei da Conservação das Massas (Na natureza nada se cria...)?",
                options: [
                    { letter: "A", text: "Dalton" },
                    { letter: "B", text: "Lavoisier" },
                    { letter: "C", text: "Proust" },
                    { letter: "D", text: "Rutherford" }
                ],
                correct: 1,
                explanation: "Antoine Lavoisier afirmou que em um sistema fechado, a massa total dos reagentes é igual à massa total dos produtos."
            },
            {
                text: "No balanceamento da equação H₂ + O₂ -> H₂O, quais são os coeficientes corretos?",
                options: [
                    { letter: "A", text: "1, 1, 1" },
                    { letter: "B", text: "2, 1, 2" },
                    { letter: "C", text: "1, 2, 1" },
                    { letter: "D", text: "2, 2, 2" }
                ],
                correct: 1,
                explanation: "2H₂ + O₂ -> 2H₂O. Temos 4 hidrogênios e 2 oxigênios de cada lado."
            },
            {
                text: "O que indica o coeficiente estequiométrico?",
                options: [
                    { letter: "A", text: "O número de átomos na molécula" },
                    { letter: "B", text: "O número de moléculas (ou mols) que participam da reação" },
                    { letter: "C", text: "O estado físico da substância" }
                ],
                correct: 1,
                explanation: "Os coeficientes (números grandes à esquerda) indicam a proporção em mols/moléculas da substância."
            }
        ]
    },
    'neutralizacao': {
        title: 'Neutralização',
        questions: [
            {
                text: "Quais são os produtos de uma reação de neutralização total?",
                options: [
                    { letter: "A", text: "Sal e Água" },
                    { letter: "B", text: "Gás e Sólido" },
                    { letter: "C", text: "Apenas Ácido" },
                    { letter: "D", text: "Apenas Base" }
                ],
                correct: 0,
                explanation: "Na neutralização, o H+ do ácido e o OH- da base formam água, e os íons restantes formam o sal."
            },
            {
                text: "Qual é o valor do pH de uma solução perfeitamente neutra a 25°C?",
                options: [
                    { letter: "A", text: "0" },
                    { letter: "B", text: "7" },
                    { letter: "C", text: "14" },
                    { letter: "D", text: "1" }
                ],
                correct: 1,
                explanation: "O pH 7 é considerado neutro. Valores abaixo de 7 são ácidos e acima de 7 são básicos."
            },
            {
                text: "A Fenolftaleína fica rosa em qual meio?",
                options: [
                    { letter: "A", text: "Ácido" },
                    { letter: "B", text: "Básico (Alcalino)" },
                    { letter: "C", text: "Neutro" },
                    { letter: "D", text: "No vácuo" }
                ],
                correct: 1,
                explanation: "A fenolftaleína é um indicador que muda de incolor para rosa intenso em presença de bases."
            }
        ]
    }
};

/* =====================
   VARIÁVEIS DE ESTADO
   ===================== */
var currentAdminUser = null;
var currentEditingQuizId = null;
var cachedQuizzes = {};

/* Lista GLOBAL de emails com acesso de administrador */
var ADMIN_EMAILS_LIST = ['mollabquimica@gmail.com', 'dudanicoly1213@gmail.com'];

/* =====================
   INICIALIZAÇÃO & CONTROLE DE ACESSO
   ===================== */
document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            denyAccess();
            return;
        }

        /* / Verifica direto pelo EMAIL se é admin */
        if (ADMIN_EMAILS_LIST.includes(user.email)) {
            currentAdminUser = user;
            /* / Garante que o role no Firestore fique 'admin' */
            db.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true });

            if (typeof dbOperations !== 'undefined') {
                dbOperations.getUserData(user.uid).then(function (data) {
                    grantAccess(user, data || {});
                }).catch(function () {
                    grantAccess(user, {});
                });
            } else {
                grantAccess(user, {});
            }
        } else {
            denyAccess();
        }
    });
});

function grantAccess(user, data) {
    var loading = document.getElementById('admin-loading');
    var layout = document.getElementById('admin-layout');
    var denied = document.getElementById('admin-denied');

    /* / Preenche informações do admin no sidebar */
    var avatarEl = document.getElementById('admin-avatar');
    var nameEl = document.getElementById('admin-user-name');
    if (avatarEl && user.email) {
        avatarEl.textContent = user.email.charAt(0).toUpperCase();
    }
    if (nameEl) {
        nameEl.textContent = (data && data.name) ? data.name : user.email;
    }

    /* / Mostra layout e esconde outros */
    if (denied) denied.style.display = 'none';
    if (layout) layout.style.display = 'flex';

    /* / Carrega dados iniciais e esconde loading */
    loadDashboardStats();
    buildQuizSelector();

    setTimeout(function () {
        if (loading) loading.classList.add('hidden');
    }, 400);
}

function denyAccess() {
    var loading = document.getElementById('admin-loading');
    var denied = document.getElementById('admin-denied');
    var layout = document.getElementById('admin-layout');

    if (layout) layout.style.display = 'none';
    if (denied) denied.classList.add('show');

    setTimeout(function () {
        if (loading) loading.classList.add('hidden');
    }, 400);
}

/* =====================
   NAVEGAÇÃO DO PAINEL
   ===================== */
function switchAdminSection(sectionName) {
    var sections = document.querySelectorAll('.admin-section');
    var navItems = document.querySelectorAll('.admin-nav-item');

    sections.forEach(function (s) { s.classList.remove('active'); });
    navItems.forEach(function (n) { n.classList.remove('active'); });

    var target = document.getElementById('section-' + sectionName);
    if (target) {
        target.classList.add('active');
    }

    navItems.forEach(function (n) {
        if (n.getAttribute('data-section') === sectionName) {
            n.classList.add('active');
        }
    });

    /* / Fecha sidebar no mobile */
    var sidebar = document.getElementById('admin-sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }

    if (sectionName === 'calendar' && typeof loadCalendarEvents === 'function') {
        loadCalendarEvents();
    } else if (sectionName === 'documents' && typeof loadDocuments === 'function') {
        loadDocuments();
    } else if (sectionName === 'dashboard') {
        loadDashboardStats();
    }
}

/* =====================
   DASHBOARD
   ===================== */
function loadDashboardStats() {
    if (typeof dbOperations === 'undefined') return;

    dbOperations.getAllQuizzesAdmin().then(function (quizzes) {
        cachedQuizzes = {};
        var totalQuestions = 0;

        quizzes.forEach(function (q) {
            cachedQuizzes[q.id] = q;
            if (q.questions) {
                totalQuestions += q.questions.length;
            }
        });

        var statQuizzes = document.getElementById('stat-quizzes');
        var statQuestions = document.getElementById('stat-questions');
        if (statQuizzes) statQuizzes.textContent = quizzes.length;
        if (statQuestions) statQuestions.textContent = totalQuestions;

        /* / Se não existe nenhum quiz no banco, mostra o banner de seed */
        var seedBanner = document.getElementById('seed-banner');
        if (quizzes.length === 0 && seedBanner) {
            seedBanner.style.display = 'block';
        } else if (seedBanner) {
            seedBanner.style.display = 'none';
        }
    });
}

/* =====================
   QUIZ SELECTOR
   ===================== */
function buildQuizSelector() {
    var selector = document.getElementById('quiz-selector');
    if (!selector) return;

    selector.innerHTML = '';

    /* / Lê parâmetro ?quiz= da URL para pré-selecionar a disciplina */
    var urlParams = new URLSearchParams(window.location.search);
    var preselectedQuiz = urlParams.get('quiz') || '';

    var keys = Object.keys(DISCIPLINES_MAP);
    var defaultKey = preselectedQuiz && DISCIPLINES_MAP[preselectedQuiz] ? preselectedQuiz : keys[0];

    keys.forEach(function (key) {
        var btn = document.createElement('button');
        var isActive = (key === defaultKey);
        btn.className = 'quiz-selector-btn' + (isActive ? ' active' : '');
        btn.textContent = DISCIPLINES_MAP[key].name;
        btn.setAttribute('data-quiz-id', key);
        btn.onclick = function () {
            selectQuizForEditing(key);

            /* / Atualiza visual do seletor */
            var allBtns = selector.querySelectorAll('.quiz-selector-btn');
            allBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
        };
        selector.appendChild(btn);
    });

    /* / Seleciona a disciplina pré-escolhida (via URL) ou a primeira */
    selectQuizForEditing(defaultKey);

    /* / Se veio via URL com #quizzes, navega automaticamente para a seção de quizzes */
    if (window.location.hash === '#quizzes' || preselectedQuiz) {
        switchAdminSection('quizzes');
    }
}

function selectQuizForEditing(quizId) {
    currentEditingQuizId = quizId;

    /* / Tenta buscar do cache; se não estiver, busca do Firebase */
    if (cachedQuizzes[quizId]) {
        renderQuizEditor(cachedQuizzes[quizId]);
    } else {
        dbOperations.getQuizData(quizId).then(function (data) {
            if (data) {
                cachedQuizzes[quizId] = data;
                renderQuizEditor(data);
            } else {
                /* / Quiz não existe no banco, mostra editor vazio */
                renderQuizEditor({ title: DISCIPLINES_MAP[quizId].name, questions: [] });
            }
        }).catch(function () {
            renderQuizEditor({ title: DISCIPLINES_MAP[quizId].name, questions: [] });
        });
    }
}

/* =====================
   QUIZ EDITOR – RENDERIZAÇÃO
   ===================== */
function renderQuizEditor(quizData) {
    var list = document.getElementById('questions-list');
    if (!list) return;

    var questions = quizData.questions || [];

    if (questions.length === 0) {
        list.innerHTML =
            '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">' +
            '<div style="margin-bottom: 1rem; color: var(--accent-purple); display: flex; justify-content: center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>' +
            '<p style="font-weight: 600; font-size: 1.1rem; color: #fff;">Nenhuma pergunta cadastrada.</p>' +
            '<p style="font-size: 0.9rem;">Use o botão "Nova Pergunta" acima para começar.</p>' +
            '</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < questions.length; i++) {
        html += buildQuestionCardHTML(questions[i], i);
    }
    list.innerHTML = html;
}

function buildQuestionCardHTML(q, index) {
    var letters = ['A', 'B', 'C', 'D'];
    var optionsHTML = '';

    for (var j = 0; j < q.options.length; j++) {
        var opt = q.options[j];
        var isCorrect = (j === q.correct);
        optionsHTML +=
            '<div class="option-row">' +
            '<span class="option-letter-badge' + (isCorrect ? ' correct' : '') + '">' + letters[j] + '</span>' +
            '<input class="admin-input" type="text" value="' + escapeHTML(opt.text) + '" ' +
            'data-question="' + index + '" data-option="' + j + '" onchange="updateOptionText(this)" />' +
            '<input type="radio" class="option-correct-radio" name="correct-' + index + '" ' +
            (isCorrect ? 'checked' : '') + ' data-question="' + index + '" data-option="' + j + '" ' +
            'onchange="updateCorrectAnswer(this)" title="Marcar como correta" />' +
            '</div>';
    }

    return '' +
        '<div class="question-card" data-question-index="' + index + '">' +
        '<div class="question-card-header">' +
        '<span class="question-number">Pergunta ' + (index + 1) + '</span>' +
        '<div class="question-actions">' +
        '<button class="btn-icon-sm" onclick="deleteQuestion(' + index + ')" title="Excluir pergunta">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="field-group">' +
        '<label class="admin-label">Enunciado</label>' +
        '<textarea class="admin-textarea" data-question="' + index + '" onchange="updateQuestionText(this)">' + escapeHTML(q.text) + '</textarea>' +
        '</div>' +
        '<div class="field-group">' +
        '<label class="admin-label">Alternativas <span style="font-weight:400; text-transform: none;">(selecione a correta ⬤)</span></label>' +
        optionsHTML +
        '</div>' +
        '<div class="field-group">' +
        '<label class="admin-label">Explicação</label>' +
        '<textarea class="admin-textarea" data-question="' + index + '" onchange="updateExplanation(this)">' + escapeHTML(q.explanation) + '</textarea>' +
        '</div>' +
        '</div>';
}

/* =====================
   QUIZ EDITOR – OPERAÇÕES
   ===================== */
function addNewQuestion() {
    if (!currentEditingQuizId) return;

    var quizId = currentEditingQuizId;
    if (!cachedQuizzes[quizId]) {
        cachedQuizzes[quizId] = { title: DISCIPLINES_MAP[quizId].name, questions: [] };
    }

    cachedQuizzes[quizId].questions.push({
        text: "",
        options: [
            { letter: "A", text: "" },
            { letter: "B", text: "" },
            { letter: "C", text: "" },
            { letter: "D", text: "" }
        ],
        correct: 0,
        explanation: ""
    });

    renderQuizEditor(cachedQuizzes[quizId]);
    showToast('Pergunta adicionada!', 'success');
}

function deleteQuestion(index) {
    if (!currentEditingQuizId || !cachedQuizzes[currentEditingQuizId]) return;

    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;

    cachedQuizzes[currentEditingQuizId].questions.splice(index, 1);
    renderQuizEditor(cachedQuizzes[currentEditingQuizId]);
    showToast('Pergunta removida.', 'success');
}

function updateQuestionText(el) {
    var qIndex = parseInt(el.getAttribute('data-question'));
    if (cachedQuizzes[currentEditingQuizId]) {
        cachedQuizzes[currentEditingQuizId].questions[qIndex].text = el.value;
    }
}

function updateOptionText(el) {
    var qIndex = parseInt(el.getAttribute('data-question'));
    var oIndex = parseInt(el.getAttribute('data-option'));
    if (cachedQuizzes[currentEditingQuizId]) {
        cachedQuizzes[currentEditingQuizId].questions[qIndex].options[oIndex].text = el.value;
    }
}

function updateCorrectAnswer(el) {
    var qIndex = parseInt(el.getAttribute('data-question'));
    var oIndex = parseInt(el.getAttribute('data-option'));
    if (cachedQuizzes[currentEditingQuizId]) {
        cachedQuizzes[currentEditingQuizId].questions[qIndex].correct = oIndex;

        /* / Atualiza visuais das badges */
        var card = el.closest('.question-card');
        if (card) {
            var badges = card.querySelectorAll('.option-letter-badge');
            badges.forEach(function (b) { b.classList.remove('correct'); });
            badges[oIndex].classList.add('correct');
        }
    }
}

function updateExplanation(el) {
    var qIndex = parseInt(el.getAttribute('data-question'));
    if (cachedQuizzes[currentEditingQuizId]) {
        cachedQuizzes[currentEditingQuizId].questions[qIndex].explanation = el.value;
    }
}

/* =====================
   SALVAR QUIZ NO FIREBASE
   ===================== */
function saveCurrentQuiz() {
    if (!currentEditingQuizId) return;

    var quizData = cachedQuizzes[currentEditingQuizId];
    if (!quizData) {
        showToast('Nenhum dado para salvar.', 'error');
        return;
    }

    /* / Garante que o title exista */
    if (!quizData.title && DISCIPLINES_MAP[currentEditingQuizId]) {
        quizData.title = DISCIPLINES_MAP[currentEditingQuizId].name;
    }

    dbOperations.saveQuizDataAdmin(currentEditingQuizId, quizData).then(function () {
        showToast('Quiz "' + quizData.title + '" salvo com sucesso!', 'success');
        loadDashboardStats();
    }).catch(function (err) {
        console.error('Erro ao salvar quiz:', err);
        showToast('Erro ao salvar. Verifique o console.', 'error');
    });
}

/* =====================
   SEED (Primeira vez) – Importar dados padrão
   ===================== */
function seedDefaultQuizzes() {
    var keys = Object.keys(DEFAULT_QUIZZES);
    var promises = [];

    keys.forEach(function (key) {
        promises.push(dbOperations.saveQuizDataAdmin(key, DEFAULT_QUIZZES[key]));
    });

    Promise.all(promises).then(function () {
        showToast('Todas as perguntas foram importadas!', 'success');

        /* / Atualiza cache local e re-renderiza */
        Object.keys(DEFAULT_QUIZZES).forEach(function (k) {
            cachedQuizzes[k] = DEFAULT_QUIZZES[k];
        });

        loadDashboardStats();

        var seedBanner = document.getElementById('seed-banner');
        if (seedBanner) seedBanner.style.display = 'none';

        if (currentEditingQuizId && cachedQuizzes[currentEditingQuizId]) {
            renderQuizEditor(cachedQuizzes[currentEditingQuizId]);
        }
    }).catch(function (err) {
        console.error('Erro no seed:', err);
        showToast('Erro durante a importação.', 'error');
    });
}

/* =====================
   UTILITÁRIOS
   ===================== */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(message, type) {
    var toast = document.getElementById('admin-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'admin-toast ' + type + ' show';

    setTimeout(function () {
        toast.classList.remove('show');
    }, 3000);
}

/* =====================
   CALENDAR / EVENTS
   ===================== */
var cachedEvents = [];

function openEventModal(eventId) {
    document.getElementById('event-form-container').style.display = 'block';
    
    if (eventId) {
        var ev = cachedEvents.find(function(e) { return e.id === eventId; });
        if (ev) {
            document.getElementById('event-id').value = ev.id;
            document.getElementById('event-date').value = ev.date;
            document.getElementById('event-type').value = ev.type;
            document.getElementById('event-title').value = ev.title;
            document.getElementById('event-desc').value = ev.description;
        }
    } else {
        document.getElementById('event-id').value = '';
        document.getElementById('event-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('event-type').value = 'Evento';
        document.getElementById('event-title').value = '';
        document.getElementById('event-desc').value = '';
    }
}

function closeEventModal() {
    document.getElementById('event-form-container').style.display = 'none';
}

function saveEvent() {
    var id = document.getElementById('event-id').value;
    var date = document.getElementById('event-date').value;
    var type = document.getElementById('event-type').value;
    var title = document.getElementById('event-title').value;
    var desc = document.getElementById('event-desc').value;

    if (!date || !title) {
        showToast('Data e Título são obrigatórios.', 'error');
        return;
    }

    var eventData = {
        date: date,
        type: type,
        title: title,
        description: desc,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    var collectionRef = db.collection('calendar_events');
    var promise;

    if (id) {
        promise = collectionRef.doc(id).update(eventData);
    } else {
        promise = collectionRef.add(eventData);
    }

    promise.then(function() {
        showToast('Evento salvo com sucesso!', 'success');
        closeEventModal();
        loadCalendarEvents();
    }).catch(function(err) {
        console.error('Erro ao salvar evento:', err);
        showToast('Erro ao salvar o evento: ' + err.message, 'error');
    });
}

function deleteEvent(eventId) {
    if (!confirm('Pagar permanentemente este aviso?')) return;

    db.collection('calendar_events').doc(eventId).delete().then(function() {
        showToast('Evento excluído.', 'success');
        loadCalendarEvents();
    }).catch(function(err) {
        console.error('Erro ao excluir:', err);
        showToast('Erro ao excluir o evento.', 'error');
    });
}

function loadCalendarEvents() {
    var list = document.getElementById('events-list');
    if (!list) return;

    list.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Carregando eventos...</div>';

    db.collection('calendar_events').orderBy('date', 'asc').get().then(function(snapshot) {
        cachedEvents = [];
        snapshot.forEach(function(doc) {
            var data = doc.data();
            data.id = doc.id;
            cachedEvents.push(data);
        });
        renderCalendarEvents();
    }).catch(function(err) {
        console.error('Erro ao buscar eventos:', err);
        list.innerHTML = '<div style="text-align: center; color: var(--red-500);">Erro ao carregar dados.</div>';
    });
}

function renderCalendarEvents() {
    var list = document.getElementById('events-list');
    if (!list) return;

    if (cachedEvents.length === 0) {
        list.innerHTML = 
            '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">' +
            '<p style="font-weight: 600; font-size: 1.1rem; color: #fff;">Nenhum evento agendado.</p>' +
            '<p style="font-size: 0.9rem;">Crie novos eventos clicando no botão acima.</p>' +
            '</div>';
        return;
    }

    var html = '';
    cachedEvents.forEach(function(ev) {
        html += '<div class="question-card" style="display: flex; justify-content: space-between; align-items: flex-start;">';
        html += '<div style="flex: 1;">';
        
        var typeBadgeColor = 'var(--accent-purple)';
        if (ev.type === 'Lembrete') typeBadgeColor = 'var(--color-warning)';
        if (ev.type === 'Atualização') typeBadgeColor = 'var(--color-success)';
        if (ev.type === 'Evento') typeBadgeColor = 'var(--accent-cyan)';

        html += '  <div style="margin-bottom: 8px;">';
        html += '    <span style="font-size: 0.75rem; font-weight: 700; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; color: ' + typeBadgeColor + ';">' + escapeHTML(ev.type) + '</span>';
        html += '    <span style="font-size: 0.85rem; font-weight: 600; margin-left: 10px; color: var(--accent-purple);">' + escapeHTML(ev.date) + '</span>';
        html += '  </div>';
        html += '  <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; color: #fff;">' + escapeHTML(ev.title) + '</h3>';
        html += '  <p style="font-size: 0.9rem; color: var(--text-secondary); white-space: pre-wrap;">' + escapeHTML(ev.description || '') + '</p>';
        html += '</div>';

        html += '<div style="display: flex; gap: 8px; flex-shrink: 0;">';
        html += '  <button class="btn-icon-sm" onclick="openEventModal(\'' + ev.id + '\')" title="Editar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>';
        html += '  <button class="btn-icon-sm" onclick="deleteEvent(\'' + ev.id + '\')" title="Excluir"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>';
        html += '</div>';

        html += '</div>';
    });

    list.innerHTML = html;
}



/* =====================
   DOCUMENT MANAGER
   ===================== */
var quillEditor = null;
var cachedDocuments = [];

function initQuill() {
    if (!quillEditor && document.getElementById('quill-editor')) {
        quillEditor = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Comece a digitar seu documento...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
    }
}

function openDocumentModal(type, existingDoc) {
    var modal = document.getElementById('document-form-container');
    if(!modal) return;
    
    modal.style.display = 'block';
    
    document.getElementById('doc-id').value = existingDoc ? existingDoc.id : '';
    document.getElementById('doc-type').value = type;
    document.getElementById('doc-title').value = existingDoc ? existingDoc.title : '';
    document.getElementById('doc-author').value = (existingDoc && existingDoc.author) ? existingDoc.author : '';
    document.getElementById('doc-desc').value = (existingDoc && existingDoc.description) ? existingDoc.description : '';
    
    // Esconder todas as seções
    document.getElementById('doc-text-container').style.display = 'none';
    document.getElementById('doc-link-container').style.display = 'none';
    document.getElementById('doc-upload-container').style.display = 'none';
    
    // Configura texto e UI
    var titleEl = document.getElementById('doc-modal-title');
    
    if (type === 'text') {
        titleEl.textContent = existingDoc ? 'Editar Documento de Texto' : 'Novo Documento de Texto';
        document.getElementById('doc-text-container').style.display = 'block';
        initQuill();
        quillEditor.root.innerHTML = existingDoc && existingDoc.content ? existingDoc.content : '';
    } else if (type === 'link') {
        titleEl.textContent = existingDoc ? 'Editar Link Externo' : 'Adicionar Link Externo';
        document.getElementById('doc-link-container').style.display = 'block';
        document.getElementById('doc-link').value = existingDoc && existingDoc.url ? existingDoc.url : '';
    } else if (type === 'upload') {
        titleEl.textContent = existingDoc ? 'Editar Arquivo (Upload)' : 'Fazer Upload de Arquivo';
        document.getElementById('doc-upload-container').style.display = 'block';
        document.getElementById('doc-file').value = ''; // Sempre vazio para forçar nova seleção
        // Mostra um aviso rápido
        if(existingDoc && existingDoc.url) {
            var label = document.querySelector('#doc-upload-container .admin-label');
            label.innerHTML = 'Selecione um Arquivo <span style="font-size:0.75rem; color:var(--accent-purple); font-weight:normal;">(ou deixe vazio para manter o atual)</span>';
        }
    }
}

function editDocument(id) {
    var doc = cachedDocuments.find(function(d) { return d.id === id; });
    if (doc) {
        openDocumentModal(doc.type, doc);
        // Rolar página para o topo, onde fica o form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function closeDocumentModal() {
    document.getElementById('document-form-container').style.display = 'none';
}

function saveDocument() {
    var idV = document.getElementById('doc-id').value;
    var docId = idV ? idV : null;
    var type = document.getElementById('doc-type').value;
    var title = document.getElementById('doc-title').value.trim();
    var author = document.getElementById('doc-author').value.trim();
    var desc = document.getElementById('doc-desc').value.trim();
    
    if (!title) {
        showToast('O título do documento é obrigatório!', 'error');
        return;
    }
    
    var docData = {
        title: title,
        type: type,
        author: author,
        description: desc
    };
    
    // Extrai o conteúdo baseado no tipo
    if (type === 'text') {
        if (!quillEditor) return;
        var htmlContent = quillEditor.root.innerHTML;
        if (quillEditor.getText().trim().length === 0) {
            showToast('O documento está vazio.', 'error');
            return;
        }
        docData.content = htmlContent;
        processSaveDoc(docId, docData);
        
    } else if (type === 'link') {
        var link = document.getElementById('doc-link').value.trim();
        if (!link) {
            showToast('Forneça um link válido.', 'error');
            return;
        }
        docData.url = link;
        processSaveDoc(docId, docData);
        
    } else if (type === 'upload') {
        var fileInput = document.getElementById('doc-file');
        
        if (fileInput.files.length === 0) {
            // Se for editando e não selecionou novo arquivo, mantemos as URLs antigas se existirem
            if (docId) {
                var oldDoc = cachedDocuments.find(function(d){ return d.id === docId; });
                if(oldDoc && oldDoc.url) {
                    processSaveDoc(docId, docData);
                    return;
                }
            }
            showToast('Selecione um arquivo para upload.', 'error');
            return;
        }
        
        var file = fileInput.files[0];
        showToast('Fazendo upload...', 'success');
        
        dbOperations.uploadDocumentFile(file).then(function(url) {
            docData.url = url;
            docData.fileName = file.name;
            processSaveDoc(docId, docData);
        }).catch(function(err) {
            console.error("Upload error:", err);
            showToast('Erro no upload: Configure as regras do Firebase Storage.', 'error');
        });
    }
}

function processSaveDoc(id, docData) {
    dbOperations.saveDocumentAdmin(id, docData).then(function() {
        showToast('Documento salvo!', 'success');
        closeDocumentModal();
        loadDocuments();
    }).catch(function(err) {
        console.error(err);
        showToast('Erro ao salvar documento.', 'error');
    });
}

function loadDocuments() {
    var list = document.getElementById('documents-list');
    if (!list) return;

    list.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Carregando documentos...</div>';

    dbOperations.getAllDocumentsAdmin().then(function(docs) {
        cachedDocuments = docs;
        renderDocuments();
    }).catch(function(err) {
        console.error('Erro ao buscar documentos:', err);
        list.innerHTML = '<div style="text-align: center; color: var(--red-500);">Erro ao carregar documentos.</div>';
    });
}

function renderDocuments() {
    var list = document.getElementById('documents-list');
    if (!list) return;

    if (cachedDocuments.length === 0) {
        list.innerHTML = 
            '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">' +
            '<p style="font-weight: 600; font-size: 1.1rem; color: #fff;">Nenhum documento encontrado.</p>' +
            '<p style="font-size: 0.9rem;">Crie ou faça upload de documentos no menu acima.</p>' +
            '</div>';
        return;
    }

    var html = '';
    cachedDocuments.forEach(function(doc) {
        // Tenta formatar a data (lembrando que createdAt pode ser obj do firestore)
        var dateStr = '';
        if (doc.createdAt && doc.createdAt.toDate) {
            dateStr = doc.createdAt.toDate().toLocaleDateString('pt-BR');
        } else if (doc.createdAt) {
            dateStr = 'Recente';
        }

        html += '<div class="question-card" style="display: flex; flex-direction: column; gap: 15px;">';
        
        // Cabeçalho do Card
        html += '<div style="display: flex; justify-content: space-between; align-items: flex-start;">';
        
        html += '<div style="flex: 1;">';
        
        var iconStr = '';
        var typeName = '';
        var badgeColor = '';
        
        if (doc.type === 'text') {
            typeName = 'Documento de Texto';
            badgeColor = 'var(--accent-purple)';
            iconStr = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
        } else if (doc.type === 'link') {
            typeName = 'Planilha / Link';
            badgeColor = '#2563eb';
            iconStr = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
        } else if (doc.type === 'upload') {
            typeName = 'Arquivo ' + (doc.fileName ? (' (' + doc.fileName.split('.').pop().toUpperCase() + ')') : '');
            badgeColor = 'var(--color-success)';
            iconStr = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>';
        }

        // Tag superior e Data
        html += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">';
        html += '<span style="font-size: 0.7rem; font-weight: 700; background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 4px; color: ' + badgeColor + '; display: flex; align-items: center; gap: 4px;">' + iconStr + typeName + '</span>';
        if(dateStr) html += '<span style="font-size: 0.75rem; color: var(--text-muted);">' + dateStr + '</span>';
        html += '</div>';

        // Titulo e Descrição
        html += '<h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0 0 6px 0; letter-spacing: -0.5px;">' + escapeHTML(doc.title) + '</h3>';
        
        if (doc.author) {
            html += '<p style="font-size: 0.8rem; color: var(--accent-purple); font-weight: 600; margin: 0 0 10px 0; display:flex; align-items:center; gap: 4px;">';
            html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
            html += escapeHTML(doc.author) + '</p>';
        }
        
        if (doc.description) {
            html += '<p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 15px 0; line-height: 1.4;">' + escapeHTML(doc.description) + '</p>';
        } else {
            html += '<p style="margin-bottom: 15px;"></p>';
        }

        // Link de Ação
        if (doc.type === 'link' || doc.type === 'upload') {
            html += '  <a href="' + escapeHTML(doc.url) + '" target="_blank" style="font-size: 0.85rem; font-weight: 600; color: var(--slate-900); background: #fff; padding: 6px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">Abrir Documento <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>';
        } else {
            html += '  <span style="font-size: 0.8rem; color: var(--slate-500); border: 1px solid var(--slate-700); padding: 5px 10px; border-radius: 6px;">Uso Interno Administrativo</span>';
        }
        
        html += '</div>';

        // Botões de Ação Direita
        html += '<div style="display: flex; gap: 8px; flex-shrink: 0;">';
        html += '  <button class="btn-icon-sm" onclick="editDocument(\'' + doc.id + '\')" title="Editar Arquivo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>';
        html += '  <button class="btn-icon-sm" onclick="deleteDocument(\'' + doc.id + '\')" title="Excluir Definitivamente"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>';
        html += '</div>';
        
        html += '</div>'; // Fecha row topo
        html += '</div>'; // Fecha question-card
    });

    list.innerHTML = html;
}

function deleteDocument(id) {
    if(!confirm("Atenção: Excluir este documento é uma ação irreversível. Tem certeza?")) return;
    
    dbOperations.deleteDocumentAdmin(id).then(function() {
        showToast('Documento removido.', 'success');
        loadDocuments();
    }).catch(function(err) {
        showToast('Erro ao remover documento.', 'error');
        console.error(err);
    });
}

