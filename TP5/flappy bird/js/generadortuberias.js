(function (global) {
	class GeneradorTuberias {
		// opciones: {contenedor, separacionVerticalInicial=140, separacionHorizontalInicial=450, velocidadInicial=200, minSeparacion=90, minSeparacionHorizontal=220, factorDificultad=0.9995}
		constructor(opciones = {}) {
			this.contenedor = opciones.contenedor || document.getElementById('pipes-container');
			// separacion vertical inicial (hueco). Reducida para que al inicio no sea tan ancha.
			this.separacionVertical = opciones.separacionVerticalInicial ?? opciones.initialGap ?? 90;
			this.separacionHorizontal = opciones.separacionHorizontalInicial ?? opciones.initialSpacing ?? 250; // distancia horizontal entre pares
			this.velocidad = opciones.velocidadInicial ?? opciones.initialSpeed ?? 100; // px/s desplazamiento de las tuberias
			this.minSeparacion = opciones.minSeparacion ?? opciones.minGap ?? 90;
			this.minSeparacionHorizontal = opciones.minSeparacionHorizontal ?? opciones.minSpacing ?? 220;
			this.factorDificultad = opciones.factorDificultad ?? opciones.difficultyRamp ?? 0.9995; // factor aplicado por ms para aumentar dificultad
			this.tiempoDesdeUltimo = 0;
			this.tiempoTotal = 0;
			this.activas = [];
			this.anchoContenedor = this.contenedor ? this.contenedor.clientWidth : 1280;
			// altura minima que debe tener cada tubería (superior/inferior). Mantener simétrica con Tuberia.
			this.minAlturaTubo = opciones.minAlturaTubo ?? 30;
			this._siguienteIntervaloSpawn = this._calcularIntervaloSpawn();
		}

		// Calcula el intervalo (en segundos) entre apariciones según separacionHorizontal y velocidad
		_calcularIntervaloSpawn() {
			return Math.max(0.4, this.separacionHorizontal / Math.max(1, this.velocidad));
		}

		// Ajusta la velocidad y propaga a tuberías activas
		establecerVelocidad(pxPorSeg) {
			this.velocidad = pxPorSeg;
			for (const t of this.activas) t.establecerVelocidad(this.velocidad);
			this._siguienteIntervaloSpawn = this._calcularIntervaloSpawn();
		}

		// Actualizar generador y tuberías activas (dt en ms)
		actualizar(dt) {
			const segundos = dt / 1000;
			this.tiempoDesdeUltimo += segundos;
			this.tiempoTotal += segundos;

			// Dificultad: reducir separaciones poco a poco con el tiempo
			const factorPorSegundo = Math.pow(this.factorDificultad, dt);
			this.separacionHorizontal = Math.max(this.minSeparacionHorizontal, this.separacionHorizontal * factorPorSegundo);
			this.separacionVertical = Math.max(this.minSeparacion, this.separacionVertical * factorPorSegundoAGap(factorPorSegundo));

			// comprobar si corresponde generar otro par
			const intervalo = this._calcularIntervaloSpawn();
			if (this.tiempoDesdeUltimo >= intervalo) {
				this.tiempoDesdeUltimo -= intervalo;
				this._generarPar();
			}

			// actualizar cada tubería y eliminar las que salieron de pantalla
			for (let i = this.activas.length - 1; i >= 0; i--) {
				const tub = this.activas[i];
				tub.actualizar(dt);
				if (tub.fueraDePantalla()) {
					tub.destruir();
					this.activas.splice(i, 1);
				}
			}
		}

		// Genera un par de tuberías variando centroY para crear rachas altas/bajas
		_generarPar() {
			const margen = 30;
			// Calculamos min/max centro teniendo en cuenta la altura mínima requerida para cada tubo
			const alturaContenedor = this.contenedor ? this.contenedor.clientHeight : 360;
			const minCentro = Math.max(margen + this.separacionVertical / 2, this.minAlturaTubo + this.separacionVertical / 2);
			const maxCentro = Math.min(alturaContenedor - margen - this.separacionVertical / 2, alturaContenedor - this.minAlturaTubo - this.separacionVertical / 2);

			let centroY;
			const probExtremo = 0.18; // 18% de probabilidad de extremo
			if (Math.random() < probExtremo) {
				if (Math.random() < 0.5) centroY = minCentro + 10 + Math.random() * 40; // muy alto
				else centroY = maxCentro - 10 - Math.random() * 40; // muy bajo
			} else {
				const dispersion = Math.min((maxCentro - minCentro) / 2, 120 + this.tiempoTotal * 0.5);
				const medio = (minCentro + maxCentro) / 2;
				centroY = limitar(medio + (Math.random() - 0.5) * dispersion, minCentro, maxCentro);
			}

			const x = this.contenedor ? this.contenedor.clientWidth : 1280;
			const tub = new window.Tuberia({
				contenedor: this.contenedor,
				x: x,
				separacionVertical: Math.round(this.separacionVertical),
				centroY: Math.round(centroY),
				minAlturaTubo: this.minAlturaTubo,
				velocidad: this.velocidad
			});
			this.activas.push(tub);

			// pequeño incremento de velocidad por spawn para aumentar tensión
			this.velocidad *= 1 + 0.002; // +0.2% por tubería
			this.establecerVelocidad(this.velocidad);
		}

		// Devuelve el array de tuberías activas
		obtenerActivas() {
			return this.activas;
		}

		// Reinicia el generador a valores por defecto y destruye tuberías activas
		reiniciar() {
			for (const t of this.activas) t.destruir();
			this.activas = [];
			this.tiempoDesdeUltimo = 0;
			this.tiempoTotal = 0;
			this.separacionVertical = 900;
			this.separacionHorizontal = 100;
			this.velocidad = 200;
			this.establecerVelocidad(this.velocidad);
		}

		/* Alias en inglés por compatibilidad con código existente */
		_computeSpawnInterval() { return this._calcularIntervaloSpawn(); }
		setSpeed(v) { return this.establecerVelocidad(v); }
		update(dt) { return this.actualizar(dt); }
		getActive() { return this.obtenerActivas(); }
		reset() { return this.reiniciar(); }
	}

	// helpers en español
	function limitar(v, a, b) {
		return Math.max(a, Math.min(b, v));
	}

	// Convertimos el factor aplicado al "gap" para que disminuya un poco más rápido
	function factorPorSegundoAGap(factor) {
		return Math.max(0.992, factor * 1.0008);
	}

	global.GeneradorTuberias = GeneradorTuberias;
})(window);