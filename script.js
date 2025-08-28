const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('results');
document.addEventListener('DOMContentLoaded', function() {
    // Função para rolagem suave
    function scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Navegação por links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Filtro de gênero
    const genreTabs = document.querySelectorAll('.genre-tab');
    if (genreTabs.length > 0) {
        genreTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Remove classe active de todas as tabs
                genreTabs.forEach(t => {
                    t.classList.remove('active');
                });
                
                // Adiciona classe active na tab clicada
                this.classList.add('active');
                
                // Filtra os livros
                document.querySelectorAll('.catalog-book').forEach(book => {
                    if (filter === 'all') {
                        book.style.display = 'flex';
                    } else {
                        book.style.display = book.getAttribute('data-genre') === filter ? 'flex' : 'none';
                    }
                });
            });
        });

        // Ativa a tab inicial
        const activeTab = document.querySelector('.genre-tab.active');
        if (activeTab) {
            activeTab.click();
        }
    }

    // Configuração da busca móvel
    function setupMobileSearch() {
        const searchContainer = document.querySelector('.search-container');
        const searchProfile = document.querySelector('.search-profile');
        
        if (!searchContainer || !searchProfile) return;
        
        // Remove ícone existente se houver
        const existingIcon = document.querySelector('.mobile-search-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        if (window.innerWidth <= 480) {
            const searchIcon = document.createElement('div');
            searchIcon.className = 'icon mobile-search-icon';
            searchIcon.innerHTML = '<i class="fas fa-search"></i>';
            
            searchIcon.addEventListener('click', function() {
                searchContainer.style.display = searchContainer.style.display === 'block' ? 'none' : 'block';
                if (searchContainer.style.display === 'block') {
                    document.querySelector('.search-bar')?.focus();
                }
            });
            
            searchProfile.prepend(searchIcon);
            searchContainer.style.display = 'none';
        } else {
            searchContainer.style.display = 'block';
        }
    }

    // Ajuste do header para mobile
    function adjustHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('nav');
            const logo = document.querySelector('.logo');
            const searchProfile = document.querySelector('.search-profile');
            
            if (nav && logo && searchProfile) {
                header.style.minHeight = (logo.offsetHeight + nav.offsetHeight + searchProfile.offsetHeight + 20) + 'px';
            }
        } else {
            header.style.minHeight = '';
        }
    }

    // Inicialização
    function init() {
        setupMobileSearch();
        adjustHeader();
        
        // Configura botões de scroll
        document.querySelectorAll('button[onclick^="scrollToSection"]').forEach(button => {
            button.addEventListener('click', function() {
                const match = this.getAttribute('onclick').match(/'([^']+)'/);
                if (match && match[1]) {
                    scrollToSection(match[1]);
                }
            });
        });
    }

    // Evento de resize com debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            setupMobileSearch();
            adjustHeader();
        }, 250);
    });

    // Inicia o script
    init();
});

// Base de dados de livros
const books = [
    { title: "O pequeno príncipe", author: "Antoine de Saint-Exupéry", available: true },
    { title: "Extraordinário", author: "R.J Palacio", available: true },
    { title: "Biblioteca da meia-noite", author: "Matt Haig", available: false },
    { title: "A menina que roubava livros", author: "Markus Zusak", available: true },
    { title: "Bilneiro sobre os traseiros", author: "INVERNO DE 1999", available: false }
];

// Funções gerais
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Filtro de gênero
document.querySelectorAll('.genre-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Ativa/desativa tabs
        document.querySelectorAll('.genre-tab').forEach(t => {
            t.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filtra os livros
        document.querySelectorAll('.catalog-book').forEach(book => {
            book.style.display = (filter === 'all' || book.getAttribute('data-genre') === filter) 
                ? 'flex' 
                : 'none';
        });
    });
});

function searchBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    resultsDiv.innerHTML = '';
    
    if (!searchTerm.trim()) {
        resultsDiv.innerHTML = '<p>Por favor, digite algo para pesquisar.</p>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    
    if (filteredBooks.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum livro encontrado. Tente outro termo.</p>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    filteredBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-result';
        bookElement.innerHTML = `
            <div class="book-result-title">${book.title}</div>
            <div class="book-result-author">${book.author}</div>
            <div class="${book.available ? 'available' : 'unavailable'}">
                ${book.available ? 'Disponível' : 'Indisponível'}
            </div>
        `;
        resultsDiv.appendChild(bookElement);
    });
    
    resultsDiv.style.display = 'block';
}


// Fecha resultados ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        resultsDiv.style.display = 'none';
    }
});

// Inicializa filtro ativo
document.querySelector('.genre-tab.active')?.click();

// Event listeners
searchButton.addEventListener('click', searchBooks);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});

// =======================================================
// LÓGICA DE LOGIN E CADASTRO
// =======================================================

// Funções para Modais
const modalLogin = document.getElementById('modal-login');
const modalCadastro = document.getElementById('modal-cadastro');

function abrirModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

// Eventos para abrir e fechar os modais
document.getElementById('abrir-login-popup')?.addEventListener('click', () => abrirModal(modalLogin));
document.getElementById('abrir-cadastro')?.addEventListener('click', () => { fecharModal(modalLogin); abrirModal(modalCadastro); });
document.getElementById('abrir-login')?.addEventListener('click', () => { fecharModal(modalCadastro); abrirModal(modalLogin); });

document.querySelectorAll('.fechar').forEach(btn => {
    btn.addEventListener('click', (e) => fecharModal(e.target.closest('.modal-container')));
});

// Fecha ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === modalLogin) { fecharModal(modalLogin); }
    if (event.target === modalCadastro) { fecharModal(modalCadastro); }
});

// Função para mostrar/esconder senha
function togglePassword(id) {
    const input = document.getElementById(id);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

// Lógica de Cadastro
document.getElementById('form-cadastro')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const nomeCompleto = document.getElementById('nome-cadastro').value;
    const rmEscolar = document.getElementById('rm-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const rmExistente = usuarios.find(user => user.rm === rmEscolar);

    if (rmExistente) {
        alert('RM já cadastrado!');
        return;
    }

    usuarios.push({
        rm: rmEscolar,
        nome: nomeCompleto,
        senha: senha
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso! Faça login agora.');
    fecharModal(modalCadastro);
    abrirModal(modalLogin);
});

// Lógica de Login
document.getElementById('form-login')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const rm = document.getElementById('rm-login').value;
    const senha = document.getElementById('senha-login').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(user => user.rm === rm && user.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify({
            logado: true,
            rm: usuarioEncontrado.rm,
            nome: usuarioEncontrado.nome
        }));

        alert('Login realizado com sucesso!');
        fecharModal(modalLogin);
        window.location.reload(); 
    } else {
        alert('RM ou senha incorretos!');
    }
});

// Lógica de Verificação de Login e Logout
function verificarEstadoDeLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const perfilIcon = document.getElementById('abrir-menu-perfil');
    const menuPerfil = document.getElementById('menu-perfil');
    const btnLoginPopup = document.getElementById('abrir-login-popup');
    
    if (usuarioLogado && usuarioLogado.logado) {
        if (perfilIcon) perfilIcon.style.display = 'block';
        if (btnLoginPopup) btnLoginPopup.style.display = 'none';
        
        if (document.getElementById('nome-usuario')) {
            document.getElementById('nome-usuario').textContent = `Olá, ${usuarioLogado.nome}`;
        }
        if (document.getElementById('rm-logado-display')) {
            document.getElementById('rm-logado-display').textContent = usuarioLogado.rm;
        }
        
    } else {
        if (perfilIcon) perfilIcon.style.display = 'none';
        if (menuPerfil) menuPerfil.style.display = 'none';
        if (btnLoginPopup) btnLoginPopup.style.display = 'block';
    }
}

// Evento de clique para mostrar/esconder o menu de perfil
document.getElementById('abrir-menu-perfil')?.addEventListener('click', function(event) {
    event.preventDefault();
    const menuPerfil = document.getElementById('menu-perfil');
    if (menuPerfil) {
        if (menuPerfil.style.display === 'block') {
            menuPerfil.style.display = 'none';
        } else {
            menuPerfil.style.display = 'block';
        }
    }
});

// Evento de clique no botão de logout
document.getElementById('btn-logout')?.addEventListener('click', function() {
    localStorage.removeItem('usuarioLogado');
    alert('Você foi desconectado.');
    window.location.reload();
});

// Chama a função ao carregar a página
window.addEventListener('load', verificarEstadoDeLogin);

  (function(d){
    var s = d.createElement("script");
    s.setAttribute("data-account", "INSIRA_SEU_CÓDIGO_USERWAY_AQUI"); //exemplo para aplicações maiores
    s.setAttribute("src", "https://cdn.userway.org/widget.js");
    (d.body || d.head).appendChild(s);
    })(document);
