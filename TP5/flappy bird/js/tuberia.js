(function (global) {
	// Tuberia representa un par: una tubería superior y otra inferior.
	class Tuberia {
		// opciones: {contenedor, x, separacionVertical, centroY, ancho=90, altoTotal=360, velocidad=200}
		constructor(opciones = {}) {
			// propiedades públicas (nombres en español)
			this.contenedor = opciones.contenedor;
			this.posX = opciones.x ?? (this.contenedor ? this.contenedor.clientWidth : 1280);
			// distancia vertical entre tubos (hueco). Valor por defecto reducido para que no sea tan ancho al inicio.
			this.separacionVertical = opciones.separacionVertical ?? opciones.gap ?? 90;
			// altura mínima que debe tener cada segmento de tubo (superior/inferior) en pixels.
			this.minAlturaTubo = opciones.minAlturaTubo ?? 30;
			this.centroY = opciones.centroY ?? opciones.centerY ?? 180;
			this.ancho = opciones.ancho ?? opciones.width ?? 90;
			this.altoTotal = opciones.altoTotal ?? opciones.totalHeight ?? 360;
			this.velocidad = opciones.velocidad ?? opciones.speed ?? 150; // px/s

			// crear elementos DOM
			this.elemento = document.createElement('div');
			this.elemento.className = 'tuberia';
			this.elemento.style.width = this.ancho + 'px';
			this.elemento.style.height = this.altoTotal + 'px';
			this.elemento.style.left = this.posX + 'px';
			this.elemento.style.top = '0px';
			this.elemento.style.pointerEvents = 'none';

			// elemento superior e inferior
			this.elementoSuperior = document.createElement('div');
			this.elementoSuperior.className = 'tuberia-arriba';
			this.elementoInferior = document.createElement('div');
			this.elementoInferior.className = 'tuberia-abajo';

			this.elemento.appendChild(this.elementoSuperior);
			this.elemento.appendChild(this.elementoInferior);

			// aplicar layout inicial
			this._aplicarLayout();

			// anexar al contenedor si existe
			if (this.contenedor) this.contenedor.appendChild(this.elemento);
		}

		// Calcula y aplica las posiciones/alturas de las partes superior e inferior según centroY y separacionVertical
		_aplicarLayout() {
			const mitadHueco = this.separacionVertical / 2;
			// Evitar que la tubería superior o inferior tenga altura < minAlturaTubo.
			// Ajustamos centroY para que ambas partes tengan al menos minAlturaTubo píxeles.
			const minCentro = this.minAlturaTubo + mitadHueco;
			const maxCentro = this.altoTotal - this.minAlturaTubo - mitadHueco;
			// limitar centroY al rango válido
			this.centroY = Math.round(Math.max(minCentro, Math.min(this.centroY, maxCentro)));

			const alturaSuperior = Math.max(0, Math.round(this.centroY - mitadHueco));
			const topInferior = Math.min(this.altoTotal, Math.round(this.centroY + mitadHueco));
			const alturaInferior = Math.max(0, this.altoTotal - topInferior);

			this.elementoSuperior.style.top = '0px';
			this.elementoSuperior.style.height = alturaSuperior + 'px';
			this.elementoSuperior.style.left = '0px';
			this.elementoSuperior.style.width = '100%';

			this.elementoInferior.style.top = topInferior + 'px';
			this.elementoInferior.style.height = alturaInferior + 'px';
			this.elementoInferior.style.left = '0px';
			this.elementoInferior.style.width = '100%';
		}

		// Actualiza la posición horizontal según dt (ms)
		actualizar(dt) {
			const segundos = dt / 1000;
			this.posX -= this.velocidad * segundos;
			this.elemento.style.left = Math.round(this.posX) + 'px';
		}

		// Devuelve true si la tubería ya salió completamente de la pantalla
		fueraDePantalla() {
			return (this.posX + this.ancho) < 0;
		}

		// Devuelve la coordenada derecha (útil para puntaje)
		derecha() {
			return this.posX + this.ancho;
		}

		// Elimina el elemento DOM asociado
		destruir() {
			if (this.elemento && this.elemento.parentNode) {
				this.elemento.parentNode.removeChild(this.elemento);
			}
		}

		// Ajusta la velocidad horizontal de la tubería (px/s)
		establecerVelocidad(pxPorSeg) {
			this.velocidad = pxPorSeg;
		}

		/* 
			Alias en inglés para compatibilidad con código existente.
			Se mantienen para evitar romper referencias desde otros módulos.
		*/
		update(dt) { return this.actualizar(dt); }
		isOffScreen() { return this.fueraDePantalla(); }
		destroy() { return this.destruir(); }
		setSpeed(v) { return this.establecerVelocidad(v); }
		getRight() { return this.derecha(); }
	}

	global.Tuberia = Tuberia;
})(window);