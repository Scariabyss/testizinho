/**
 * Mollab – Inicialização do Firebase
 */

/* / Configurações de acesso ao projeto Firebase (API Keys e IDs) */
var firebaseConfig = {
    apiKey: "AIzaSyD17Erpi-HqUiGZo-nboMqHkDqdKs07rKs",
    authDomain: "mollab-8cc8f.firebaseapp.com",
    projectId: "mollab-8cc8f",
    storageBucket: "mollab-8cc8f.firebasestorage.app",
    messagingSenderId: "114796359037",
    appId: "1:114796359037:web:35d09b288a920b96ae7014"
};

/* / Inicializa o Firebase apenas se ele ainda não estiver ativo */
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

/* / Cria variáveis globais para facilitar o uso da Autenticação e do Firestore em outros arquivos */
var auth = firebase.auth();
var db = firebase.firestore();
