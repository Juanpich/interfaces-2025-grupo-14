
// Cargar Header
fetch('../peg-solitaire/header.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#header').innerHTML = html;

    const script = document.createElement('script');
    script.src = '../peg-solitaire/header.js';
    script.onload = () => {
      if (window.initHeaderInteractions) {
        window.initHeaderInteractions(); // Ejecutar cuando el script esté listo
      }
    };
    document.body.appendChild(script);
  });

// Cargar HTML parcial de Peg Solitaire
fetch('../peg-solitaire/peg-solitaire.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#peg-solitaire').innerHTML = html;

    const script = document.createElement('script');
    script.src = '../peg-solitaire/peg-solitaire.js';
    script.onload = () => {
      if (window.initPegSolitaire) {
        window.initPegSolitaire(); // Ejecutar si definiste esa función
      }
    };
    document.body.appendChild(script);
  });
  //Cargar FatFooter 
  fetch('../fat-footer/index.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#fat-footer').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../fat-footer/script.js';
    document.body.appendChild(script);
  });
