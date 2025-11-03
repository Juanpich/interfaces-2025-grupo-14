class TableroVista {
    constructor(canvas, tablero, fichaSeleccionada) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tablero = tablero;
        this.tamanioCelda = canvas.width / 7;
        this.imgFichasUrl = [fichaSeleccionada];
        this.imgFichas = [];
        this.destinosValidos = [];
        this.movimientos = 0;


        this.fondo = new Image();
        this.fondo.src = "../pegSolitaire/img-peg/fondo.png";
        this.fondoCargado = false;
        this.fondo.onload = () => {
            this.fondoCargado = true;
            this.cargarImagenesFichas();
            this.dibujar();
        };

        this.onMouseDown = null;
        this.onMouseMove = null;
        this.onMouseUp = null;

        canvas.addEventListener('mousedown', e => this.onMouseDown?.(e));
        canvas.addEventListener('mousemove', e => this.onMouseMove?.(e));
        canvas.addEventListener('mouseup', e => this.onMouseUp?.(e));
    }

    cargarImagenesFichas() {
        for (let url of this.imgFichasUrl) {
            const imgF = new Image();
            imgF.src = url;
            imgF.onload = () => {
                this.imgFichas.push(imgF);
                this.dibujar();
            };
        }
    }

    obtenerCeldaDesdeEvento(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        return {
            fila: Math.floor(y / this.tamanioCelda),
            col: Math.floor(x / this.tamanioCelda)
        };
    }

    setDestinosValidos(destinos) {
        this.destinosValidos = destinos;
    }

    setMovimientos(valor) {
        this.movimientos = valor;
        this.dibujarContador();
    }

    dibujar(fichaArrastrada = null, offset = null, arrastreX = null, arrastreY = null) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fondo
        if (this.fondoCargado)
            ctx.drawImage(this.fondo, 0, 0, this.canvas.width, this.canvas.height);

        // Tablero y fichas
        for (let fila = 0; fila < 7; fila++) {
            for (let col = 0; col < 7; col++) {
                const estado = this.tablero.estado[fila][col];
                const ficha = this.tablero.obtenerFicha(fila, col);
                const x = col * this.tamanioCelda;
                const y = fila * this.tamanioCelda;

                ctx.strokeStyle = "#999";
                ctx.strokeRect(x, y, this.tamanioCelda, this.tamanioCelda);

                // Casillas inactivas
                if (estado === -1) {
                    ctx.fillStyle = "#0000006e";
                    ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);
                }

                // Posiciones destino válidas
                if (this.destinosValidos.some(d => d.fila === fila && d.col === col)) {
                    ctx.fillStyle = "rgba(0, 255, 0, 0.25)";
                    ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);
                }

                // Dibujar fichas activas (excepto la que se arrastra)
                if (ficha?.estaActiva() && ficha !== fichaArrastrada) {
                    this.dibujarFicha(x, y, false, ficha);
                }
            }
        }

        // Dibujar ficha arrastrada (si existe)
        if (fichaArrastrada && arrastreX !== null && arrastreY !== null) {
            this.dibujarFicha(arrastreX - offset.x, arrastreY - offset.y, true, fichaArrastrada);
        }

        // Mostrar contador / tiempo
        this.dibujarContador();
    }

    dibujarFicha(x, y, seleccionada, ficha) {
        const cx = x + this.tamanioCelda / 2;
        const cy = y + this.tamanioCelda / 2;
        const radio = this.tamanioCelda / 3;

        let indiceImg = ficha.getIndiceImg();
        if (this.imgFichas.length === this.imgFichasUrl.length && indiceImg === -1) {
            ficha.setIndiceImg(Math.floor(Math.random() * this.imgFichas.length));
            indiceImg = ficha.getIndiceImg();
        }
        const img = this.imgFichas[indiceImg];

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radio, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.clip();

        if (img) this.ctx.drawImage(img, cx - radio, cy - radio, radio * 2, radio * 2);
        else {
            this.ctx.fillStyle = '#34577dff';
            this.ctx.fill();
        }

        this.ctx.restore();

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = seleccionada ? '#ff0000' : '#000';
        this.ctx.lineWidth = seleccionada ? 3 : 1;
        this.ctx.stroke();
    }

    dibujarContador() {
        const ctx = this.ctx;
        ctx.save();

        const padding = 15;
        const alto = 40;
        const radio = 12;
        const separacion = 30;

        
        // MOVIMIENTOS (lado izquierdo)
        const movAncho = 180;
        const movX = padding;
        const movY = padding;

        let gradMov = ctx.createLinearGradient(movX, movY, movX, movY + alto);
        gradMov.addColorStop(0, "rgba(10, 25, 47, 0.9)");
        gradMov.addColorStop(1, "rgba(20, 35, 70, 0.8)");
        ctx.fillStyle = gradMov;
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(movX + radio, movY);
        ctx.lineTo(movX + movAncho - radio, movY);
        ctx.quadraticCurveTo(movX + movAncho, movY, movX + movAncho, movY + radio);
        ctx.lineTo(movX + movAncho, movY + alto - radio);
        ctx.quadraticCurveTo(movX + movAncho, movY + alto, movX + movAncho - radio, movY + alto);
        ctx.lineTo(movX + radio, movY + alto);
        ctx.quadraticCurveTo(movX, movY + alto, movX, movY + alto - radio);
        ctx.lineTo(movX, movY + radio);
        ctx.quadraticCurveTo(movX, movY, movX + radio, movY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 20px 'Poppins'";
        ctx.fillStyle = "#00e5ff";
        ctx.textAlign = "left";
        ctx.fillText(`Movimientos: ${this.movimientos}`, movX + 15, movY + 28);

        
        //TIEMPO (lado derecho)
        const tiempoAncho = 130;
        const tiempoX = this.canvas.width - tiempoAncho - padding - separacion; // <- separacion añadida
        const tiempoY = padding;

        let gradTiempo = ctx.createLinearGradient(tiempoX, tiempoY, tiempoX, tiempoY + alto);
        gradTiempo.addColorStop(0, "rgba(10, 25, 47, 0.9)");
        gradTiempo.addColorStop(1, "rgba(20, 35, 70, 0.8)");
        ctx.fillStyle = gradTiempo;
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(tiempoX + radio, tiempoY);
        ctx.lineTo(tiempoX + tiempoAncho - radio, tiempoY);
        ctx.quadraticCurveTo(tiempoX + tiempoAncho, tiempoY, tiempoX + tiempoAncho, tiempoY + radio);
        ctx.lineTo(tiempoX + tiempoAncho, tiempoY + alto - radio);
        ctx.quadraticCurveTo(tiempoX + tiempoAncho, tiempoY + alto, tiempoX + tiempoAncho - radio, tiempoY + alto);
        ctx.lineTo(tiempoX + radio, tiempoY + alto);
        ctx.quadraticCurveTo(tiempoX, tiempoY + alto, tiempoX, tiempoY + alto - radio);
        ctx.lineTo(tiempoX, tiempoY + radio);
        ctx.quadraticCurveTo(tiempoX, tiempoY, tiempoX + radio, tiempoY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Color y efectos del tiempo
        const tiempoTexto = this.temporizador?.obtenerTiempoFormateado() || "00:00";
        const tiempoActual = this.temporizador?.tiempoActual || 0;

        const colorCeleste = { r: 0, g: 230, b: 255 };
        const colorRojo = { r: 255, g: 50, b: 50 };

        const factor = Math.max(0, Math.min(1, (10 - tiempoActual) / 10));
        const r = Math.round(colorCeleste.r + (colorRojo.r - colorCeleste.r) * factor);
        const g = Math.round(colorCeleste.g + (colorRojo.g - colorCeleste.g) * factor);
        const b = Math.round(colorCeleste.b + (colorRojo.b - colorCeleste.b) * factor);

        const pulso = 1 + 0.1 * Math.sin(Date.now() / 300);
        const fontSize = 22 * pulso;
        const colorFinal = `rgb(${r}, ${g}, ${b})`;

        ctx.font = `bold ${fontSize}px 'Poppins'`;
        ctx.fillStyle = colorFinal;
        ctx.textAlign = "center";
        ctx.shadowColor = colorFinal;
        ctx.shadowBlur = 10;

        ctx.fillText(tiempoTexto, tiempoX + tiempoAncho / 2, tiempoY + 28);

        ctx.restore();
    }

    // VICTORIA
    mostrarCartelVictoria(onReiniciar, onVolver) {
        this._mostrarCartel({
            titulo: "¡Ganaste el juego!",
            subtitulo: `Lo lograste en ${this.movimientos} movimientos`,
            color: "#00e5ff", // celeste
            esVictoria: true,
            onReiniciar,
            onVolver
        });
    }

    // DERROTA - sin movimientos
    mostrarCartelDerrotaMovimientos(onReiniciar, onVolver) {
        this._mostrarCartel({
            titulo: "No quedan movimientos",
            subtitulo: `Movimientos realizados: ${this.movimientos}`,
            color: "#ff5252", // rojo
            esVictoria: false,
            onReiniciar,
            onVolver
        });
    }

    // DERROTA - por tiempo
    mostrarCartelDerrotaTiempo(onReiniciar, onVolver) {
        this._mostrarCartel({
            titulo: "¡Se acabó el tiempo!",
            subtitulo: `Lograste ${this.movimientos} movimientos antes del final.`,
            color: "#ff5252",
            esVictoria: false,
            onReiniciar,
            onVolver
        });
    }

    // ------------------------------------------------------------
    // FUNCIÓN BASE - dibuja el cartel visualmente
    // ------------------------------------------------------------
    _mostrarCartel({ titulo, subtitulo, color, esVictoria, onReiniciar, onVolver }) {
        const ctx = this.ctx;
        const { width, height } = this.canvas;
        let alpha = 0;
        let visible = true;

        const cuadroW = 460, cuadroH = 260;
        const x = (width - cuadroW) / 2;
        const y = (height - cuadroH) / 2;
        const btnW = 180, btnH = 48;

        const btn1 = { x: width / 2 - btnW - 15, y: y + 140, w: btnW, h: btnH, texto: "🔄 Volver a jugar" };
        const btn2 = { x: width / 2 + 15, y: y + 140, w: btnW, h: btnH, texto: "🏠 Volver al inicio" };
        const botones = [btn1, btn2];
        let mousePos = { x: 0, y: 0 };

        const colorFondo = esVictoria ? "rgba(15, 23, 42, 0.9)" : "rgba(40, 10, 10, 0.85)";

        const dibujarCartel = () => {
            ctx.save();
            ctx.clearRect(0, 0, width, height);
            this.dibujar();
            ctx.globalAlpha = alpha;

            // Fondo oscuro translúcido
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(0, 0, width, height);

            // Panel central
            const grad = ctx.createLinearGradient(x, y, x + cuadroW, y + cuadroH);
            grad.addColorStop(0, colorFondo);
            grad.addColorStop(1, "rgba(10, 15, 30, 0.95)");
            ctx.fillStyle = grad;

            const glow = 0.7 + 0.3 * Math.sin(Date.now() / 400);
            ctx.strokeStyle = `${color}`;
            ctx.lineWidth = 4;
            ctx.fillRect(x, y, cuadroW, cuadroH);
            ctx.strokeRect(x, y, cuadroW, cuadroH);

            // Título
            ctx.font = "bold 28px 'Poppins'";
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.shadowColor = color;
            ctx.shadowBlur = esVictoria ? 15 : 8;
            ctx.fillText(titulo, width / 2, y + 65);

            // Subtítulo
            ctx.shadowBlur = 0;
            ctx.font = "18px 'Poppins'";
            ctx.fillStyle = "#e2e8f0";
            ctx.fillText(subtitulo, width / 2, y + 100);

            // Botones
            botones.forEach(b => {
                const hovered = mousePos.x >= b.x && mousePos.x <= b.x + b.w &&
                    mousePos.y >= b.y && mousePos.y <= b.y + b.h;
                ctx.fillStyle = hovered ? "rgba(15,23,42,0.8)" : "rgba(10,15,30,0.9)";
                ctx.strokeStyle = hovered ? color : "#64ffda";
                ctx.lineWidth = 2;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                ctx.strokeRect(b.x, b.y, b.w, b.h);

                ctx.font = "16px 'Poppins'";
                ctx.fillStyle = hovered ? color : "#64ffda";
                ctx.fillText(b.texto, b.x + b.w / 2, b.y + b.h / 1.7);
            });

            ctx.restore();

            // Animación fade-in/out
            if (visible && alpha < 1) alpha += 0.03;
            else if (!visible && alpha > 0) alpha -= 0.05;

            if (alpha > 0) requestAnimationFrame(dibujarCartel);
        };

        const moveHandler = e => {
            const rect = this.canvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
        };

        const clickHandler = e => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            if (mx >= btn1.x && mx <= btn1.x + btn1.w && my >= btn1.y && my <= btn1.y + btn1.h) {
                cerrarConAnimacion(onReiniciar);
            } else if (mx >= btn2.x && mx <= btn2.x + btn2.w && my >= btn2.y && my <= btn2.y + btn2.h) {
                cerrarConAnimacion(onVolver);
            }
        };

        const cerrarConAnimacion = callback => {
            visible = false;
            setTimeout(() => {
                limpiarEventos();
                callback();
            }, 600);
        };

        const limpiarEventos = () => {
            this.canvas.removeEventListener("click", clickHandler);
            this.canvas.removeEventListener("mousemove", moveHandler);
        };

        this.canvas.addEventListener("click", clickHandler);
        this.canvas.addEventListener("mousemove", moveHandler);
        dibujarCartel();
    }

}