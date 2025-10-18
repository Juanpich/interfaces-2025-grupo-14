const btn_iniciar_juego = document.querySelector("#btn_iniciar_juego");
const article_blocka = document.querySelector(".blocka");

btn_iniciar_juego.addEventListener("click",  () => {
    console.log("Cargando blocka...");
    fetch('./blocka.html')
  .then(res => res.text())
  .then(html => {
    article_blocka.innerHTML += html;
    const script = document.createElement('script');
    script.src = './app.js';
    document.body.appendChild(script);
  });


});
btn_iniciar_juego.addEventListener("animationend", (e) => {
    if (e.animationName === "spin-button-play") {
        btn_iniciar_juego.classList.add("deselected");
    }
});
  //Cargar FatFooter 
  fetch('../html/fat-footer.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#fat-footer').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../js/script.js';
    document.body.appendChild(script);
  });