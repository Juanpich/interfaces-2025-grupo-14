// ============================
// Selección de elementos base
// ============================
const btn_iniciar_juego = document.querySelector("#btn_iniciar_juego");
const article_blocka = document.querySelector(".blocka");

// ============================
// FUNCIÓN PRINCIPAL: Cargar el juego (blocka.html)
// ============================
function cargarBlocka() {
  // Limpia el contenido anterior
  article_blocka.innerHTML = "";

  // Elimina el script anterior si existe
  const oldScript = document.querySelector('script[src="./app.js"]');
  if (oldScript) oldScript.remove();

  // Carga el HTML del juego
  fetch("./blocka.html")
    .then(res => res.text())
    .then(html => {
      article_blocka.innerHTML = html;

      // Esperar a que el HTML esté insertado
      setTimeout(() => {
        const script = document.createElement("script");
        script.src = "./app.js";
        script.defer = true;

        // 🔹 Cuando el script termine de cargar, ejecutamos initBlocka()
        script.onload = () => {
          if (typeof initBlocka === "function") {
            initBlocka();
          } else {
            console.error("initBlocka() no encontrada en app.js");
          }
        };

        document.body.appendChild(script);
      }, 50);
    })
    .catch(err => console.error("Error al cargar blocka:", err));
}
// ============================
// FUNCIÓN: Recargar solo el juego
// ============================
function recargarBlocka() {
  cargarBlocka();
}

// Hacer accesible la función para el HTML interno (blocka.html)
window.recargarBlocka = recargarBlocka;

// ============================
// EVENTO: Iniciar el juego
// ============================
btn_iniciar_juego.addEventListener("click", () => {
  btn_iniciar_juego.classList.add("deselected");
  cargarBlocka();
});

// ============================
// EVENTO: Fin de animación (opcional)
// ============================
btn_iniciar_juego.addEventListener("animationend", (e) => {
  if (e.animationName === "spin-button-play") {
    btn_iniciar_juego.classList.add("deselected");
  }
});

// ============================
// Cargar FatFooter (opcional)
// ============================
fetch("../html/fat-footer.html")
  .then(res => res.text())
  .then(html => {
    const contenedor = document.querySelector("#fat-footer");
    contenedor.innerHTML = html;

    // Esperar un instante a que el DOM del footer se inserte
    setTimeout(() => {
      // Crear y cargar el script del footer
      const script = document.createElement("script");
      script.src = "../js/fat-footer.js";
      document.body.appendChild(script);
    }, 50); // 50ms son suficientes para que el HTML se agregue
  })
  .catch(err => console.error("Error al cargar fat-footer:", err));