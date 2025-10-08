// ========================
// Referencias a inputs y mensajes de error
// ========================
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");

const errorEmailLogin = document.getElementById("mensajeError-emailLogin");
const errorPasswordLogin = document.getElementById("mensaje-error-passwordLogin");

const mensajeGeneralLogin = document.getElementById("mensajeGeneralLogin");

// ========================
// Toggle de ojos
// ========================
const eyesLogin = document.querySelectorAll(".toggle-eye");

eyesLogin.forEach(eye => {
  eye.addEventListener("click", () => {
    const input = eye.previousElementSibling.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      eye.src = "./img/icons/ojo-abierto.png";
    } else {
      input.type = "password";
      eye.src = "./img/icons/ojo.png";
    }
  });
});

// ========================
// Validación en tiempo real
// ========================
emailLogin.addEventListener("input", () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(emailLogin.value)) {
    errorEmailLogin.style.display = "block";
    emailLogin.classList.add("input-error");
  } else {
    errorEmailLogin.style.display = "none";
    emailLogin.classList.remove("input-error");
  }
});

passwordLogin.addEventListener("input", () => {
  if (passwordLogin.value.length < 8) {
    errorPasswordLogin.style.display = "block";
    passwordLogin.classList.add("input-error");
  } else {
    errorPasswordLogin.style.display = "none";
    passwordLogin.classList.remove("input-error");
  }
});

// ========================
// Validación completa al enviar
// ========================
function validarLogin() {
  let valido = true;

  // Reset de errores previos
  [emailLogin, passwordLogin].forEach(input => input.classList.remove("input-error"));

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexEmail.test(emailLogin.value)) {
    errorEmailLogin.style.display = "block";
    emailLogin.classList.add("input-error");
    valido = false;
  } else {
    errorEmailLogin.style.display = "none";
  }

  if (passwordLogin.value.length < 8) {
    errorPasswordLogin.style.display = "block";
    passwordLogin.classList.add("input-error");
    valido = false;
  } else {
    errorPasswordLogin.style.display = "none";
  }

  return valido;
}

// ========================
// Scroll al primer error
// ========================
/*
function scrollToFirstErrorLogin() {
  const firstError = document.querySelector(".input-error");
  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
*/

// ========================
// Evento del botón "Iniciar Sesión"
// ========================
document.querySelector(".btn-IniciarSecion").addEventListener("click", function () {
  if (validarLogin()) {
    mensajeGeneralLogin.classList.remove("mostrar");
    mostrarInicioSesionExito();
  } else {
    mensajeGeneralLogin.textContent = "⚠️ Por favor, revisa los campos marcados en rojo.";
    mensajeGeneralLogin.classList.add("mostrar");
  }
});

// ========================
// Pantalla de éxito
// ========================
function mostrarInicioSesionExito() {
  const pantalla = document.getElementById("pantallaExito");
  pantalla.classList.add("mostrar");

  // 🎉 Disparo de confetti al mostrar el éxito
  confetti({
    particleCount: 300,
    spread: 70,
    origin: { y: 0.6 }
  });

  // ⏳ Mantener visible 2.5s y luego redirigir
  setTimeout(() => {
    pantalla.style.opacity = 0;
    setTimeout(() => {
      window.location.href = "/home/index.html"; // redirige al home
    }, 800); // tiempo para el fade-out
  }, 2500);
}