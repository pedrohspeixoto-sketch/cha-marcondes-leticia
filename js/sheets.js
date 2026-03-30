/**
 * sheets.js — Integração com Google Sheets via Apps Script
 *
 * Substitui Firebase — mensagens vão direto pra uma planilha Google.
 * O casal abre a planilha e lê as mensagens, simples assim.
 */

const SHEETS_CONFIG = {
  url: 'https://script.google.com/macros/s/AKfycby-ACSYQJErD-ydVIgDzJ1_oEV3SbV_-IS7XOF2hmO30mxtOw1yoT8RiVV8Z4UnxN1t/exec'
};

/**
 * Salva mensagem na planilha Google Sheets via Apps Script.
 *
 * @param {Object} data
 * @param {number} data.presente_id
 * @param {string} data.presente_nome
 * @param {string} data.nome_convidado
 * @param {string} data.mensagem
 * @param {number} data.valor
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function salvarMensagem(data) {
  try {
    if (SHEETS_CONFIG.url === 'COLE_A_URL_DO_APPS_SCRIPT_AQUI') {
      console.warn('[sheets.js] URL do Apps Script não configurada.');
      return { success: true }; // Não bloqueia o fluxo
    }

    if (typeof data.mensagem !== 'string' || data.mensagem.length > 500) {
      return { success: false, error: 'Mensagem inválida (máximo 500 caracteres).' };
    }

    if (typeof data.nome_convidado === 'string' && data.nome_convidado.length > 100) {
      return { success: false, error: 'Nome inválido (máximo 100 caracteres).' };
    }

    const response = await fetch(SHEETS_CONFIG.url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presente_id: data.presente_id,
        presente_nome: data.presente_nome || '',
        nome_convidado: (data.nome_convidado || '').trim() || 'Anônimo',
        mensagem: (data.mensagem || '').trim(),
        valor: data.valor || 0
      })
    });

    // mode: 'no-cors' não permite ler a resposta, mas o POST funciona
    return { success: true };

  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return { success: false, error: 'Erro ao enviar mensagem. Tente novamente.' };
  }
}
