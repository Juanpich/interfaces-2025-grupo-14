
//Cargar FatFooter 
fetch('../html/fat-footer.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#fat-footer').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../js/fat-footer.js';
    document.body.appendChild(script);
  });
// const btn_iniciar_juego = document.querySelector("#btn_iniciar_juego");
// btn_iniciar_juego.addEventListener("animationend", (e) => {
//   if (e.animationName === "spin-button-play") {
//     btn_iniciar_juego.classList.add("deselected");
//     cargarPeg();
//   }
// });
function cargarPeg() {
  fetch('./flappy-bird.html')
    .then(res => res.text())
    .then(html => {
      // Insertar el HTML en el contenedor
      document.querySelector(".flappy-bird").innerHTML += html;

      // Lista de scripts en el orden correcto (modelo → vista → controlador → main)
      const scripts = [
        "./js/Hud.js",
        "./js/Bird.js",
        "./js/tuberia.js",
        "./js/generadortuberias.js",
        "./js/Enemig.js",
        "./js/GeneradorEnemig.js",
        "./js/Game.js",
      ];

      // Función recursiva para cargarlos en secuencia
      const loadScriptsSequentially = (index = 0) => {
        if (index >= scripts.length) return; // fin
        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => loadScriptsSequentially(index + 1);
        document.body.appendChild(script);
      };

      loadScriptsSequentially();
      cambiarFondo()
    });
}
function cambiarFondo() {
  document.querySelector(".flappy-bird").style.background = `
      linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
      url("../img/fondo.jpg") center / cover no-repeat
    `;
}
cargarPeg()
async function automaticLoadingComment() {
  console.log("Cargando comentarios")
  try {
    const response = await fetch("../json/comments-flappy-bird.json");
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

