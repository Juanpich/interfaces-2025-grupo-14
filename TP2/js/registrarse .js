// ========================
// Referencias a inputs y mensajes de error
// ========================
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputEdad = document.getElementById("edad");
const inputUsuario = document.getElementById("nombreUsuario");
const inputEmail = document.getElementById("email");
const password = document.getElementById("contrasena");
const password2 = document.getElementById("contrasena2");

// Mensajes de error
const errorNombre = document.getElementById("mensajeError-nombre");
const errorApellido = document.getElementById("mensajeError-apellido");
const errorEdad = document.getElementById("mensajeError-edad");
const errorUsuario = document.getElementById("mensajeError-nombreUsuario");
const errorEmail = document.getElementById("mensajeError-email");
const errorPassword = document.getElementById("mensajeError-contrasena");
const errorPassword2 = document.getElementById("mensajeError-contrasena2");
const mensajeGeneral = document.getElementById("mensajeGeneral");

// ========================
// Toggle de ojos (mostrar/ocultar contraseña)
// ========================
const eyes = document.querySelectorAll(".toggle-eye");

eyes.forEach(eye => {
  eye.addEventListener("click", () => {
    const input = eye.previousElementSibling.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      eye.src = "../img/icons/ojo.png";
    } else {
      input.type = "password";
      eye.src = "../img/icons/ojo-abierto.png";
    }
  });
});

// ========================
// Validaciones en tiempo real
// ========================
inputNombre.addEventListener("input", () => {
  if (inputNombre.value.trim().length < 3) {
    errorNombre.style.display = "block";
    inputNombre.classList.add("input-error");
  } else {
    errorNombre.style.display = "none";
    inputNombre.classList.remove("input-error");
  }
});

inputApellido.addEventListener("input", () => {
  if (inputApellido.value.trim().length < 3) {
    errorApellido.style.display = "block";
    inputApellido.classList.add("input-error");
  } else {
    errorApellido.style.display = "none";
    inputApellido.classList.remove("input-error");
  }
});

inputEdad.addEventListener("input", () => {
  const edad = parseInt(inputEdad.value, 10);
  if (isNaN(edad) || edad <= 0 || edad > 110) {
    errorEdad.style.display = "block";
    inputEdad.classList.add("input-error");
  } else {
    errorEdad.style.display = "none";
    inputEdad.classList.remove("input-error");
  }
});


inputEmail.addEventListener("input", () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(inputEmail.value)) {
    errorEmail.style.display = "block";
    inputEmail.classList.add("input-error");
  } else {
    errorEmail.style.display = "none";
    inputEmail.classList.remove("input-error");
  }
});

password.addEventListener("input", () => {
  if (password.value.length < 8) {
    errorPassword.style.display = "block";
    password.classList.add("input-error");
  } else {
    errorPassword.style.display = "none";
    password.classList.remove("input-error");
  }

  // Verificar coincidencia con la segunda contraseña
  if (password2.value !== "" && password.value !== password2.value) {
    errorPassword2.style.display = "block";
    password2.classList.add("input-error");
  } else {
    errorPassword2.style.display = "none";
    password2.classList.remove("input-error");
  }
});

password2.addEventListener("input", () => {
  if (password.value !== password2.value) {
    errorPassword2.style.display = "block";
    password2.classList.add("input-error");
  } else {
    errorPassword2.style.display = "none";
    password2.classList.remove("input-error");
  }
});

// ========================
// Función de validación completa (al enviar)
// ========================
function validarFormulario() {
  let valido = true;

  // Reset de errores previos
  [inputNombre, inputApellido, inputEdad, inputUsuario, inputEmail, password, password2].forEach(input => {
    input.classList.remove("input-error");
  });

  // Nombre
  if (inputNombre.value.trim().length < 3) {
    errorNombre.style.display = "block";
    inputNombre.classList.add("input-error");
    valido = false;
  } else { errorNombre.style.display = "none"; }

  // Apellido
  if (inputApellido.value.trim().length < 3) {
    errorApellido.style.display = "block";
    inputApellido.classList.add("input-error");
    valido = false;
  } else { errorApellido.style.display = "none"; }

  // Edad
  const edad = parseInt(inputEdad.value, 10);
  if (isNaN(edad) || edad <= 0 || edad > 110) {
    errorEdad.style.display = "block";
    inputEdad.classList.add("input-error");
    valido = false;
  } else { errorEdad.style.display = "none"; }



  // Email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(inputEmail.value)) {
    errorEmail.style.display = "block";
    inputEmail.classList.add("input-error");
    valido = false;
  } else { errorEmail.style.display = "none"; }

  // Contraseña
  if (password.value.length < 8) {
    errorPassword.style.display = "block";
    password.classList.add("input-error");
    valido = false;
  } else { errorPassword.style.display = "none"; }

  // Repetir contraseña
  if (password.value !== password2.value || password2.value === "") {
    errorPassword2.style.display = "block";
    password2.classList.add("input-error");
    valido = false;
  } else { errorPassword2.style.display = "none"; }

  return valido;
}

// ========================
// Scroll al primer error
// ========================
function scrollToFirstError() {
  const firstError = document.querySelector(".input-error");
  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// ========================
// Evento del botón "Registrarme"
// ========================
document.querySelector(".btn-registrarme").addEventListener("click", function () {
  if (validarFormulario()) {
    mensajeGeneral.classList.remove("mostrar");
    mostrarInicioSesionExito();
  } else {
    mensajeGeneral.textContent = "⚠️ Por favor, revisa los campos marcados en rojo.";
    mensajeGeneral.classList.add("mostrar");
    scrollToFirstError();
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
      window.location.href = "../"; // redirige al home
    }, 800); // tiempo para el fade-out
  }, 2500);
}