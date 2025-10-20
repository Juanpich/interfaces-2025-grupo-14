console.log("App JS cargado");

const canvas = document.getElementById("myCanvas-2");
const ctx = canvas.getContext("2d");
const btn_comenzar = document.getElementById("btn_comenzar");
let section_finished_level = document.querySelector(".finished-level");
let iconos_level = document.querySelectorAll(".op-icono");
let flotante_ayuda = document.querySelector(".help");
let flotante_instrucciones = document.querySelector(".instructions");
let opciones_level = document.querySelectorAll(".op-cuadrantes");
let btn_acceot_ayudin = document.querySelector(".btn-accept");
const select_cols = document.getElementById("select_levels");
const timeHTML = document.getElementById("time");
const recordHTML = document.getElementById("record");
const messageHTML = document.getElementById("message");
const modeSelect = document.getElementById("mode");
let icon_ayudin = document.querySelector(".icon-ayudin");

let gameMode = "countup";
let countdownStart = 10;
let numCols = 2;
let numRows = 2;
let rects = [];
let rectW, rectH;

let time = 0;
let interval = null;
let record = null;
let state = "start";
let level = 1;

let ImagenHTML5 = null;
let canvasBW = null;
let imgAleatoria = null;

const imagenesDisponibles = [
    "img-mult-1.jpg",
    "img-mult-2.jpg",
    "img-mult-3.jpg",
    "img-mult-4.jpg"
  ];
// ============================
// Selección de nivel
// ============================
opciones_level.forEach(opcion => {
  opcion.addEventListener("click", () => {
    opciones_level.forEach(o => o.classList.remove("level-active"));
    opcion.classList.add("level-active");
  });
});

// ============================
// Íconos de ayuda/instrucciones
// ============================
iconos_level.forEach(icon => {
  icon.addEventListener("click", () => {
    iconos_level.forEach(o => o.classList.remove("op-active"));
    icon.classList.add("op-active");

    if (icon.getAttribute("data-value") === "ayudin") {
      flotante_ayuda.classList.remove("deselected");
      flotante_instrucciones.classList.add("deselected");
    } else if (icon.getAttribute("data-value") === "instrucciones") {
      flotante_instrucciones.classList.remove("deselected");
      flotante_ayuda.classList.add("deselected");
    }
  });
});

// ============================
// Cerrar ventanas flotantes
// ============================
document.querySelectorAll(".cruz-icon-skip").forEach(icon => {
  icon.addEventListener("click", () => {
    const value = icon.getAttribute("data-value");
    if (value === "instrucciones") {
      flotante_instrucciones.classList.add("deselected");
    } else if (value === "ayuda") {
      flotante_ayuda.classList.add("deselected");
    }
    iconos_level.forEach(o => o.classList.remove("op-active"));
  });
});
// ============================
// Botón de comenzar
// ============================
btn_comenzar.addEventListener("click", () => {
  btn_comenzar.classList.add("deselected");
  // numCols = parseInt(select_cols.value);
  numRows = 2;
  gameMode = modeSelect.value;
  selectionRoulette();
});

// ============================
// Botón de aceptar
// ============================
let btn_accept = document.getElementById("btn-accept");
btn_accept.addEventListener("click", () => {
  // Funcion que fija un cuadrante
  flotante_ayuda.classList.add("deselected");
  icon_ayudin.classList.remove("op-active");
  fijarCuadranteAlAzar();
});

// ============================
// Fijar un cuadrante en "Ayuda"
// ============================
function fijarCuadranteAlAzar(){
// Filtrar los cuadrantes que aún no están fijados
  const noFijados = rects.filter(q => !q.fijado);
  console.log(noFijados);
  // // Si no queda ninguno, salir
  if (noFijados.length === 0)return;

  // // Elegir uno al azar
  const cuadrante = noFijados[Math.floor(Math.random() * noFijados.length)];
  console.log(cuadrante);
  // // Fijarlo
  fijarCuadrante(cuadrante);
}

function fijarCuadrante(r) {
  r.angulo = 0;       // posición correcta
  r.fijado = true;    // marcar como fijo
  dibujarTodo();      // redibujar todo
}

// ===========================
// Función de selección tipo “ruleta”
// ===========================
function selectionRoulette() {
  const modeSelectGame = document.getElementById("gameMode");
  modeSelectGame.style.display = "none";

  const canvasRoulette = document.getElementById("canvas-ruleta");
  const ctxRoulette = canvasRoulette.getContext("2d");
  canvasRoulette.style.display = "block";

  const thumbnails = imagenesDisponibles.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  const tamaño = 200;
  const padding = 40;
  let indice = 0;
  let seleccionado = -1;
  let animacionActiva = true;

  let cargadas = 0;
  thumbnails.forEach(img => {
    img.onload = () => {
      cargadas++;
      if (cargadas === thumbnails.length) {
        dibujarMiniaturas();
        iniciarAnimacion();
      }
    };
  });

  function dibujarMiniaturas() {
    ctxRoulette.clearRect(0, 0, canvasRoulette.width, canvasRoulette.height);
    const cols = 3;
    thumbnails.forEach((img, i) => {
      const x = padding + (i % cols) * (tamaño + padding);
      const y = padding + Math.floor(i / cols) * (tamaño + padding);
      ctxRoulette.drawImage(img, x, y, tamaño, tamaño);

      // Resalta el seleccionado actual
      if (i === indice && animacionActiva) {
        ctxRoulette.strokeStyle = "cyan";
        ctxRoulette.lineWidth = 5;
        ctxRoulette.strokeRect(x - 5, y - 5, tamaño + 10, tamaño + 10);
      }
    });
  }

  function iniciarAnimacion() {
    let velocidad = 150;
    const intervalo = setInterval(() => {
      dibujarMiniaturas();
      indice = (indice + 1) % thumbnails.length;
    }, velocidad);

    // Desacelera progresivamente y se detiene en una imagen al azar
    setTimeout(() => {
      clearInterval(intervalo);
      animacionActiva = false;
      seleccionado = Math.floor(Math.random() * thumbnails.length);
      indice = seleccionado;
      dibujarMiniaturas();
      animarSeleccion(seleccionado);
    }, 3000);
  }

  function animarSeleccion(idx) {
    const img = thumbnails[idx];
    ctxRoulette.clearRect(0, 0, canvasRoulette.width, canvasRoulette.height);
    const tamañoFinal = tamaño * 1.6;
    const x = canvasRoulette.width / 2 - tamañoFinal / 2;
    const y = canvasRoulette.height / 2 - tamañoFinal / 2;

    // Pequeña animación de "zoom" visual
    canvasRoulette.classList.add("zoom");

    setTimeout(() => {
      ctxRoulette.clearRect(0, 0, canvasRoulette.width, canvasRoulette.height);
      ctxRoulette.drawImage(img, x, y, tamañoFinal, tamañoFinal);

      setTimeout(() => {
        canvasRoulette.classList.remove("zoom");
        canvasRoulette.style.display = "none";
        imgAleatoria = imagenesDisponibles[idx];
        startGame(imgAleatoria);
      }, 800);
    }, 300);
  }
}

// ============================
// Función principal del juego
// ============================
function startGame(imgAleatoria) {
  // aparece lo niveles y los tiempos
  document.getElementById("game-ui").style.display="flex";
  canvas.style.display = "block";
  let opcion = document.querySelector(".level-active");
  numCols = parseInt(opcion.getAttribute("data-value")) || numCols;
  numRows = 2;
  section_finished_level.classList.add("deselected");
  rects = [];

  // Ajustar tamaño del canvas
  switch (numCols) {
    case 4:
      canvas.width = 1200;
      break;
    case 3:
      canvas.width = 900;
      break;
    default:
      canvas.width = 600;
  }

  clearInterval(interval);
  state = "playing";

  // Reiniciar valores visuales
  messageHTML.textContent = "";
  recordHTML.textContent = record !== null ? record : "-";

  // ============================
  // MODO DE TIEMPO
  // ============================
  if (gameMode === "countup") {
    time = 0;
    interval = setInterval(() => {
      time++;
      timeHTML.textContent = time;
    }, 1000);
  } else if (gameMode === "countdown") {
    time = countdownStart;
    timeHTML.textContent = time;
    interval = setInterval(() => {
      time--;
      timeHTML.textContent = time;
      if (time <= 0) {
        clearInterval(interval);
        finishGame();
      }
    }, 1000);
  }

  // ============================
  // Calcular cuadrantes
  // ============================
  rectW = canvas.width / numCols;
  rectH = canvas.height / numRows;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      rects.push({
        x: col * rectW,
        y: row * rectH,
        w: rectW,
        h: rectH,
        angulo: 0,
        sx: col,
        sy: row,
        fijado: false
      });
    }
  }

  // ============================
  // Imagen aleatoria + filtro
  // ============================
  //imgAleatoria = imagenesDisponibles[Math.floor(Math.random() * imagenesDisponibles.length)];

  ImagenHTML5 = new Image();
  ImagenHTML5.src = imgAleatoria;

  ImagenHTML5.onload = () => {
    canvasBW = document.createElement('canvas');
    canvasBW.width = ImagenHTML5.width;
    canvasBW.height = ImagenHTML5.height;
    const ctxBW = canvasBW.getContext('2d');
    ctxBW.drawImage(ImagenHTML5, 0, 0);

    const filtros = [setPixelBW, setPixelRed, setPixelB30, setPixelNegative];
    const filtroGlobal = filtros[Math.floor(Math.random() * filtros.length)];

    const imgData = ctxBW.getImageData(0, 0, canvasBW.width, canvasBW.height);
    for (let y = 0; y < imgData.height; y++) {
      for (let x = 0; x < imgData.width; x++) {
        filtroGlobal(imgData, x, y);
      }
    }
    ctxBW.putImageData(imgData, 0, 0);

    rotarAleatoriamenteCuadrantes();
    dibujarTodo();
  };
}

// ============================
// Dibujo y rotación
// ============================
function dibujarTodo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rects.forEach(r => dibujarImagen(r));
}

function dibujarImagen(r) {
  // Calcula qué parte de la imagen original corresponde al cuadrante
  const sourceW = ImagenHTML5.width / numCols;
  const sourceH = ImagenHTML5.height / numRows;
  const sourceX = r.sx * sourceW;
  const sourceY = r.sy * sourceH;

  // Guarda el estado actual del contexto:
  ctx.save();

  // Esto permite dibujar la subimagen rotada correctamente sobre su centro.
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  ctx.translate(cx, cy);
  ctx.rotate(r.angulo * Math.PI / 180);

  ctx.drawImage(canvasBW, sourceX, sourceY, sourceW, sourceH, -r.w / 2, -r.h / 2, r.w, r.h);

// Si el cuadrante está fijado → borde azul grueso que cubre los 4 lados
  if (r.fijado) {
    ctx.lineWidth = 8; // más grueso
    ctx.strokeStyle = "#0099FF"; // azul brillante
    ctx.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
  }else{
  // borde rojo fino si no está fijado
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
  }
  ctx.restore();
}

// ============================
// Ubicar aleatoriamente los cuadrantes
// ============================
function rotarAleatoriamenteCuadrantes() {
  rects.forEach(r => {
    //Rotar aleatoriamente los cuadrantes si el usuario no pidio ayuda
    if (!r.fijado) {
      const angulosPosibles = [90, 180, 270];
      r.angulo = angulosPosibles[Math.floor(Math.random() * angulosPosibles.length)];
    }
  });
}

// ============================
// Eventos del canvas
// ============================
canvas.addEventListener("contextmenu", e => e.preventDefault());

canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Buscar el cuadrante clickeado
  const target = rects.find(r => 
    x >= r.x && x <= r.x + r.w &&
    y >= r.y && y <= r.y + r.h
  );

  if (!target) return;

  // 🔹 Solo rotar si el cuadrante NO está fijado
  if (!target.fijado) {
    if (e.button === 0) target.angulo = (target.angulo - 90 + 360) % 360;
    else if (e.button === 2) target.angulo = (target.angulo + 90) % 360;

    dibujarTodo();

    // Comprobar si todos los cuadrantes están correctamente orientados
    if (rects.every(r => r.angulo === 0)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ImagenHTML5 = new Image();
      ImagenHTML5.src = imgAleatoria;
      ImagenHTML5.onload = () => ctx.drawImage(ImagenHTML5, 0, 0, canvas.width, canvas.height);

      rects = [];
      finishGame();
    }
  }
});


// ============================
// Fin del juego
// ============================
function finishGame() {
  clearInterval(interval);
  state = "finished";

  let texto = "";
  let esVictoria = true;

  if (gameMode === "countup") {
    texto = `🎯 ¡Completaste el Nivel ${level}! Tiempo final: ${time}s.`;
    if (record === null || time < record) {
      record = time;
      texto += ` 🎉 ¡Nuevo récord!`;
    } else {
      texto += ` Tu mejor tiempo sigue siendo ${record}s.`;
    }
  } else if (gameMode === "countdown") {
    if (time <= 0) {
      esVictoria = false;
      texto = `⏳ ¡Se acabó el tiempo en el Nivel ${level}!`;
    } else {
      texto = `🎯 ¡Completaste el Nivel ${level}! Tiempo final: ${time}s.`;
      if (record === null || time > record) {
        record = time;
        texto += ` 🎉 ¡Nuevo récord!`;
      } else {
        texto += ` Tu mejor tiempo sigue siendo ${record}s.`;
      }
    }
  }

  recordHTML.textContent = record !== null ? record : "-";
  showPopup(texto, esVictoria);
}

// ============================
// Popup final
// ============================
function showPopup(message, esVictoria = true) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");
  const btnNext = document.getElementById("popup-restart");
  const btnHome = document.getElementById("popup-home");

  // Cambiar texto y color dependiendo del resultado
  if (esVictoria) {
    popup.classList.remove("lose");
    popupTitle.textContent = "🎉 ¡Nivel Completado!";
    btnNext.textContent = "Siguiente Nivel";
  } else {
    popup.classList.add("lose");
    popupTitle.textContent = "💀 ¡Intento Fallido!";
    btnNext.textContent = "Reintentar";
  }

  popupMessage.textContent = message;
  popup.classList.remove("hidden");

  btnNext.onclick = () => {
    popup.classList.add("hidden");
    canvas.style.display = "none";
    document.getElementById("game-ui").style.display = "none";

    if (esVictoria) {
      level++;
      updateLevel();
      selectionRoulette();
    } else {
      // Reintenta el mismo nivel
      startGame(imgAleatoria);
    }
  };

  btnHome.onclick = () => {
    popup.classList.add("hidden");
    location.reload();
  };
}
function updateLevel() {
  const levelHTML = document.getElementById("level");
  levelHTML.textContent = level;

  const nivelFill = document.getElementById("nivel-fill");
  nivelFill.style.width = (level * 1) + "%";
}

// ============================
// Filtros de imagen
// ============================
function setPixelBW(imageData, x, y) {
  const index = (x + y * imageData.width) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  imageData.data[index] = gray;
  imageData.data[index + 1] = gray;
  imageData.data[index + 2] = gray;
}

function setPixelRed(imageData, x, y) {
  const index = (x + y * imageData.width) * 4;
  imageData.data[index + 1] = 0;
  imageData.data[index + 2] = 0;
  imageData.data[index + 3] = 255;
}

function setPixelB30(imageData, x, y) {
  const index = (x + y * imageData.width) * 4;
  imageData.data[index] = Math.min(255, imageData.data[index] * 1.5);
  imageData.data[index + 1] = Math.min(255, imageData.data[index + 1] * 1.5);
  imageData.data[index + 2] = Math.min(255, imageData.data[index + 2] * 1.5);
}

function setPixelNegative(imageData, x, y) {
  const index = (x + y * imageData.width) * 4;
  imageData.data[index] = 255 - imageData.data[index];
  imageData.data[index + 1] = 255 - imageData.data[index + 1];
  imageData.data[index + 2] = 255 - imageData.data[index + 2];
}
