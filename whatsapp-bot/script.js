const API_BASE = "https://teu-site.vercel.app/api";

async function pedirCodigo() {
    const numero = document.getElementById('numero').value;
    if (!numero) return alert("Digite seu número!");

    const res = await fetch(`${API_BASE}/login-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero })
    });
    const data = await res.json();
    alert(data.message);
}

async function verificarCodigo() {
    const numero = document.getElementById('numero').value;
    const codigo = document.getElementById('codigo').value;
    if (!numero || !codigo) return alert("Digite o número e o código!");

    const res = await fetch(`${API_BASE}/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero, codigo })
    });
    const data = await res.json();

    if (data.token) {
        localStorage.setItem('token', data.token);
        alert("Login confirmado!");
        mostrarPainel();
    } else {
        alert(data.error);
    }
}

async function mostrarPainel() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('painel-loja').classList.remove('hidden');

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/loja`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const loja = await res.json();

    if (loja.error) {
        alert(loja.error);
        return;
    }

    const dadosDiv = document.getElementById('dados-loja');
    dadosDiv.innerHTML = `<p><strong>Loja:</strong> ${loja.lojaId}</p>
                          <p><strong>Dono:</strong> ${loja.numeroDono}</p>`;

    const produtosUl = document.getElementById('produtos-list');
    produtosUl.innerHTML = '';
    if (loja.produtos && loja.produtos.length > 0) {
        loja.produtos.forEach(p => {
            produtosUl.innerHTML += `<li>
                <strong>${p.nome}</strong><br>
                ${p.descricao || 'Sem descrição'}<br>
                R$ ${p.preco.toFixed(2).replace('.', ',')}
            </li>`;
        });
    } else {
        produtosUl.innerHTML = '<li>Nenhum produto cadastrado.</li>';
    }
}

// Se o token já existir no localStorage, mostra o painel direto
if (localStorage.getItem('token')) {
    mostrarPainel();
}
