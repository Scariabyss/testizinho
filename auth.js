/**
 * Mollab – Lógica de Autenticação (Login e Cadastro)
 */

/* =====================
   OBSERVADOR DE LOGIN
   ===================== */
document.addEventListener('DOMContentLoaded', function () {
    /* / Escuta mudanças no estado de autenticação (Login/Logout) */
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            /* / Se logado, atualiza o header com o menu do usuário */
            if (typeof dbOperations !== 'undefined') {
                dbOperations.getUserData(user.uid).then(function(userData) {
                    updateHeaderWithUser(user, userData);
                }).catch(function() {
                    updateHeaderWithUser(user, null);
                });
            } else {
                updateHeaderWithUser(user, null);
            }
        } else {
            /* / Se deslogado, renderiza o ícone de "bonequinho" circular (Visitante) */
            renderGuestIcon();
        }
    });

    /* / Desativa Login com Google se estiver rodando via arquivo local (file://) para evitar erros de redirect */
    if (window.location.protocol === 'file:') {
        var googleBtn = document.querySelector('.btn-google');
        if (googleBtn) {
            googleBtn.style.display = 'none';
        }
    }

});

/* =====================
   FUNÇÕES DE LOGIN / CADASTRO
   ===================== */

/* Lista GLOBAL de emails com acesso de administrador */
var ADMIN_EMAILS = ['mollabquimica@gmail.com', 'dudanicoly1213@gmail.com'];

/* / Faz o login com Email e Senha */
function handleLogin(e) {
    e.preventDefault();

    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var submitBtn = document.querySelector('.btn-submit');

    if (!email || !password) return;

    /* / Altera o botão para o estado de carregamento */
    var originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Entrando...';
    submitBtn.disabled = true;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;
            /* / Salva o usuário no Firestore (cria ou atualiza) */
            if (typeof dbOperations !== 'undefined') {
                dbOperations.saveUser(user);
            }

            if (currentLoginAuthType === 'admin') {
                /* / Verifica direto pelo EMAIL, sem depender do Firestore */
                if (ADMIN_EMAILS.includes(user.email)) {
                    /* / Garante que o role no Firestore fique 'admin' */
                    db.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true });
                    window.location.href = 'admin.html';
                } else {
                    firebase.auth().signOut().then(function() {
                        alert("Acesso negado: Somente administradores autorizados.");
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
                }
            } else {
                window.location.href = 'home.html';
            }
        })
        .catch(function (error) {
            console.error(error);
            /* / Tratamento de erro: se não achar o usuário, sugere criar conta */
            if (error.code === 'auth/user-not-found') {
                alert("Usuário não encontrado. Clique em 'Criar conta' abaixo para se registrar.");
            } else {
                alert("Erro ao entrar: " + error.message);
            }
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/* / Cria uma nova conta com Email e Senha */
function handleSignup(e) {
    e.preventDefault();

    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var submitBtn = document.querySelector('.btn-submit');

    if (!email || !password) return;

    var originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Criando...';
    submitBtn.disabled = true;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            /* / Cria o documento do usuário no Firestore antes de redirecionar */
            if (typeof dbOperations !== 'undefined') {
                dbOperations.saveUser(userCredential.user).then(function () {
                    alert("Conta criada com sucesso! Bem-vindo(a).");
                    window.location.href = 'home.html';
                });
            } else {
                alert("Conta criada com sucesso! Bem-vindo(a).");
                window.location.href = 'home.html';
            }
        })
        .catch(function (error) {
            console.error(error);
            alert("Erro ao criar conta: " + error.message);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

var isLoginMode = true;
var currentLoginAuthType = 'student';

/* / Alterna as abas entre Aluno e Administrador na tela de Login */
function switchLoginTab(type) {
    if (type === currentLoginAuthType) return;
    
    currentLoginAuthType = type;
    var tabStudent = document.getElementById('tab-student');
    var tabAdmin = document.getElementById('tab-admin');
    var title = document.getElementById('login-title');
    var subtitle = document.getElementById('login-subtitle');
    var googleBtn = document.getElementById('btn-google-login');
    var bottomOptions = document.getElementById('student-bottom-options');
    var btnSubmit = document.querySelector('.btn-submit');
    
    if (!isLoginMode) {
        toggleAuthMode();
    }

    if (type === 'admin') {
        if(tabAdmin) {
            tabAdmin.classList.add('active');
            tabAdmin.style.color = 'var(--primary-color)';
            tabAdmin.style.borderBottom = '2px solid var(--primary-color)';
        }
        if(tabStudent) {
            tabStudent.classList.remove('active');
            tabStudent.style.color = 'var(--text-color)';
            tabStudent.style.borderBottom = 'none';
        }
        
        if(title) title.innerText = 'Área Restrita';
        if(subtitle) subtitle.innerText = 'Entre com suas credenciais de administrador';
        if(btnSubmit) btnSubmit.innerText = 'Entrar como Admin';
        
        if (googleBtn) {
            googleBtn.style.display = 'block';
            googleBtn.textContent = 'Entrar como Admin com Google';
            googleBtn.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
        }
        if (bottomOptions) bottomOptions.style.display = 'none';
    } else {
        if(tabStudent) {
            tabStudent.classList.add('active');
            tabStudent.style.color = 'var(--primary-color)';
            tabStudent.style.borderBottom = '2px solid var(--primary-color)';
        }
        if(tabAdmin) {
            tabAdmin.classList.remove('active');
            tabAdmin.style.color = 'var(--text-color)';
            tabAdmin.style.borderBottom = 'none';
        }
        
        if(title) title.innerText = 'Bem-vindo de volta!';
        if(subtitle) subtitle.innerText = 'Entre com seu email e senha para continuar';
        if(btnSubmit) btnSubmit.innerText = 'Entrar';
        
        if (googleBtn) {
            googleBtn.style.display = 'block';
            googleBtn.textContent = 'Entrar com Google';
            googleBtn.style.background = '';
        }
        if (bottomOptions) bottomOptions.style.display = 'block';
    }
}

/* / Alterna visualmente entre os formulários de Login e Cadastro na página de login (estudar essa parte ) */
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    var title = document.querySelector('.login-form-header h2');
    var subtitle = document.querySelector('.login-form-header p');
    var btn = document.querySelector('.btn-submit');
    var toggleText = document.querySelector('.signup-text');
    var form = document.querySelector('form');

    if (isLoginMode) {
        title.innerText = currentLoginAuthType === 'admin' ? 'Área Restrita' : 'Bem-vindo de volta';
        subtitle.innerText = currentLoginAuthType === 'admin' ? 'Entre com credenciais de admin' : 'Acesse sua conta para continuar seus estudos';
        btn.innerText = 'Entrar';
        toggleText.innerHTML = 'Não tem uma conta? <a href="#" onclick="toggleAuthMode()">Criar conta</a>';
        form.onsubmit = handleLogin;
    } else {
        title.innerText = 'Crie sua conta';
        subtitle.innerText = 'Comece sua jornada química agora!';
        btn.innerText = 'Cadastrar';
        toggleText.innerHTML = 'Já tem uma conta? <a href="#" onclick="toggleAuthMode()">Fazer login</a>';
        form.onsubmit = handleSignup;
    }
}

/* / Realiza o login utilizando a conta do Google. Se for aba Admin, verifica o role direto no Firestore. */
function handleGoogleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            var user = result.user;

            /* / Salva o usuário no Firestore (cria ou atualiza) */
            if (typeof dbOperations !== 'undefined') {
                dbOperations.saveUser(user);
            }

            if (currentLoginAuthType === 'admin') {
                /* / Verifica direto pelo EMAIL, sem depender do Firestore */
                if (ADMIN_EMAILS.includes(user.email)) {
                    /* / Garante que o role no Firestore fique 'admin' */
                    db.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true });
                    window.location.href = 'admin.html';
                } else {
                    firebase.auth().signOut().then(function() {
                        alert("Acesso negado: Sua conta Google não tem permissão de administrador.\n\nUID da sua conta: " + user.uid);
                    });
                }
            } else {
                /* / Login normal de aluno */
                window.location.href = 'home.html';
            }
        })
        .catch(function (error) {
            console.error(error);
            alert("Erro no Login Google: " + error.message);
        });
}

/* / Faz o logout do usuário e volta para a página de login */
function handleLogout() {
    firebase.auth().signOut().then(function () {
        window.location.href = 'index.html';
    }).catch(function (error) {
        console.error("Erro ao sair", error);
    });
}

/* =====================
   FUNÇÕES DE UI / VISUAL
   ===================== */

/* / Atualiza o cabeçalho do site para mostrar o menu suspenso do usuário */
function updateHeaderWithUser(user, userData) {
    var loginBtn = document.querySelector('.btn-login');
    if (!loginBtn) return;

    var adminBtn = (userData && userData.role === 'admin')
        ? '<a href="admin.html" class="btn-admin-special" style="display: flex; align-items: center; gap: 6px; color: var(--primary-color); font-weight: 600; text-decoration: none; padding: 8px 12px; border-radius: 8px; background: rgba(139, 92, 246, 0.1); margin-right: 12px; font-size: 0.9rem;" title="Painel Admin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg> Admin</a>'
        : '';
        
    var firstLetter = user.email ? user.email.charAt(0).toUpperCase() : 'U';

    loginBtn.outerHTML = `
        <div style="display: flex; align-items: center;">
            ${adminBtn}
            <div class="user-dropdown" id="user-menu">
                <button class="user-menu-toggle" onclick="toggleUserMenu()" aria-label="Menu do Usuário" style="background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan)); border: none; color: white; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; font-weight: 800; font-size: 1.2rem; box-shadow: 0 0 15px rgba(157, 78, 221, 0.4);">
                    ${firstLetter}
                </button>
                <div class="dropdown-menu" id="user-dropdown">
                    <div class="dropdown-info" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.8rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${user.email}
                    </div>
                    <button class="dropdown-link btn-logout-item" onclick="handleLogout()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                        Sair da Conta
                    </button>
                </div>
            </div>
        </div>
    `;
}

/* / Controla o menu suspenso do usuário */
function toggleUserMenu() {
    var dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

/* / Renderiza o ícone de silhueta (bonequinho) circular para usuários não logados */
function renderGuestIcon() {
    var loginBtn = document.querySelector('.btn-login');
    if (!loginBtn) return;

    loginBtn.outerHTML = `
        <a href="index.html" class="user-menu-toggle guest-avatar" title="Entrar na conta" style="background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); color: var(--text-secondary); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; text-decoration: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
        </a>
    `;
}

/* / Fecha o dropdown do usuário ao clicar em qualquer lugar fora dele */
document.addEventListener('click', function (e) {
    var menu = document.getElementById('user-menu');
    var dropdown = document.getElementById('user-dropdown');
    if (menu && dropdown && !menu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});
