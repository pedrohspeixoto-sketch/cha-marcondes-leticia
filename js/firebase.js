/**
 * Firebase Firestore integration for Cha de Casa Nova
 *
 * Requires compat scripts loaded in HTML:
 *   <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
 *   <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
 */

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;

/**
 * Initializes Firebase app and Firestore.
 * Safe to call multiple times — only initializes once.
 */
function initFirebase() {
  if (db) return db;

  try {
    const app = firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    console.log("Firebase inicializado com sucesso.");
    return db;
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    throw error;
  }
}

/**
 * Saves a gift message to Firestore collection "mensagens".
 *
 * @param {Object} data
 * @param {string} data.presente_id   - ID of the chosen gift
 * @param {string} data.presente_nome - Display name of the gift
 * @param {string} data.nome_convidado - Guest name
 * @param {string} data.mensagem      - Message text (max 500 chars)
 * @param {number} data.valor         - Gift value
 * @returns {Promise<{success: boolean, error?: string, id?: string}>}
 */
async function salvarMensagem(data) {
  try {
    if (!db) {
      initFirebase();
    }

    // Client-side validation
    if (!data.presente_id) {
      return { success: false, error: "ID do presente e obrigatorio." };
    }
    if (typeof data.mensagem !== "string") {
      return { success: false, error: "Mensagem deve ser um texto." };
    }
    if (data.mensagem.length > 500) {
      return { success: false, error: "Mensagem deve ter no maximo 500 caracteres." };
    }

    const documento = {
      presente_id: String(data.presente_id),
      presente_nome: data.presente_nome || "",
      nome_convidado: (data.nome_convidado || "").trim(),
      mensagem: data.mensagem.trim(),
      valor: Number(data.valor) || 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("mensagens").add(documento);
    console.log("Mensagem salva com ID:", docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);

    let errorMessage = "Erro ao enviar mensagem. Tente novamente.";
    if (error.code === "unavailable" || error.code === "failed-precondition") {
      errorMessage = "Sem conexao com o servidor. Verifique sua internet e tente novamente.";
    } else if (error.code === "permission-denied") {
      errorMessage = "Permissao negada. Contate os noivos.";
    }

    return { success: false, error: errorMessage };
  }
}
