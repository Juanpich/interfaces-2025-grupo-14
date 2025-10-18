/*Consumir api de lso profes*/
async function api() {
    try {
        const response = await fetch("https://vj.interfaces.jima.com.ar/api/v2");
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("La respuesta no es un arreglo:", data);
            return;
        }
        
        const generosConJuegos = {};
        let juegosJson = await jsonJuegos("../json/juegos.json")
        data.forEach(juego => {
            juego.genres?.forEach(genero => {
                const nombreGenero = genero.name;
                if (!generosConJuegos[nombreGenero]) {
                    generosConJuegos[nombreGenero] = [];
                }
                generosConJuegos[nombreGenero].push({
                    id: juego.id,
                    name: juego.name,
                    released: juego.released,
                    rating: juego.rating,
                    background_image: juego.background_image
                });
            });
        });
        juegosJson.forEach(juego => {
        juego.genres?.forEach(genero => {
            const nombreGenero = genero.name;
            if (!generosConJuegos[nombreGenero]) {
            generosConJuegos[nombreGenero] = [];
            }
            generosConJuegos[nombreGenero].push({
            id: juego.id,
            name: juego.name,
            released: juego.released,   
            rating: juego.rating,
            background_image: juego.background_image,
            pagina: ""
            });
        });
        });
        separarCategorias(generosConJuegos)

    } catch (error) {
        console.error("Error al traer los datos:", error);
    }
}
// Nuestra api de juegos
async function jsonJuegos(ubicacion){
    try{
        const response = await fetch(ubicacion);
        const data = await response.json();
        return data 
    }catch (error) {
        console.error("Error al traer los datos:", error);
    }  
}
/*Categorias */
function generarCarruseldeCategorias(nombre_categoria, juegos){
    let div_carruseles = document.querySelector(".carruseles");//div en el cual se van a generar los carruseles
    let string = generarCarrusel(nombre_categoria, juegos)   
    div_carruseles.innerHTML += string;
    // console.log(string)
}
async function separarCategorias(generosConJuegos) {
  Object.entries(generosConJuegos).forEach(([nombreGenero, juegos]) => {
    generarCarruseldeCategorias(nombreGenero, juegos)
    inicializarCarruseles();
    scroll();
  });
}
/*Tendencias */
async function generarCarruselTendencias(){
    let tendencias = await jsonJuegos("../json//juegos-tendencias.json");
    let div_tendencias = document.querySelector(".carrusel-tendencia")
    nombreGenero = "Tendencies";
    let tendenciasJuegos = [];
    tendencias.forEach(juego => {
            tendenciasJuegos.push({
            id: juego.id,
            name: juego.name,
            released: juego.released,   
            rating: juego.rating,
            background_image: juego.background_image,
            pagina:  juego.pagina
            });
        });
    let string = generarCarrusel(nombreGenero, tendenciasJuegos)
    div_tendencias.innerHTML += string;
    activarRedirigirPeg()
    api()
}
/*activarRedirigirPeg */
function activarRedirigirPeg(){
  document.querySelector("#peg-solitaire").addEventListener("click", ()=>{
    window.location.href = '../pegSolitaire/index.html';
  })
  document.querySelector("#blocka").addEventListener("click", ()=>{
    window.location.href = '../peg-solitaire/index.html';
  })
}


/*Funciones de generar los carruseles */

function generarCarrusel(nombre_categoria, juegos){
    let idCarrusel = `carrusel-${nombre_categoria.replace(/\s+/g, '-')}`;
    let string = `<div class="carrusel" id="${idCarrusel}">
                <p class="category-name">${nombre_categoria}</p>
            <div class="carrusel-cards-games-view">
                <div class="left-arrow flechas-mobile" id="left-${idCarrusel}"> 
                    <svg width="50" height="100" viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42 0C46.4183 0 50 3.58172 50 8V92C50 96.4183 46.4183 100 42 100H8C3.58172 100 0 96.4183 0 92V8C0 3.58172 3.58172 0 8 0H42Z" fill="#F4F4F4" fill-opacity="0.64"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M35 76.6667L8.33337 50L35 23.3334L41.6667 30L21.6667 50L41.6667 70L35 76.6667Z" fill="#00F5E9"/>
                    </svg>
                </div>
                <!-- Carrusel que contiene todas las cards de juegos -->
                <div class="container-function-carrusel"> `
     string += generarCard(juegos);
     string += `</div>  
                <div class="right-arrow flechas-mobile" id="right-${idCarrusel}">
                    <svg width="50" height="100" viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42 0C46.4183 0 50 3.58172 50 8V92C50 96.4183 46.4183 100 42 100H8C3.58172 100 0 96.4183 0 92V8C0 3.58172 3.58172 0 8 0H42Z" fill="#F4F4F4" fill-opacity="0.64"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 23.3333L41.6666 50L15 76.6666L8.33329 70L28.3333 50L8.33329 30L15 23.3333Z" fill="#00F5E9"/>
                    </svg>
                </div>
            </div>
            <!-- Indicadores del carrusel de juegos para mobile -->
            <div class="indicadores-carrusel-cards-games">
                <span class="punto1"></span>
                <span class="punto2"></span>
                <span class="punto3"></span>
            </div> 
            </div>`  
            return string
}
function generarCard(juegos){
    let cards = ` `
    juegos.forEach(juego => {
    //   console.log("juego "+ juego.name);
        cards += ` <div class="card-game-free">
                    <img src="${juego.background_image}" alt="Juegos Online" class="img-carg-game-free" onerror="this.onerror=null; this.src='img/img-error.webp';">
                    <p class="title-card-game-free">${juego.name}</p>
                    <div class="stars-valoration">
                        ${getStarsHTML(juego.rating)}
                    </div>
                    <div class="container-action-game-free" ${juego.pagina ? `id="${juego.pagina}"` : ''}>
                        <p>Jugar</p>
                        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.6875 3.4375C8.6875 3.72477 8.63092 4.00922 8.52099 4.27462C8.41105 4.54002 8.24992 4.78117 8.0468 4.9843C7.84367 5.18742 7.60252 5.34855 7.33712 5.45849C7.07172 5.56842 6.78727 5.625 6.5 5.625C6.21273 5.625 5.92828 5.56842 5.66288 5.45849C5.39748 5.34855 5.15633 5.18742 4.9532 4.9843C4.75008 4.78117 4.58895 4.54002 4.47901 4.27462C4.36908 4.00922 4.3125 3.72477 4.3125 3.4375C4.3125 2.85734 4.54297 2.30094 4.9532 1.8907C5.36344 1.48047 5.91984 1.25 6.5 1.25C7.08016 1.25 7.63656 1.48047 8.0468 1.8907C8.45703 2.30094 8.6875 2.85734 8.6875 3.4375Z" stroke="#F70808" stroke-width="1.5"/>
                            <path d="M10.0894 13.75H2.91062C2.76125 13.75 2.68687 13.75 2.62437 13.7437C2.33759 13.7148 2.06963 13.5876 1.86586 13.3837C1.6621 13.1798 1.53506 12.9118 1.50625 12.625C1.5 12.5625 1.5 12.4875 1.5 12.3388C1.5 12.2481 1.5 12.2025 1.50187 12.1588C1.52066 11.7563 1.66859 11.3706 1.92375 11.0588C1.96225 11.0128 2.00184 10.9678 2.0425 10.9238L2.8825 9.99062C3.4325 9.37937 3.7075 9.07375 4.0725 8.91125C4.43625 8.75 4.8475 8.75 5.67 8.75H7.33C8.1525 8.75 8.56375 8.75 8.9275 8.9125C9.29187 9.07438 9.56688 9.38 10.1175 9.99125L10.9569 10.9244C11.0175 10.9919 11.0481 11.0256 11.0756 11.06C11.3309 11.3716 11.479 11.757 11.4981 12.1594C11.5 12.2031 11.5 12.2488 11.5 12.3394C11.5 12.4888 11.5 12.5631 11.4937 12.6256C11.4648 12.9124 11.3376 13.1804 11.1337 13.3841C10.9298 13.5879 10.6618 13.7149 10.375 13.7437C10.3125 13.75 10.2381 13.75 10.0894 13.75Z" stroke="#F70808" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.25 11.875H7.75M6.5 5.625V10" stroke="#F70808" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>`
    })
    return cards;
}
/*  */




generarCarruselTendencias();
// Funcion que le da funcionalidad a los carruseles (flechas)
function inicializarCarruseles() {
  const carruseles = document.querySelectorAll(".carrusel");
  const cards = document.querySelectorAll(".card-game-free");
//   console.log(carruseles);
//   console.log(cards);

  carruseles.forEach(carruselContainer => {
    const carrusel = carruselContainer.querySelector(".container-function-carrusel");
    const leftArrow = carruselContainer.querySelector(".left-arrow");
    const rightArrow = carruselContainer.querySelector(".right-arrow");

    if (!carrusel || !leftArrow || !rightArrow) return; // seguridad

    let scrollAmount = 0;
    const widthCard = cards[0]?.offsetWidth || 0; //ancho de la card
    // console.log("widthCard: ", widthCard);
    const cantCardsVisible = 6; //cantidad de cards visibles en el carrusel
    const step = widthCard * cantCardsVisible; //cantidad de pixeles que se va a mover el carrusel
    const maxScroll = carrusel.scrollWidth - carrusel.offsetWidth;
    // console.log("maxScroll: ", maxScroll);

    const updateArrows = () => {
      leftArrow.classList.toggle("disabled", scrollAmount === 0);
      rightArrow.classList.toggle("disabled", scrollAmount === maxScroll);
    };

    leftArrow.addEventListener("click", () => {
      scrollAmount -= step;
      if (scrollAmount < 0) scrollAmount = 0;
      carrusel.scrollTo({ left: scrollAmount, behavior: "smooth" });
      updateArrows();
    });

    rightArrow.addEventListener("click", () => {
      scrollAmount += step;
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
      carrusel.scrollTo({ left: scrollAmount, behavior: "smooth" });
      updateArrows();
    });

    updateArrows();
  });
}
// Funcion que pinta 1 o 1/2 estrella segun la puntuacion del juego
function getStarsHTML(rating) {
  let starsHTML = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Estrellas completas
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<svg class="star star-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14"><path d="M9.04883 4.78418L9.16504 5.03809L9.44238 5.07129L13.3291 5.54785L10.457 8.25293L10.2568 8.44141L10.3086 8.71191L11.0615 12.6006L7.65039 10.6797L7.40527 10.541L7.16016 10.6797L3.74902 12.6006L4.50195 8.71191L4.55371 8.44141L4.35352 8.25293L1.48047 5.54883L5.36816 5.07129L5.64551 5.03809L5.76172 4.78418L7.40527 1.19824L9.04883 4.78418Z"/></svg>';
  }

  // Media estrella
  if (hasHalfStar) {
    starsHTML += '<svg class="star star-half" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14"><defs><linearGradient id="half"><stop offset="50%" stop-color="var(--acento-color)" /><stop offset="50%" stop-color="transparent" /></linearGradient></defs><path fill="url(#half)" stroke="var(--acento-color)" d="M9.04883 4.78418L9.16504 5.03809L9.44238 5.07129L13.3291 5.54785L10.457 8.25293L10.2568 8.44141L10.3086 8.71191L11.0615 12.6006L7.65039 10.6797L7.40527 10.541L7.16016 10.6797L3.74902 12.6006L4.50195 8.71191L4.55371 8.44141L4.35352 8.25293L1.48047 5.54883L5.36816 5.07129L5.64551 5.03809L5.76172 4.78418L7.40527 1.19824L9.04883 4.78418Z"/></svg>';
  }

  // Estrellas vacías
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<svg class="star star-empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14"><path d="M9.04883 4.78418L9.16504 5.03809L9.44238 5.07129L13.3291 5.54785L10.457 8.25293L10.2568 8.44141L10.3086 8.71191L11.0615 12.6006L7.65039 10.6797L7.40527 10.541L7.16016 10.6797L3.74902 12.6006L4.50195 8.71191L4.55371 8.44141L4.35352 8.25293L1.48047 5.54883L5.36816 5.07129L5.64551 5.03809L5.76172 4.78418L7.40527 1.19824L9.04883 4.78418Z"/></svg>';
  }

  return starsHTML;
}


/* Funcion scroll*/
function scroll(){
    const carruseles = document.querySelectorAll(".container-function-carrusel");
// console.log(carruseles);
carruseles.forEach((carrusel, index) => {
  // console.log(carrusel);
  const puntos = carrusel
    .closest(".carrusel") // contenedor general (ajustá el selector si tu HTML usa otro nombre)
    .querySelectorAll(".indicadores-carrusel-cards-games span");
  // console.log(puntos);
  // Escuchamos el evento de scroll en cada carrusel
  carrusel.addEventListener("scroll", () => {
  // console.log("Estoy haciendo scrol")
  const scrollMaxCarrusel = carrusel.scrollWidth - carrusel.clientWidth;
  const scrollPosCarrusel = carrusel.scrollLeft;

  // Determinar el progreso del scroll entre 0 y 1
  const progreso = scrollPosCarrusel / scrollMaxCarrusel;

  // Como hay 3 puntos, cada uno representa un tercio del recorrido
  let indiceActivo;
  if (progreso < 0.33) {
    indiceActivo = 0; // primer punto
  } else if (progreso < 0.66) {
    indiceActivo = 1; // segundo punto
  } else {
    indiceActivo = 2; // tercer punto
  }

  // Actualizar los puntos
  puntos.forEach((punto, i) => {
    punto.classList.toggle("activo", i === indiceActivo);
  });
});
});
}


