
/*Multimedia*/
document.querySelectorAll(".img-mult").forEach(img =>
  img.addEventListener("click", () => {
    let ruta_img_select = img.getAttribute("src")/*Ruta de la img selecionada*/
    let approach_img = document.querySelector("#img-approach")
    let ruta_img_approach = approach_img.getAttribute("src") /*ruta de la img de approach*/
    approach_img.setAttribute("src", ruta_img_select)
    img.setAttribute("src", ruta_img_approach)
  })
);
/*Botones*/
let btn_multimedia = document.querySelector("#btn-multimedia");
let btn_description = document.querySelector("#btn-description")
let btn_how_to_play = document.querySelector("#btn-how-to-play")
/*Article  */
let art_howToPlay = document.querySelector(".howToPlay")
let art_multimedia = document.querySelector(".multimedia")
let art_description = document.querySelector(".description")
/*Eventos*/
btn_multimedia.addEventListener("click", () => {
  art_multimedia.classList.remove("deselected")
  art_howToPlay.classList.add("deselected")
  art_description.classList.add("deselected")
  btn_multimedia.classList.add("btn-how-play-selected")
  btn_description.classList.remove("btn-how-play-selected")
  btn_how_to_play.classList.remove("btn-how-play-selected")

})
btn_description.addEventListener("click", () => {
  art_description.classList.remove("deselected")
  art_howToPlay.classList.add("deselected")
  art_multimedia.classList.add("deselected")
  btn_description.classList.add("btn-how-play-selected")
  btn_multimedia.classList.remove("btn-how-play-selected")
  btn_how_to_play.classList.remove("btn-how-play-selected")

})
btn_how_to_play.addEventListener("click", () => {
  art_howToPlay.classList.remove("deselected")
  art_multimedia.classList.add("deselected")
  art_description.classList.add("deselected")
  btn_how_to_play.classList.add("btn-how-play-selected")
  btn_multimedia.classList.remove("btn-how-play-selected")
  btn_description.classList.remove("btn-how-play-selected")
})
/*Compartir*/
let section_share = document.querySelector(".action-share")
let btn_share = document.querySelector("#btn-share")
btn_share.addEventListener("click", () => {
  section_share.classList.toggle("deselected")
})
/*Pantalla comleta*/
let btn_fullscreen = document.querySelector("#btn-fullscreen")
let path_btn_fullscreen = document.querySelector("#path-btn-fullscreen");
btn_fullscreen.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    btn_fullscreen.setAttribute("viewBox", "0 0 20 20");
    path_btn_fullscreen.setAttribute("d", "M19.333 19.333V19.9163H19.9163V19.333H19.333ZM13.9127 13.0867C13.8031 12.9771 13.6546 12.9156 13.4997 12.9156C13.3448 12.9156 13.1962 12.9771 13.0867 13.0867C12.9771 13.1962 12.9156 13.3448 12.9156 13.4997C12.9156 13.6546 12.9771 13.8031 13.0867 13.9127L13.9127 13.0867ZM18.7497 12.333V19.333H19.9163V12.333H18.7497ZM19.333 18.7497H12.333V19.9163H19.333V18.7497ZM19.746 18.92L13.9127 13.0867L13.0867 13.9127L18.92 19.746L19.746 18.92ZM0.666341 19.333H0.0830078V19.9163H0.666341V19.333ZM6.91267 13.9127C7.02221 13.8031 7.08374 13.6546 7.08374 13.4997C7.08374 13.3448 7.02221 13.1962 6.91267 13.0867C6.80314 12.9771 6.65458 12.9156 6.49967 12.9156C6.34477 12.9156 6.19621 12.9771 6.08667 13.0867L6.91267 13.9127ZM0.0830078 12.333V19.333H1.24967V12.333H0.0830078ZM0.666341 19.9163H7.66634V18.7497H0.666341V19.9163ZM1.07934 19.746L6.91267 13.9127L6.08667 13.0867L0.253341 18.92L1.07934 19.746ZM19.333 0.666341H19.9163V0.0830078H19.333V0.666341ZM13.0867 6.08667C13.0324 6.14091 12.9894 6.2053 12.9601 6.27616C12.9307 6.34702 12.9156 6.42297 12.9156 6.49967C12.9156 6.57638 12.9307 6.65233 12.9601 6.72319C12.9894 6.79405 13.0324 6.85844 13.0867 6.91267C13.1409 6.96691 13.2053 7.00993 13.2762 7.03929C13.347 7.06864 13.423 7.08374 13.4997 7.08374C13.5764 7.08374 13.6523 7.06864 13.7232 7.03929C13.7941 7.00993 13.8584 6.96691 13.9127 6.91267L13.0867 6.08667ZM19.9163 7.66634V0.666341H18.7497V7.66634H19.9163ZM19.333 0.0830078H12.333V1.24967H19.333V0.0830078ZM18.92 0.253341L13.0867 6.08667L13.9127 6.91267L19.746 1.07934L18.92 0.253341ZM0.666341 0.666341V0.0830078H0.0830078V0.666341H0.666341ZM6.08667 6.91267C6.19621 7.02221 6.34477 7.08374 6.49967 7.08374C6.65458 7.08374 6.80314 7.02221 6.91267 6.91267C7.02221 6.80314 7.08374 6.65458 7.08374 6.49967C7.08374 6.34477 7.02221 6.19621 6.91267 6.08667L6.08667 6.91267ZM1.24967 7.66634V0.666341H0.0830078V7.66634H1.24967ZM0.666341 1.24967H7.66634V0.0830078H0.666341V1.24967ZM0.253341 1.07934L6.08667 6.91267L6.91267 6.08667L1.07934 0.253341L0.253341 1.07934Z");
  } else {
    document.documentElement.requestFullscreen();
    btn_fullscreen.setAttribute("viewBox", "0 0 28 28");
    path_btn_fullscreen.setAttribute("d", "M9.25003 3C9.44894 3 9.63971 3.07902 9.78036 3.21967C9.92101 3.36032 10 3.55109 10 3.75V7.25C10 7.61114 9.9289 7.96873 9.7907 8.30238C9.6525 8.63602 9.44993 8.93918 9.19457 9.19454C8.93921 9.4499 8.63605 9.65247 8.30241 9.79067C7.96876 9.92887 7.61116 10 7.25003 10H3.75403C3.55512 10 3.36435 9.92098 3.2237 9.78033C3.08305 9.63968 3.00403 9.44891 3.00403 9.25C3.00403 9.05109 3.08305 8.86032 3.2237 8.71967C3.36435 8.57902 3.55512 8.5 3.75403 8.5H7.25003C7.94003 8.5 8.50003 7.94 8.50003 7.25V3.75C8.50003 3.55109 8.57905 3.36032 8.7197 3.21967C8.86035 3.07902 9.05112 3 9.25003 3ZM18.75 3C18.9489 3 19.1397 3.07902 19.2804 3.21967C19.421 3.36032 19.5 3.55109 19.5 3.75V7.25C19.5 7.94 20.06 8.5 20.75 8.5H24.25C24.4489 8.5 24.6397 8.57902 24.7804 8.71967C24.921 8.86032 25 9.05109 25 9.25C25 9.44891 24.921 9.63968 24.7804 9.78033C24.6397 9.92098 24.4489 10 24.25 10H20.75C20.0207 10 19.3212 9.71027 18.8055 9.19454C18.2898 8.67882 18 7.97935 18 7.25V3.75C18 3.55109 18.079 3.36032 18.2197 3.21967C18.3604 3.07902 18.5511 3 18.75 3ZM3.00403 18.75C3.00403 18.5511 3.08305 18.3603 3.2237 18.2197C3.36435 18.079 3.55512 18 3.75403 18H7.25003C7.61116 18 7.96876 18.0711 8.30241 18.2093C8.63605 18.3475 8.93921 18.5501 9.19457 18.8055C9.44993 19.0608 9.6525 19.364 9.7907 19.6976C9.9289 20.0313 10 20.3889 10 20.75V24.25C10 24.4489 9.92101 24.6397 9.78036 24.7803C9.63971 24.921 9.44894 25 9.25003 25C9.05112 25 8.86035 24.921 8.7197 24.7803C8.57905 24.6397 8.50003 24.4489 8.50003 24.25V20.75C8.50003 20.06 7.94003 19.5 7.25003 19.5H3.75403C3.55512 19.5 3.36435 19.421 3.2237 19.2803C3.08305 19.1397 3.00403 18.9489 3.00403 18.75ZM18 20.75C18 20.0207 18.2898 19.3212 18.8055 18.8055C19.3212 18.2897 20.0207 18 20.75 18H24.25C24.4489 18 24.6397 18.079 24.7804 18.2197C24.921 18.3603 25 18.5511 25 18.75C25 18.9489 24.921 19.1397 24.7804 19.2803C24.6397 19.421 24.4489 19.5 24.25 19.5H20.75C20.06 19.5 19.5 20.06 19.5 20.75V24.25C19.5 24.4489 19.421 24.6397 19.2804 24.7803C19.1397 24.921 18.9489 25 18.75 25C18.5511 25 18.3604 24.921 18.2197 24.7803C18.079 24.6397 18 24.4489 18 24.25V20.75Z")
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.fullscreenElement) {
    document.exitFullscreen();
  }
});
// No se incluye filepath, puedes ponerlo donde gustes
const input_comment = document.getElementById('comment-input');
const btn_comment = document.querySelector('.comment-btn');
let container_loading = document.querySelector(".loading-comment-animation")


input_comment.addEventListener('input', () => {
  if (input_comment.value.trim().length > 0) {
    btn_comment.disabled = false;
    btn_comment.classList.add('ready');
  } else {
    btn_comment.disabled = true;
    btn_comment.classList.remove('ready');
  }
});

/*Estrellas del comentario */
let stars = document.querySelectorAll(".select-star");
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    stars.forEach((s, i) => {
      if (i <= index) {
        s.classList.remove("star-empty");
        s.classList.add("star-full");
      } else {
        s.classList.remove("star-full");
        s.classList.add("star-empty");
      }
    });
  });
});
/*Publicar comentario*/
let btn_cancel = document.querySelector("#btn-cancel-comment")
let text_loading = document.querySelector("#text-loading")
let publishTimeout = null;
btn_comment.addEventListener("click", () => {
  text_loading.innerHTML = "Publicando comentario, por favor espere";
  container_loading.classList.remove('deselected');
  publishTimeout = setTimeout(() => {
    container_loading.classList.add('deselected');
    postComment("Yo", new Date(), input_comment.value, calculateRaiting());
    input_comment.value = "";
    btn_comment.disabled = true;
    btn_comment.classList.remove('ready');
    stars.forEach((s) => {
      s.classList.remove("star-full");
      s.classList.add("star-empty");
    });
    publishTimeout = null;
  }, 4000);
});

btn_cancel.addEventListener("click", () => {
  if (publishTimeout) {
    clearTimeout(publishTimeout); 
    publishTimeout = null;
  }
  text_loading.innerHTML = "Eliminando comentario, por favor espere";
  container_loading.classList.remove('deselected');
  btn_cancel.classList.add("deselected");
  setTimeout(() => {
    container_loading.classList.add('deselected');
    btn_cancel.classList.remove("deselected");
  }, 2000);
});

function postComment(name, time, comment, rating) {
  let comment_text = `<li class="comment-item">
                <div class="info-per"><div class="icon">
                        <svg class="icon-user" xmlns="http://www.w3.org/2000/svg" width="24" height="27"viewBox="0 0 24 27" fill="none">
                            <path d="M7.25143 5.92105C7.25143 4.93958 7.67587 3.9983 8.43137 3.30429C9.18687 2.61028 10.2116 2.22039 11.28 2.22039C12.3484 2.22039 13.3731 2.61028 14.1286 3.30429C14.8841 3.9983 15.3086 4.93958 15.3086 5.92105C15.3086 6.90253 14.8841 7.84381 14.1286 8.53781C13.3731 9.23182 12.3484 9.62171 11.28 9.62171C10.2116 9.62171 9.18687 9.23182 8.43137 8.53781C7.67587 7.84381 7.25143 6.90253 7.25143 5.92105ZM17.7257 5.92105C17.7257 4.35069 17.0466 2.84465 15.8378 1.73424C14.629 0.623824 12.9895 0 11.28 0C9.57049 0 7.931 0.623824 6.72219 1.73424C5.51339 2.84465 4.83429 4.35069 4.83429 5.92105C4.83429 7.49141 5.51339 8.99746 6.72219 10.1079C7.931 11.2183 9.57049 11.8421 11.28 11.8421C12.9895 11.8421 14.629 11.2183 15.8378 10.1079C17.0466 8.99746 17.7257 7.49141 17.7257 5.92105ZM2.41714 22.2039C2.41714 18.9335 5.30261 16.2829 8.86286 16.2829H13.6971C17.2574 16.2829 20.1429 18.9335 20.1429 22.2039V22.574C20.1429 23.1892 20.6817 23.6842 21.3514 23.6842C22.0212 23.6842 22.56 23.1892 22.56 22.574V22.2039C22.56 17.7076 18.5919 14.0625 13.6971 14.0625H8.86286C3.96814 14.0625 0 17.7076 0 22.2039V22.574C0 23.1892 0.538821 23.6842 1.20857 23.6842C1.87832 23.6842 2.41714 23.1892 2.41714 22.574V22.2039Z" /></svg>
                    </div> <div class="info">
                        <p class="name-person-comment"> ${name}</p>
                        <p class="publication-date"> Publicado ${calcularTiempoPublicacion(time)}</p> </div> </div>
                      <div class="comment">
                        <section class="stars-score">
                        ${getStarsHTML(rating)}
                        </section>
                        <p> ${comment} </p></div>
            </li>`
  let list_comments = document.querySelector(".list-comments");
  list_comments.innerHTML = comment_text + list_comments.innerHTML;
}
function calculateRaiting() {
  let rating = 0;
  stars.forEach((star) => {
    if (star.classList.contains("star-full")) {
      rating++;
    }
  });
  return rating;
}
function calcularTiempoPublicacion(date) {
  const ahora = new Date();
  const tiempoPublicacion = new Date(date);

  // Si la fecha es inválida, retorna vacío
  if (isNaN(tiempoPublicacion.getTime())) return "";

  const diferencia = ahora - tiempoPublicacion; // Diferencia en milisegundos
  const unDia = 1000 * 60 * 60 * 24;
  const unAnio = unDia * 365;

  if (diferencia > unAnio) {
    return "hace más de un año";
  }

  // Si es hoy
  if (
    ahora.getFullYear() === tiempoPublicacion.getFullYear() &&
    ahora.getMonth() === tiempoPublicacion.getMonth() &&
    ahora.getDate() === tiempoPublicacion.getDate()
  ) {
    return "hoy";
  }

  const dias = Math.floor(diferencia / unDia);
  return `hace ${dias} día${dias !== 1 ? "s" : ""}`;
}

function getStarsHTML(rating) {
  let starsHTML = '';
  for (let i = 0; i < rating; i++) {
    starsHTML += '<svg class="star star-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14" fill="none"><path d="M9.04883 4.78418L9.16504 5.03809L9.44238 5.07129L13.3291 5.54785L10.457 8.25293L10.2568 8.44141L10.3086 8.71191L11.0615 12.6006L7.65039 10.6797L7.40527 10.541L7.16016 10.6797L3.74902 12.6006L4.50195 8.71191L4.55371 8.44141L4.35352 8.25293L1.48047 5.54883L5.36816 5.07129L5.64551 5.03809L5.76172 4.78418L7.40527 1.19824L9.04883 4.78418Z" /></svg>';
  }
  for (let i = rating; i < 5; i++) {
    starsHTML += '<svg class="star star-empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14" fill="none"><path d="M9.04883 4.78418L9.16504 5.03809L9.44238 5.07129L13.3291 5.54785L10.457 8.25293L10.2568 8.44141L10.3086 8.71191L11.0615 12.6006L7.65039 10.6797L7.40527 10.541L7.16016 10.6797L3.74902 12.6006L4.50195 8.71191L4.55371 8.44141L4.35352 8.25293L1.48047 5.54883L5.36816 5.07129L5.64551 5.03809L5.76172 4.78418L7.40527 1.19824L9.04883 4.78418Z" /></svg>';
  }
  return starsHTML;
}
/*Animacion de los comentarios */

/*Carga automatica de comentarios */
async function automaticLoadingComment() {
  try {
    const response = await fetch("../comments.json");
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