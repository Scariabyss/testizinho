/**
 * Mollab – Lógica de Banco de Dados (Firestore + localStorage)
 */


var DB_COLLECTION_USERS = 'users';
var DB_COLLECTION_QUIZZES = 'quizzes';
var DB_COLLECTION_DOCUMENTS = 'documents';

function saveQuizToLocal(quizId, score, maxScore) {
    var saved = localStorage.getItem('mollab_quizzes');
    var quizzes = {};
    if (saved) {
        quizzes = JSON.parse(saved);
    }

    /* / Atualiza ou adiciona o resultado do quiz específico */
    quizzes[quizId] = {
        score: score,
        maxScore: maxScore,
        date: new Date().toISOString()
    };

    localStorage.setItem('mollab_quizzes', JSON.stringify(quizzes));
}

/* / Recupera o histórico de quizzes salvos no navegador */
function getQuizzesFromLocal() {
    var saved = localStorage.getItem('mollab_quizzes');
    if (saved) {
        return JSON.parse(saved);
    }
    return {};
}

/* / Registra o XP e o Nível do usuário localmente */
function saveXPToLocal(xp, level) {
    localStorage.setItem('mollab_xp', xp);
    localStorage.setItem('mollab_level', level);
}

/* / Busca o XP e Nível do localStorage, retornando valores padrão se não existirem */
function getXPFromLocal() {
    var xp = localStorage.getItem('mollab_xp');
    var level = localStorage.getItem('mollab_level');
    return {
        xp: xp ? parseInt(xp) : 0,
        level: level ? parseInt(level) : 1
    };
}


var dbOperations = {

    /**
     * Inicializa ou sincroniza o perfil do usuário no Firestore.
     * Caso seja o primeiro login, cria um documento com XP zerado.
     */
    saveUser: function (user) {
        var userRef = db.collection(DB_COLLECTION_USERS).doc(user.uid);
        return userRef.get().then(function (doc) {
            if (!doc.exists) {
                var userName = user.displayName || user.email.split('@')[0];
                var photoURL = user.photoURL || "";
                
                var adminEmails = ['mollabquimica@gmail.com', 'dudanicoly1213@gmail.com'];
                var assignedRole = adminEmails.includes(user.email) ? 'admin' : 'student';

                return userRef.set({
                    name: userName,
                    email: user.email,
                    photoURL: photoURL,
                    xp: 0,
                    level: 1,
                    role: assignedRole,
                    joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    quizzes: {}
                });
            } else {
                var data = doc.data();
                var updates = {};

                if (data.xp !== undefined) {
                    saveXPToLocal(data.xp, data.level);
                }
                if (data.quizzes) {
                    localStorage.setItem('mollab_quizzes', JSON.stringify(data.quizzes));
                }

                var adminEmails = ['mollabquimica@gmail.com', 'dudanicoly1213@gmail.com'];
                if (adminEmails.includes(user.email) && data.role !== 'admin') {
                    updates.role = 'admin';
                }

                if (Object.keys(updates).length > 0) {
                    return userRef.update(updates);
                }
            }
        }).catch(function (error) {
            console.error("Erro ao sincronizar usuário:", error);
        });
    },

    /**
     * Recupera todos os dados do usuário.
     * Tenta buscar no Firestore; se falhar (sem internet, por ex), usa o localStorage.
     */
    getUserData: function (uid) {
        return db.collection(DB_COLLECTION_USERS).doc(uid).get().then(function (doc) {
            if (doc.exists) {
                var data = doc.data();
                /* / Mantém o cache local atualizado com os dados mais recentes da nuvem */
                if (data.quizzes) {
                    localStorage.setItem('mollab_quizzes', JSON.stringify(data.quizzes));
                }
                if (data.xp !== undefined) {
                    saveXPToLocal(data.xp, data.level);
                }
                return data;
            }
            return getLocalUserData();
        }).catch(function (error) {
            console.error("Firestore inacessível, usando cache local:", error);
            return getLocalUserData();
        });
    },

    /**
     * Registra o resultado de um quiz, calcula o novo XP e Nível, e salva em ambos os storages.
     */
    saveQuizResult: function (uid, quizId, score, maxScore) {
        var xpEarned = score * 10; /* / Regra: 10 pontos por cada resposta correta */

        /* / Passo 1: Salva localmente de imediato para garantir persistência rápida */
        saveQuizToLocal(quizId, score, maxScore);
        var localData = getXPFromLocal();
        var newXP = localData.xp + xpEarned;
        var newLevel = Math.floor(newXP / 100) + 1;
        saveXPToLocal(newXP, newLevel);

        /* / Passo 2: Tenta atualizar o Firestore para manter a nuvem sincronizada */
        var userRef = db.collection(DB_COLLECTION_USERS).doc(uid);

        return userRef.get().then(function (doc) {
            if (!doc.exists) return xpEarned;

            var data = doc.data();
            var firebaseNewXP = (data.xp || 0) + xpEarned;
            var firebaseNewLevel = Math.floor(firebaseNewXP / 100) + 1;

            var updateData = {
                xp: firebaseNewXP,
                level: firebaseNewLevel
            };

            /* / Grava o histórico detalhado do quiz no campo de mapa 'quizzes' */
            updateData["quizzes." + quizId] = {
                score: score,
                maxScore: maxScore,
                date: new Date().toISOString(),
                xpEarned: xpEarned
            };

            return userRef.update(updateData).then(function () {
                /* / Sincroniza o XP local com o oficial da nuvem após o processamento */
                saveXPToLocal(firebaseNewXP, firebaseNewLevel);
                return xpEarned;
            });
        }).catch(function (error) {
            console.error("Erro ao salvar na nuvem (o progresso local foi mantido):", error);
            return xpEarned;
        });
    },

    /**
     * ADMINISTRADOR: Gerenciamento global de Quizzes 
     */
    getAllQuizzesAdmin: function () {
        return db.collection(DB_COLLECTION_QUIZZES).get().then(function(snapshot) {
            var quizzes = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                quizzes.push(data);
            });
            return quizzes;
        });
    },

    saveQuizDataAdmin: function(quizId, quizData) {
        return db.collection(DB_COLLECTION_QUIZZES).doc(quizId).set(quizData);
    },

    /**
     * ALUNOS/SISTEMA: Carrega o quiz em tempo-real!
     */
    getQuizData: function(quizId) {
        return db.collection(DB_COLLECTION_QUIZZES).doc(quizId).get().then(function(doc) {
            if(doc.exists) {
                return doc.data();
            }
            return null;
        });
    },

    /**
     * ADMINISTRADOR: Gerenciamento de Documentos
     */
    getAllDocumentsAdmin: function() {
        return db.collection(DB_COLLECTION_DOCUMENTS).orderBy('createdAt', 'desc').get().then(function(snapshot) {
            var docs = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                docs.push(data);
            });
            return docs;
        }).catch(function(e) {
            // Caso ocorra erro de index ou createdAt ausente, faz o get simples.
            console.warn("Retornando sem ordenação due to index:", e);
            return db.collection(DB_COLLECTION_DOCUMENTS).get().then(function(snapshot) {
                var docs = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    docs.push(data);
                });
                return docs;
            });
        });
    },

    saveDocumentAdmin: function(docId, docData) {
        if (docId) {
            docData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            return db.collection(DB_COLLECTION_DOCUMENTS).doc(docId).set(docData, { merge: true });
        } else {
            docData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            return db.collection(DB_COLLECTION_DOCUMENTS).add(docData);
        }
    },

    deleteDocumentAdmin: function(docId) {
        return db.collection(DB_COLLECTION_DOCUMENTS).doc(docId).delete();
    },

    uploadDocumentFile: function(file) {
        return new Promise(function(resolve, reject) {
            if (!firebase.storage) {
                reject(new Error("Firebase Storage não está inicializado."));
                return;
            }
            var storageRef = firebase.storage().ref();
            var fileRef = storageRef.child('documents/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_'));
            
            var uploadTask = fileRef.put(file);
            uploadTask.then(function(snapshot) {
                snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    resolve(downloadURL);
                }).catch(reject);
            }).catch(reject);
        });
    }
};

/**
 * Helper para estruturar dados locais no mesmo formato dos dados do Firestore.
 */
function getLocalUserData() {
    var localXP = getXPFromLocal();
    var localQuizzes = getQuizzesFromLocal();

    return {
        xp: localXP.xp,
        level: localXP.level,
        quizzes: localQuizzes
    };
}
