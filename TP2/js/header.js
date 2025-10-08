



/*Menu hamburguesa*/
  let hamburger_menu = document.querySelector("#hamburger-menu");
  let nav_menu = document.querySelector(".nav-menu-hamburger");
  let close_menu = document.querySelector("#close-menu-hamburger");
  hamburger_menu.addEventListener("click", ()=>{
    nav_menu.classList.remove("is-closing");
    nav_menu.classList.remove("deselected");
  });
  close_menu.addEventListener("click", ()=>{
    nav_menu.classList.add("is-closing");
  });
document.addEventListener("click", (e) => {
  if (
    !nav_menu.contains(e.target) &&          
    !hamburger_menu.contains(e.target) && 
    !nav_menu.classList.contains("deselected") 
  ) {
    nav_menu.classList.add("is-closing");
  }
});

nav_menu.addEventListener("animationend", (e) => {
  if (e.animationName === "slideOutToLeftHamburgerMenu") {
    nav_menu.classList.remove("is-closing");
    nav_menu.classList.add("deselected");
  }
});
/*Buscador*/
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-menu");
  const searchDiv = document.querySelector(".search");
  const searchInput = document.querySelector(".search-input");

  // Al hacer clic en la lupa, abrir/cerrar el buscador
  searchBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita que el clic en la lupa cierre el input
    searchDiv.classList.toggle("active");

    // Si se abre, enfocar automáticamente el input
    if (searchDiv.classList.contains("active")) {
      searchInput.focus();
    }
  });

  // Cerrar el buscador al hacer clic fuera
  document.addEventListener("click", (event) => {
    const isClickInside = searchDiv.contains(event.target) || searchBtn.contains(event.target);
    if (!isClickInside) {
      searchDiv.classList.remove("active");
    }
  });
});




  /*Carrito de compras*/
  let cart_button = document.querySelector("#cart-menu");
  let shopping_cart = document.querySelector(".shopping-cart");
  let close_cart = document.querySelector("#close-shopping-cart");
  cart_button.addEventListener("click", ()=>{
    shopping_cart.classList.remove("is-closing");
    shopping_cart.classList.remove("deselected");
  }   );
  close_cart.addEventListener("click", ()=>{
    shopping_cart.classList.add("is-closing");
  }); 
  document.addEventListener("click", (e) => {
  if (
    !shopping_cart.contains(e.target) &&
    !cart_button.contains(e.target) &&
    !shopping_cart.classList.contains("deselected")
  ) {
    shopping_cart.classList.add("is-closing");
  }
});

 shopping_cart.addEventListener("animationend", (e) => {
  if (e.animationName === "slideOutToRightCart") {
    shopping_cart.classList.remove("is-closing");
    shopping_cart.classList.add("deselected");
  }
});
/*User menu*/
document.querySelectorAll(".btn-cerrar-sesion").forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
});
/*volver al home */
document.querySelectorAll(".btn-ir-home").forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../home/index.html';
  });
});
let user_button = document.querySelector("#user-menu")
let close_user_menu = document.querySelector("#close-user-menu");
let user_menu = document.querySelector(".user-menu")
user_button.addEventListener('click', ()=>{
  user_menu.classList.remove("is-closing")
  user_menu.classList.remove("deselected")
})
close_user_menu.addEventListener("click", ()=> {
  user_menu.classList.add("is-closing")
})
document.addEventListener("click", (e) => {
  if (
    !user_menu.contains(e.target) &&
    !user_button.contains(e.target) &&
    !user_menu.classList.contains("deselected")
  ) {
    user_menu.classList.add("is-closing");
  }
});
 user_menu.addEventListener("animationend", (e) => {
  if (e.animationName === "slideOutToRightCart") {
    user_menu.classList.remove("is-closing");
    user_menu.classList.add("deselected");
  }
});

