const canvas = document.getElementById('tablero');
  const tablero = new Tablero();
  const vista = new TableroVista(canvas, tablero);
  const controlador = new TableroControlador(tablero, vista);
