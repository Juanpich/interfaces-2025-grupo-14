// Espera a que la página y el canvas estén completamente cargados
window.addEventListener('load', () => {
    const canvas = document.getElementById('tablero');
    
    // Inicia la pantalla de carga (muestra instrucciones o botón de inicio)
    new Cargado(canvas);
});