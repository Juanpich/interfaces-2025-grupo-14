// Espera a que la página y el canvas estén completamente cargados

function cargado() {
    console.log("leer canvas")
    const canvas = document.getElementById('tablero');
    // Inicia la pantalla de carga (muestra instrucciones o botón de inicio)
    new Cargado(canvas);
};
cargado()