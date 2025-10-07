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

updateCarousel();


