console.log("App JS cargado");
const canvas = document.getElementById("myCanvas-2");//canva principal
const ctx = canvas.getContext("2d");
const btn_comenzar = document.getElementById("btn_comenzar");//btn de comenzar 
let section_finished_level = document.querySelector(".finished-level");//seccion de nivel terminado
let iconos_level = document.querySelectorAll(".op-icono");//icocno de ayuda y de como jugar
let flotante_ayuda = document.querySelector(".help");//seccion de ayuda
let flotante_instrucciones = document.querySelector(".instructions");//seccion de instrucciones
let opciones_level = document.querySelectorAll(".op-cuadrantes");//opciones de niveles
let btn_acceot_ayudin = document.querySelector(".btn-accept");//boton de aceptar la ayuda

let numCols = 2;
let numRows = 2;
let rects = [];
let rectW, rectH;

let ImagenHTML5 = null;
let canvasBW = null;
let imgAleatoria = null

//manejo de seleccion de nivel
opciones_level.forEach(opcion => {
  opcion.addEventListener("click", () => {
    // Remover la clase de todos los elementos
    opciones_level.forEach(o => o.classList.remove("level-active"));

    // Agregar la clase al elemento clickeado
    opcion.classList.add("level-active");
  });
});


iconos_level.forEach(icon => {
  icon.addEventListener("click", () => {
    iconos_level.forEach(o => o.classList.remove("op-active"));
    icon.classList.add("op-active");

    if (icon.getAttribute("data-value") === "ayudin") {
      flotante_ayuda.classList.remove("deselected");
      flotante_instrucciones.classList.add("deselected"); // opcional, para ocultar la otra
    } else if (icon.getAttribute("data-value") === "instrucciones") {
      flotante_instrucciones.classList.remove("deselected");
      flotante_ayuda.classList.add("deselected"); // opcional
    }
  });
});

// Seleccionamos todos los íconos de cierre
let cruz_icon_skip = document.querySelectorAll(".cruz-icon-skip");

cruz_icon_skip.forEach(icon => {
  icon.addEventListener("click", () => {
    const value = icon.getAttribute("data-value");
    if (value === "instrucciones") {
      flotante_instrucciones.classList.add("deselected"); // ocultar

    } else if (value === "ayuda") {
      flotante_ayuda.classList.add("deselected"); // ocultar
    }
    iconos_level.forEach(o => o.classList.remove("op-active"));
  });
});

/*Boton de comenzar el juego */
btn_comenzar.addEventListener("click", () => {
  btn_comenzar.classList.add("deselected");
  comenzar();
});


function comenzar() {
   let opcion = document.querySelector(".level-active");
  numCols = parseInt(opcion.getAttribute("data-value"));
  numRows = 2;
  section_finished_level.classList.add("deselected");
  rects = [];
  // Ajustar el ancho del canvas según el número de columnas
  if(numCols === 4){
    canvas.width = 1200;
    console.log("aca 4")

  } else if(numCols === 3){
    canvas.width = 900;

  }else{
    canvas.width = 600;
  }

  // Calcular dimensiones
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
        sy: row
      });
    }
  }

  const imagenesDisponibles = [
    "img-mult-1.jpg",
    "img-mult-2.jpg",
    "img-mult-3.jpg",
    "img-mult-4.jpg",
  ];
  imgAleatoria = imagenesDisponibles[Math.floor(Math.random() * imagenesDisponibles.length)];

  ImagenHTML5 = new Image();
  ImagenHTML5.src = imgAleatoria;

  ImagenHTML5.onload = () => {
    canvasBW = document.createElement('canvas');
    canvasBW.width = ImagenHTML5.width;
    canvasBW.height = ImagenHTML5.height;
    const ctxBW = canvasBW.getContext('2d');
    ctxBW.drawImage(ImagenHTML5, 0, 0);

    const filtros = [setPixelBW, setPixelRed, setPixelB30,setPixelNegative];
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

function dibujarTodo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rects.forEach(r => dibujarImagen(r));
}

function dibujarImagen(r) {
  const sourceW = ImagenHTML5.width / numCols;
  const sourceH = ImagenHTML5.height / numRows;
  const sourceX = r.sx * sourceW;
  const sourceY = r.sy * sourceH;

  ctx.save();
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  ctx.translate(cx, cy);
  ctx.rotate(r.angulo * Math.PI / 180);

  ctx.drawImage(canvasBW, sourceX, sourceY, sourceW, sourceH, -r.w / 2, -r.h / 2, r.w, r.h);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);

  ctx.restore();
}

function rotarAleatoriamenteCuadrantes() {
  rects.forEach(r => {
    const angulosPosibles = [ 90, 180, 270];
    r.angulo = angulosPosibles[Math.floor(Math.random() * angulosPosibles.length)];
  });
}

// Bloquear menú contextual
canvas.addEventListener("contextmenu", e => e.preventDefault());

// Click para rotar
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const target = rects.find(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  if (!target) return;

  if (e.button === 0) target.angulo = (target.angulo - 90 + 360) % 360;
  else if (e.button === 2) target.angulo = (target.angulo + 90) % 360;

  dibujarTodo();

  if (rects.every(r => r.angulo === 0)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ImagenHTML5 = new Image();
    ImagenHTML5.src = imgAleatoria;
    ImagenHTML5.onload = () => {
      ctx.drawImage(ImagenHTML5, 0, 0, canvas.width, canvas.height);
    };
    section_finished_level.classList.remove("deselected");
    rects = [];
  }
});





/*Siguiente nivel*/
let btn_next_level = document.querySelector("#btn_next_level");
btn_next_level.addEventListener("click", () => {
  //sumar el nivel y ajustar numCols
  comenzar();
});























/* Filtros */
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