console.log("Tuberías cargadas");

// CONFIGURACIÓN
const gameContainer = document.querySelector(".game-container");
const ANCHO_JUEGO = 360;
const ANCHO_TUBERIA = 75;
const ALTO_TUBERIA = 475;
const DISTANCIA = 140;  // Espacio fijo
const TIEMPO_GENERACION = 2000;
const PIPE_SPEED = 2;

// Crear tuberías
function crearTuberias() {

    // POSICIÓN DEL HUECO (parte superior del GAP)
    const minY = 50;
    const maxY = ANCHO_JUEGO - DISTANCIA - 50;

    const gapTop = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    // TUBERÍA SUPERIOR: top = gapTop - PIPE_HEIGHT
    const pipeTop = document.createElement("div");
    pipeTop.classList.add("tuberia-arriba");
    pipeTop.style.left = "1280px";
    pipeTop.style.top = (gapTop - ALTO_TUBERIA) + "px";

    // TUBERÍA INFERIOR: top = gapTop + GAP
    const pipeBottom = document.createElement("div");
    pipeBottom.classList.add("tuberia-abajo");
    pipeBottom.style.left = "1280px";
    pipeBottom.style.top = (gapTop + DISTANCIA) + "px";

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    moverTuberias(pipeTop, pipeBottom);
}

function moverTuberias(top, bottom) {
    let x = 1280;

    function animar() {
        x -= PIPE_SPEED;
        top.style.left = x + "px";
        bottom.style.left = x + "px";

        if (x < -ANCHO_TUBERIA) {
            top.remove();
            bottom.remove();
            return;
        }

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
}

setInterval(crearTuberias, TIEMPO_GENERACION);
