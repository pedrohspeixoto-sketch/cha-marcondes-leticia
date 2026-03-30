/**
 * pix.js — Gerador de PIX QR Code (BRCode / EMV) client-side
 *
 * Implementa a especificacao do Banco Central do Brasil para pagamentos PIX
 * via QR Code estatico. Nenhuma dependencia externa para geracao do payload;
 * usa a lib qrcode.js (CDN) apenas para renderizar o QR Code.
 */

// ---------------------------------------------------------------------------
// Configuracao — altere aqui os dados do casal
// ---------------------------------------------------------------------------
const PIX_CONFIG = {
  chave: 'geniffernataly@gmail.com',
  nome: 'Marcondes e Leticia',
  cidade: 'Recife'
};

// ---------------------------------------------------------------------------
// Helpers EMV
// ---------------------------------------------------------------------------

/**
 * Monta um campo TLV (Tag-Length-Value) do padrao EMV.
 * @param {string} id   - ID do campo (2 digitos)
 * @param {string} valor - Conteudo do campo
 * @returns {string} Campo formatado "IDLLVALOR"
 */
function _emvCampo(id, valor) {
  const len = valor.length.toString().padStart(2, '0');
  return `${id}${len}${valor}`;
}

/**
 * Calcula CRC16-CCITT (polynomial 0x1021) conforme especificacao BRCode.
 * O payload deve terminar com "6304" (ID 63, length 04) antes do checksum.
 * @param {string} payload - Payload completo ate "6304" (sem o checksum)
 * @returns {string} CRC16 em hexadecimal uppercase, 4 caracteres
 */
function _crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Remove acentos e caracteres especiais para compatibilidade com leitores.
 * O padrao EMV aceita apenas ASCII imprimivel.
 * @param {string} str
 * @returns {string}
 */
function _sanitizar(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 .*-]/g, '')
    .trim();
}

// ---------------------------------------------------------------------------
// Funcoes publicas
// ---------------------------------------------------------------------------

/**
 * Gera o payload PIX EMV (BRCode) completo, pronto para QR Code ou copia-e-cola.
 *
 * @param {string} chave     - Chave PIX (CPF, telefone, e-mail ou aleatoria)
 * @param {number} [valor]   - Valor em reais (ex: 150.00). Se omitido, QR aberto.
 * @param {string} nome      - Nome do recebedor (max 25 chars)
 * @param {string} cidade    - Cidade do recebedor (max 15 chars)
 * @param {string} [descricao] - Descricao opcional do pagamento
 * @returns {string} Payload EMV completo com CRC16
 */
function gerarPayloadPix(chave, valor, nome, cidade, descricao) {
  // Merchant Account Information (ID 26)
  let merchantAccount = _emvCampo('00', 'br.gov.bcb.pix');
  merchantAccount += _emvCampo('01', chave);
  if (descricao) {
    merchantAccount += _emvCampo('02', _sanitizar(descricao).substring(0, 40));
  }

  // Additional Data Field Template (ID 62)
  const txid = '***'; // Referencia generica para QR estatico
  const additionalData = _emvCampo('05', txid);

  // Monta payload (sem CRC)
  let payload = '';
  payload += _emvCampo('00', '01');                                         // Payload Format Indicator
  payload += _emvCampo('26', merchantAccount);                              // Merchant Account Information
  payload += _emvCampo('52', '0000');                                       // Merchant Category Code
  payload += _emvCampo('53', '986');                                        // Transaction Currency (BRL)

  if (valor !== undefined && valor !== null && valor > 0) {
    const valorStr = valor.toFixed(2);
    payload += _emvCampo('54', valorStr);                                   // Transaction Amount
  }

  payload += _emvCampo('58', 'BR');                                         // Country Code
  payload += _emvCampo('59', _sanitizar(nome).substring(0, 25));            // Merchant Name
  payload += _emvCampo('60', _sanitizar(cidade).substring(0, 15));          // Merchant City
  payload += _emvCampo('62', additionalData);                               // Additional Data Field

  // CRC16 — o campo 63 tem ID "63", length "04", seguido de 4 hex digits
  payload += '6304';
  payload += _crc16(payload);

  return payload;
}

/**
 * Renderiza um QR Code PIX dentro de um elemento DOM.
 * Requer a biblioteca qrcode.js carregada globalmente (via CDN).
 *
 * @param {string} containerId - ID do elemento DOM que recebera o QR Code
 * @param {string} chave       - Chave PIX
 * @param {number} [valor]     - Valor em reais
 * @param {string} nome        - Nome do recebedor
 * @param {string} cidade      - Cidade do recebedor
 * @param {string} [descricao] - Descricao opcional
 * @returns {string} O payload gerado (util para debug/copia)
 */
function gerarQRCodePix(containerId, chave, valor, nome, cidade, descricao) {
  const payload = gerarPayloadPix(chave, valor, nome, cidade, descricao);

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[pix.js] Elemento #${containerId} nao encontrado.`);
    return payload;
  }

  // Limpa conteudo anterior
  container.innerHTML = '';

  // Verifica se QRCode esta disponivel (lib externa)
  if (typeof QRCode === 'undefined') {
    console.error('[pix.js] Biblioteca QRCode nao encontrada. Inclua qrcode.js via CDN.');
    container.textContent = 'Erro: biblioteca QR Code nao carregada.';
    return payload;
  }

  new QRCode(container, {
    text: payload,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#FFFFFF',
    correctLevel: QRCode.CorrectLevel.M
  });

  return payload;
}

/**
 * Copia o payload PIX (copia-e-cola) para a area de transferencia.
 *
 * @param {string} chave       - Chave PIX
 * @param {number} [valor]     - Valor em reais
 * @param {string} nome        - Nome do recebedor
 * @param {string} cidade      - Cidade do recebedor
 * @param {string} [descricao] - Descricao opcional
 * @returns {Promise<string>} O payload copiado
 */
async function copiarPayloadPix(chave, valor, nome, cidade, descricao) {
  const payload = gerarPayloadPix(chave, valor, nome, cidade, descricao);

  try {
    await navigator.clipboard.writeText(payload);
  } catch (err) {
    // Fallback para navegadores mais antigos
    const textarea = document.createElement('textarea');
    textarea.value = payload;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  return payload;
}
