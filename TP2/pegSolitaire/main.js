
  //Cargar FatFooter 
  fetch('../html/fat-footer.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#fat-footer').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../js/script.js';
    document.body.appendChild(script);
  });
