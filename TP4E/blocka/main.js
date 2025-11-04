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
  const oldScript = document.querySelector('script[src="../js/blocka.js"]');
  if (oldScript) oldScript.remove();

  // Carga el HTML del juego
  fetch("../html/blocka.html")
    .then(res => res.text())
    .then(html => {
      article_blocka.innerHTML = html;

      // Esperar a que el HTML esté insertado
      setTimeout(() => {

        // ✅ Primero cargamos la librería canvas-confetti
        const confettiScript = document.createElement("script");
        confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
        confettiScript.onload = () => {

          // ✅ Cuando ya está lista, cargamos app.js
          const script = document.createElement("script");
          script.src = "../js/blocka.js";
          script.defer = true;

          script.onload = () => {
            if (typeof initBlocka === "function") {
              initBlocka();
            } else {
              console.error("initBlocka() no encontrada en app.js");
            }
          };

          document.body.appendChild(script);
        };

        document.body.appendChild(confettiScript);
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
btn_iniciar_juego.addEventListener("animationend", (e) => {
  if (e.animationName === "spin-button-play") {
    btn_iniciar_juego.classList.add("deselected");
    cargarBlocka();
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

  /*Carga automatica de comentarios */
async function automaticLoadingComment() {
  try {
    const response = await fetch("../json/comments-blocka.json");
    const data = await response.json();
    data.forEach(comment => {
      postComment(comment["nombre"], comment["fecha_publicacion"], comment["comentario"], comment["puntuacion"])
    });
  } catch (error) {
    let list_comments = document.querySelector(".list-comments")
    list_comments.innerHTML = "<li>Hubo un error al cargar los comentarios</li>"
  }
}
/*Llamado de funciones automaticas */
automaticLoadingComment()