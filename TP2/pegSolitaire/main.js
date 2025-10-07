
  //Cargar FatFooter 
  fetch('../fat-footer/index.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#fat-footer').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../fat-footer/script.js';
    document.body.appendChild(script);
  });
