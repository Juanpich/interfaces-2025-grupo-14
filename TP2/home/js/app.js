// Carrusel - cards animadas
let current = 2; // arranca en la card 3
const cards = document.querySelectorAll(".card");

function updateCarousel() {
  cards.forEach((card, i) => {
    card.className = "card"; // resetea
    const index = (i - current + cards.length) % cards.length; // índice relativo cíclico
    if (index === 0) {
      card.classList.add("active"); // Tarjeta activa
    } else if (index === 1) {
      card.classList.add("side-right-cerca"); // Tarjeta más cercana a la derecha
    } else if (index === 2) {
      card.classList.add("side-right"); // Tarjeta más alejada a la derecha
    } else if (index === cards.length - 1) {
      card.classList.add("side-left-cerca"); // Tarjeta más cercana a la izquierda
    } else if (index === cards.length - 2) {
      card.classList.add("side-left"); // Tarjeta más alejada a la izquierda
    }
  });
}
document.getElementById("arrow-rigth").addEventListener("click", () => {
  current = (current + 1) % cards.length; // avanzar cíclicamente
  updateCarousel();
});
document.getElementById("arrow-left").addEventListener("click", () => {
  current = (current - 1 + cards.length) % cards.length; // retroceder cíclicamente
  updateCarousel();
});
CargaHome();
updateCarousel();

// Carga home
function CargaHome() {
    const loadingComment = document.querySelector('.loading-comment-animation');
    const textLoading = document.querySelector('.text-loading');
    const valores = [10, 25, 50, 80, 100];
      setTimeout(() => {
        textLoading.innerHTML = `...${valores[0]}%`;
      }, 1000);
      setTimeout(() => {
        textLoading.innerHTML = `...${valores[1]}%`;
      }, 3000);
      setTimeout(() => {
        textLoading.innerHTML = `...${valores[2]}%`;
      }, 5500);
      setTimeout(() => {
        textLoading.innerHTML = `...${valores[3]}%`;
      }, 6800);
      setTimeout(() => {
        textLoading.innerHTML = `...${valores[4]}%`;
      }, 8000);
    setTimeout(()=>{
      loadingComment.classList.add("deselected");
    }, 10000);
    let dotCount = 0;
    const maxDots = 3;
    const intervalTime = 500;
}

