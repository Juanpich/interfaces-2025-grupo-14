
  //Cargar FatFooter 
  fetch('../html/fat-footer.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#fat-footer').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../js/fat-footer.js';
    document.body.appendChild(script);
  });
  const btn_iniciar_juego = document.querySelector("#btn_iniciar_juego");
  btn_iniciar_juego.addEventListener("animationend", (e) => {
  if (e.animationName === "spin-button-play") {
    btn_iniciar_juego.classList.add("deselected");
    cargarPeg();
  }
});
function cargarPeg(){
  fetch('../html/peg-solitaire-game.html')
  .then(res => res.text())
  .then(html => {
    // Insertar el HTML en el contenedor
    document.querySelector(".peg-solitarie").innerHTML += html;

    // Lista de scripts en el orden correcto (modelo → vista → controlador → main)
    const scripts = [
      '../js/pegSolitaire/controller/CargaDeljuego.js',
      '../js/pegSolitaire/model/Ficha.js',
      '../js/pegSolitaire/model/Tablero.js',
      '../js/pegSolitaire/model/Temporizador.js',
      '../js/pegSolitaire/view/TableroView.js',
      '../js/pegSolitaire/controller/TableroControlador.js',
      '../js/pegSolitaire/inicio-peg-solitaire.js' // ojo, en tu ejemplo estaba escrito "mian.js"
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
function cambiarFondo(){
   document.querySelector(".peg-solitarie").style.background = `
      linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
      url("../img/fondo.jpg") center / cover no-repeat
    `;
}
 
