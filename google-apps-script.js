/**
 * Google Apps Script — Cola este código em um projeto do Google Apps Script
 * vinculado à planilha de mensagens do chá de casa nova.
 *
 * INSTRUÇÕES:
 * 1. Crie uma planilha no Google Sheets
 * 2. Vá em Extensões > Apps Script
 * 3. Cole este código no editor
 * 4. Clique em "Implantar" > "Nova implantação"
 * 5. Tipo: "App da Web"
 * 6. Executar como: "Eu" (sua conta)
 * 7. Quem tem acesso: "Qualquer pessoa"
 * 8. Copie a URL gerada e cole em js/sheets.js no SHEETS_CONFIG.url
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Adiciona cabeçalho se planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Presente',
        'Valor (R$)',
        'Nome do Convidado',
        'Mensagem'
      ]);
      // Formata cabeçalho
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    // Adiciona a linha com os dados
    sheet.appendRow([
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      data.presente_nome || '',
      data.valor || '',
      data.nome_convidado || 'Anônimo',
      data.mensagem || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Necessário para CORS funcionar com o site
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
