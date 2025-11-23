document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#formulario-contato form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            showAlert('O serviço está temporariamente indisponível');
        });
    }

    // Chat functionality
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    if (chatButton) {
        chatButton.addEventListener('click', function() {
            chatWindow.classList.toggle('active');
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatWindow.classList.remove('active');
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Adicionar mensagem do usuário
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message';
            userMessage.innerHTML = `<p>${message}</p>`;
            chatBody.appendChild(userMessage);

            // Limpar input
            chatInput.value = '';

            // Resposta automática
            setTimeout(function() {
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-message bot';
                botMessage.innerHTML = '<p>Obrigado pela sua mensagem! Nossa equipe entrará em contato em breve. Para atendimento imediato, ligue (33) 3421-1234.</p>';
                chatBody.appendChild(botMessage);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);

            // Scroll para o final
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
});

function showAlert(message) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    overlay.innerHTML = `
        <div class="custom-alert">
            <p>${message}</p>
            <button onclick="this.closest('.custom-alert-overlay').remove()">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}
