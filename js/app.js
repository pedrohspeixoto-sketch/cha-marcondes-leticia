// app.js — Lógica principal do site

let presentesCache = null;

document.addEventListener('DOMContentLoaded', () => {
  carregarPresentes();
  setupModal();
});

// --- Carregar e renderizar presentes ---

async function carregarPresentes() {
  try {
    const resp = await fetch('data/presentes.json');
    presentesCache = await resp.json();
    renderizarGrid(presentesCache);
  } catch (err) {
    console.error('Erro ao carregar presentes:', err);
    document.getElementById('grid-presentes').innerHTML =
      '<p style="text-align:center;color:#999;">Erro ao carregar presentes.</p>';
  }
}

function renderizarGrid(presentes) {
  const grid = document.getElementById('grid-presentes');
  grid.innerHTML = presentes.map(p => `
    <div class="card" data-id="${p.id}" onclick="abrirModal(${p.id})">
      <img src="${p.foto}" alt="${p.nome}" loading="lazy">
      <div class="card-info">
        <h3>${p.nome}</h3>
        <span class="valor">R$ ${formatarValor(p.valor)}</span>
      </div>
    </div>
  `).join('');
}

// --- Modal ---

function setupModal() {
  const modal = document.getElementById('modal');
  const closeBtn = modal.querySelector('.modal-close');

  closeBtn.addEventListener('click', fecharModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });
}

function abrirModal(id) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  const p = presentesCache.find(item => item.id === id);
  if (!p) return;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Etapa 1: Detalhes do presente
  mostrarDetalhes(p, body);
}

function fecharModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// --- Etapa 1: Detalhes do presente ---

function mostrarDetalhes(presente, container) {
  container.innerHTML = `
    <img src="${presente.foto}" alt="${presente.nome}" class="modal-img">
    <h2 class="modal-titulo">${presente.nome}</h2>
    <p class="modal-valor">R$ ${formatarValor(presente.valor)}</p>
    <button class="btn-presentear" onclick="mostrarFormulario(${presente.id})">
      Presentear
    </button>
  `;
}

// --- Etapa 2: Formulário nome + mensagem ---

function mostrarFormulario(id) {
  const body = document.getElementById('modal-body');
  const p = presentesCache.find(item => item.id === id);
  if (!p) return;

  body.innerHTML = `
    <h2 class="modal-titulo">${p.nome}</h2>
    <p class="modal-valor">R$ ${formatarValor(p.valor)}</p>
    <hr style="margin:1rem 0;border:none;border-top:1px solid #eee;">

    <div class="form-group">
      <label for="nome-convidado">Seu nome <span class="opcional">(opcional)</span></label>
      <input type="text" id="nome-convidado" placeholder="Como você quer ser identificado(a)?">
    </div>

    <div class="form-group">
      <label for="mensagem">Mensagem para o casal</label>
      <textarea id="mensagem" placeholder="Escreva uma mensagem carinhosa..." maxlength="500" rows="3"></textarea>
      <span class="char-count"><span id="char-atual">0</span>/500</span>
    </div>

    <button class="btn-presentear" onclick="mostrarPix(${p.id})">
      Gerar PIX
    </button>
    <button class="btn-voltar" onclick="abrirModal(${p.id})">
      Voltar
    </button>
  `;

  // Contador de caracteres
  const textarea = document.getElementById('mensagem');
  const contador = document.getElementById('char-atual');
  textarea.addEventListener('input', () => {
    contador.textContent = textarea.value.length;
  });
}

// --- Etapa 3: QR Code PIX ---

function mostrarPix(id) {
  const body = document.getElementById('modal-body');
  const p = presentesCache.find(item => item.id === id);
  if (!p) return;

  const nome = document.getElementById('nome-convidado').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  // Gerar payload PIX
  const payload = gerarPayloadPix(
    PIX_CONFIG.chave,
    p.valor,
    PIX_CONFIG.nome,
    PIX_CONFIG.cidade,
    p.nome
  );

  body.innerHTML = `
    <h2 class="modal-titulo">Escaneie o QR Code</h2>
    <p class="modal-subtitulo">${p.nome} — R$ ${formatarValor(p.valor)}</p>

    <div id="qrcode-container" style="text-align:center;margin:1.5rem 0;"></div>

    <div class="pix-copia-cola">
      <label>PIX Copia e Cola:</label>
      <div class="pix-input-group">
        <input type="text" id="pix-payload" value="${payload}" readonly>
        <button onclick="copiarPix()" id="btn-copiar">Copiar</button>
      </div>
    </div>

    <div class="msg-sucesso hidden" id="msg-salva">
      Mensagem enviada com sucesso!
    </div>

    <button class="btn-voltar" onclick="abrirModal(${p.id})" style="margin-top:1rem;">
      Voltar para presentes
    </button>
  `;

  // Renderizar QR Code
  if (typeof QRCode !== 'undefined') {
    new QRCode(document.getElementById('qrcode-container'), {
      text: payload,
      width: 256,
      height: 256,
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // Salvar mensagem no Firebase (se houver)
  if (mensagem || nome) {
    salvarMensagem({
      presente_id: p.id,
      presente_nome: p.nome,
      nome_convidado: nome,
      mensagem: mensagem,
      valor: p.valor
    }).then(result => {
      if (result.success) {
        const el = document.getElementById('msg-salva');
        if (el) el.classList.remove('hidden');
      }
    }).catch(() => {
      // Silencioso — mensagem é secundária ao pagamento
    });
  }
}

function copiarPix() {
  const input = document.getElementById('pix-payload');
  const btn = document.getElementById('btn-copiar');

  navigator.clipboard.writeText(input.value).then(() => {
    btn.textContent = 'Copiado!';
    btn.style.background = '#4caf50';
    setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.style.background = '';
    }, 2000);
  }).catch(() => {
    // Fallback
    input.select();
    document.execCommand('copy');
    btn.textContent = 'Copiado!';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
  });
}

// --- Utilitários ---

function formatarValor(valor) {
  return valor.toFixed(2).replace('.', ',');
}
