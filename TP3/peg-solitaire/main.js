const btn_iniciar_juego = document.querySelector("#btn_iniciar_juego");
const article_blocka = document.querySelector(".blocka");

btn_iniciar_juego.addEventListener("click", async () => {
    console.log("Cargando blocka...");
    try {
        const resp = await fetch("./blocka.html", { cache: "no-store" });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        setTimeout(() => {
            article_blocka.innerHTML += html;
        }, 1500);
    } catch (err) {
        console.error("Error cargando blocka:", err);
        article_blocka.innerHTML += "Error cargando contenido.";

    }
    

});
btn_iniciar_juego.addEventListener("animationend", (e) => {
        if (e.animationName === "spin-button-play") {
            btn_iniciar_juego.classList.add("deselected");
        }
    });