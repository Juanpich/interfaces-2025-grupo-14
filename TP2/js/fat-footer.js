document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const feedback = document.querySelector('.send-feedback');
    const box = document.querySelector('.newsletter-box');

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Mostrar mensaje
        feedback.classList.add('active');
        box.classList.add('sent');

        // Ocultar mensaje y volver a la normalidad después de 2s
        setTimeout(() => {
            feedback.classList.remove('active');
            box.classList.remove('sent');
        }, 2000);

    });
});
