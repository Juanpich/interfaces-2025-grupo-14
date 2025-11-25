(function (global) {
	class GeneradorTuberias {
		constructor(opciones = {}) {
			this.contenedor = opciones.contenedor || document.getElementById('pipes-container');
			this.pajaro = opciones.pajaro || null; // referencia al pájaro para detección de colisión

			// Configuración inicial de separaciones
			this.separacionVertical = opciones.separacionVerticalInicial ?? 140;
			this.separacionHorizontal = opciones.separacionHorizontalInicial ?? 450;
			this.velocidad = opciones.velocidadInicial ?? 120;

			// Límites mínimos
			this.minSeparacion = opciones.minSeparacion ?? 90;
			this.minSeparacionHorizontal = opciones.minSeparacionHorizontal ?? 220;
			this.factorDificultad = opciones.factorDificultad ?? 0.9999;

			// Control de tiempo
			this.tiempoDesdeUltimo = 0;
			this.tiempoTotal = 0;

			// Tuberías activas
			this.activas = [];

			// Dimensiones
			this.anchoContenedor = this.contenedor ? this.contenedor.clientWidth : 1280;
			this.altoContenedor = this.contenedor ? this.contenedor.clientHeight : 360;
			this.minAlturaTubo = opciones.minAlturaTubo ?? 30;

			// Audio
			this.audioChoque = new Audio("./../audio/choque.mp3");

			// Control del bucle
			this._stopLoop = false;
			this._siguienteIntervaloSpawn = this._calcularIntervaloSpawn();
		}

		 iniciarGeneracion() {
        // Establecer el tiempo como si ya hubiera pasado el intervalo
        this._siguienteIntervaloSpawn = this._calcularIntervaloSpawn();
        this.tiempoDesdeUltimo = this._siguienteIntervaloSpawn;

       
    }
		

		// Calcula el intervalo entre apariciones según separación y velocidad
		_calcularIntervaloSpawn() {
			return Math.max(0.4, this.separacionHorizontal / Math.max(1, this.velocidad));
		}

		// Establece la velocidad y la propaga a todas las tuberías activas
		establecerVelocidad(pxPorSeg) {
			this.velocidad = pxPorSeg;
			for (const t of this.activas) {
				t.establecerVelocidad(this.velocidad);
			}
			this._siguienteIntervaloSpawn = this._calcularIntervaloSpawn();
		}

		// Actualiza el generador y todas las tuberías (dt en milisegundos)
		actualizar(dt) {
			const segundos = dt / 1000;
			this.tiempoDesdeUltimo += segundos;
			this.tiempoTotal += segundos;

			// Incrementar dificultad progresivamente
			const factorPorSegundo = Math.pow(this.factorDificultad, dt);
			this.separacionHorizontal = Math.max(
				this.minSeparacionHorizontal,
				this.separacionHorizontal * factorPorSegundo
			);
			this.separacionVertical = Math.max(
				this.minSeparacion,
				this.separacionVertical * factorPorSegundoAGap(factorPorSegundo)
			);

			// Generar nuevo par si corresponde
			const intervalo = this._calcularIntervaloSpawn();
			if (this.tiempoDesdeUltimo >= intervalo) {
				this.tiempoDesdeUltimo -= intervalo;
				this._generarPar();
			}

			// Actualizar cada tubería
			for (let i = this.activas.length - 1; i >= 0; i--) {
				const tub = this.activas[i];
				tub.actualizar(dt);

				// Verificar colisión con el pájaro
				if (this.pajaro && !this.pajaro.invincible) {
					if (this._verificarColision(tub)) {
						this.audioChoque.play();
						this.pajaro.hitPipe();
					}
				}

				// Verificar si el pájaro pasó la tubería (para sumar puntos)
				if (!tub.pasada && this.pajaro) {
					const pajaroX = this.pajaro.bird.offsetLeft;
					if (tub.derecha() < pajaroX) {
						tub.pasada = true;
						document.dispatchEvent(new Event("pipe-passed"));
					}
				}

				// Eliminar tuberías fuera de pantalla
				if (tub.fueraDePantalla()) {
					tub.destruir();
					this.activas.splice(i, 1);
					if (tub.objeto_especial) {
						tub.objeto_especial.remove();
					}
				}
				// Colisión con objeto especial
				if (tub.objeto_especial && this.pajaro) {
					if (this._colisionCirculoRectangulo(this.pajaro.getCircle(), tub.objeto_especial.getBoundingClientRect())) {

						// moneda
						if (tub.objeto_especial.classList.contains("moneda")) {
							document.dispatchEvent(new Event("coin-collected"));
						}

						// corazón
						if (tub.objeto_especial.classList.contains("heart-game")) {
							document.dispatchEvent(new Event("heart-collected"));
						}

						tub.objeto_especial.remove();
						tub.objeto_especial = null;
					}
				}

			}
		}

		// Genera un nuevo par de tuberías
		_generarPar() {
			const margen = 30;
			const minCentro = Math.max(
				margen + this.separacionVertical / 2,
				this.minAlturaTubo + this.separacionVertical / 2
			);
			const maxCentro = Math.min(
				this.altoContenedor - margen - this.separacionVertical / 2,
				this.altoContenedor - this.minAlturaTubo - this.separacionVertical / 2
			);

			// Generar posición Y con variación (rachas altas/bajas)
			let centroY;
			const probExtremo = 0.18;
			if (Math.random() < probExtremo) {
				if (Math.random() < 0.5) {
					centroY = minCentro + 10 + Math.random() * 40; // muy alto
				} else {
					centroY = maxCentro - 10 - Math.random() * 40; // muy bajo
				}
			} else {
				const dispersion = Math.min((maxCentro - minCentro) / 2, 120 + this.tiempoTotal * 0.5);
				const medio = (minCentro + maxCentro) / 2;
				centroY = limitar(medio + (Math.random() - 0.5) * dispersion, minCentro, maxCentro);
			}


			const x = this.anchoContenedor;
			const tub = new global.Tuberia({
				contenedor: this.contenedor,
				x: x,
				separacionVertical: Math.round(this.separacionVertical),
				centroY: Math.round(centroY),
				minAlturaTubo: this.minAlturaTubo,
				velocidad: this.velocidad,
				altoTotal: this.altoContenedor

			});
			// 30% prob moneda, 10% corazón, resto sin nada
			let objeto = null;
			const r = Math.random();

			if (r < 0.20) { // moneda
				objeto = this._crearObjetoEspecial("heart", tub);
			}
			else if (r < 0.60) { // corazón
				objeto = this._crearObjetoEspecial("coin", tub);
			}

			tub.objeto_especial = objeto;

			tub.pasada = false; // marcar si ya se contó el punto
			this.activas.push(tub);

			// Incremento gradual de velocidad
			this.velocidad *= 0.990;
			this.establecerVelocidad(this.velocidad);
		}
		_crearObjetoEspecial(tipo, tuberia) {
			const obj = document.createElement("div");
			obj.classList.add("objeto-especial");

			if (tipo === "coin") {
				obj.classList.add("moneda");
				obj.style.width = "46px";
				obj.style.height = "42px";
				
				obj.style.animation = "rotate-coin .8s steps(6) infinite";
			}
			else if (tipo === "heart") {
				obj.classList.add("heart-game");
				obj.style.width = "44.9px";
				obj.style.height = "46px";
				
			}

			obj.style.position = "absolute";

			// posición inicial igual a la tubería
			obj.style.left = tuberia.posX + "px";
			obj.style.top = (tuberia.centroY - (tipo === "coin" ? 20 : 16)) + "px";

			this.contenedor.appendChild(obj);

			return obj;
		}


		// Verifica colisión circular entre el pájaro y una tubería
		_verificarColision(tuberia) {
			if (!this.pajaro) return false;

			const circuloPajaro = this.pajaro.getCircle();
			const rectSuperior = tuberia.elementoSuperior.getBoundingClientRect();
			const rectInferior = tuberia.elementoInferior.getBoundingClientRect();

			return (
				this._colisionCirculoRectangulo(circuloPajaro, rectSuperior) ||
				this._colisionCirculoRectangulo(circuloPajaro, rectInferior)
			);
		}

		// Detecta colisión entre un círculo y un rectángulo
		_colisionCirculoRectangulo(circulo, rect) {
			const closestX = Math.max(rect.left, Math.min(circulo.x, rect.right));
			const closestY = Math.max(rect.top, Math.min(circulo.y, rect.bottom));

			const dx = circulo.x - closestX;
			const dy = circulo.y - closestY;

			return (dx * dx + dy * dy) < (circulo.r * circulo.r);
		}

		// Devuelve el array de tuberías activas
		obtenerActivas() {
			return this.activas;
		}

		// Detiene el generador
		detener() {
			this._stopLoop = true;
			for (const t of this.activas) {
				t.destruir();
			}
			this.activas = [];
		}

		// Reinicia el generador a valores iniciales
		reiniciar() {
			this.detener();
			this._stopLoop = false;
			this.tiempoDesdeUltimo = 0;
			this.tiempoTotal = 0;
			this.separacionVertical = 140;
			this.separacionHorizontal = 450;
			this.velocidad = 200;
			this.establecerVelocidad(this.velocidad);
		}

		// Establece la referencia al pájaro para colisiones
		setPajaro(pajaro) {
			this.pajaro = pajaro;
		}

		/* Alias en inglés para compatibilidad */
		setSpeed(v) { return this.establecerVelocidad(v); }
		update(dt) { return this.actualizar(dt); }
		getActive() { return this.obtenerActivas(); }
		reset() { return this.reiniciar(); }
		stop() { return this.detener(); }
		setBird(bird) { return this.setPajaro(bird); }
	}

	// Funciones auxiliares
	function limitar(v, a, b) {
		return Math.max(a, Math.min(b, v));
	}

	function factorPorSegundoAGap(factor) {
		return Math.max(0.999, factor * 1.0009);
	}

	global.GeneradorTuberias = GeneradorTuberias;
})(window); 