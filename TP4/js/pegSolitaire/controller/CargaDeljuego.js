class Cargado {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Botón principal
        this.boton = { x: canvas.width / 2 - 90, y: canvas.height - 90, w: 180, h: 55 };

        this.alpha = 0;
        this.enTransicion = false;
        this.colorAnim = 0;

        // Opciones de fichas
        this.opcionesFichas = [
            { nombre: "Roja", img: "../pegSolitaire//img-peg/ficha_rojo.png" },
            { nombre: "Amarilla", img: "../pegSolitaire/img-peg/ficha_amarillo.png" },
            { nombre: "Verde", img: "../pegSolitaire/img-peg/ficha_verde.png" },
        ];
        this.fichaSeleccionada = 0;
        this.imagenesCargadas = {};

        // Modos de juego
        this.modos = ["Contra Reloj", "Modo Libre"];
        this.modoSeleccionado = 0;
        this.tiempoContraReloj = 60;

        // Imagen de fondo
        this.fondo = new Image();
        this.fondo.src = "../pegSolitaire/img-peg/fondoLoading.jpg"; // <- tu imagen de fondo

        this.precargarImagenes(() => {
            this.canvas.addEventListener("click", (e) => this.detectarClick(e));
            this.animarPantalla();
        });
    }

    precargarImagenes(callback) {
        let cargadas = 0;
        const total = this.opcionesFichas.length;
        this.opcionesFichas.forEach(op => {
            const img = new Image();
            img.src = op.img;
            img.onload = () => {
                this.imagenesCargadas[op.img] = img;
                cargadas++;
                if (cargadas === total) callback();
            };
        });
    }

    animarPantalla() {
        this.dibujarPantallaCarga();
        this.colorAnim += 0.02;
        if (this.alpha < 1 && !this.enTransicion) this.alpha += 0.02;
        requestAnimationFrame(() => this.animarPantalla());
    }

    dibujarPantallaCarga() {
        const { ctx, canvas } = this;
        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.fondo.complete) {
            const imgRatio = this.fondo.width / this.fondo.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth, drawHeight, drawX, drawY;

            if (canvasRatio > imgRatio) {
                // Canvas más ancho → escalar por ancho
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                drawX = 0;
                drawY = (canvas.height - drawHeight) / 2;
            } else {
                // Canvas más alto → escalar por alto
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
                drawX = (canvas.width - drawWidth) / 2;
                drawY = 0;
            }

            ctx.drawImage(this.fondo, drawX, drawY, drawWidth, drawHeight);
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#0a192f";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        

        // Título
        ctx.fillStyle = "#00f5e9";
        ctx.font = "bold 34px 'Poppins'";
        ctx.textAlign = "center";
        ctx.shadowColor = "#00f5e9";
        ctx.shadowBlur = 10;
        ctx.fillText("🧩 SENKU - PEG SOLITAIRE", canvas.width / 2, 70);
        ctx.shadowBlur = 0;

        // Cuadro de instrucciones
        const cuadro = { x: 80, y: 110, w: 490, h: 150 };
        ctx.fillStyle = "rgba(10, 25, 47, 0.85)";
        this.roundRect(ctx, cuadro.x, cuadro.y, cuadro.w, cuadro.h, 15);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(0,245,233,0.4)";
        ctx.stroke();

        ctx.fillStyle = "#e6f1ff";
        ctx.font = "15px 'Consolas'";
        ctx.textAlign = "left";
        const instrucciones = [
            "🎯 Quedate con una sola ficha.",
            "🖱️ Saltá una ficha para mover.",
            "💨 La del medio desaparece.",
            "🏁 Sin más saltos, fin del juego."
        ];
        let y = cuadro.y + 35;
        for (const linea of instrucciones) {
            ctx.fillText(linea, cuadro.x + 25, y);
            y += 28;
        }

        // Selección de ficha
        ctx.font = "20px 'Segoe UI'";
        ctx.fillStyle = "#64ffda";
        ctx.textAlign = "center";
        ctx.fillText("Elegí tu ficha:", canvas.width / 2, 290);

        const espacio = 120;
        const inicioX = canvas.width / 2 - espacio;
        this.opcionesFichas.forEach((op, i) => {
            const x = inicioX + i * espacio;
            const y = 350;
            const radio = 35;
            const img = this.imagenesCargadas[op.img];

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, radio, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x - radio, y - radio, radio * 2, radio * 2);
            ctx.restore();

            ctx.lineWidth = (i === this.fichaSeleccionada) ? 4 : 2;
            ctx.strokeStyle = (i === this.fichaSeleccionada)
                ? `rgba(0,245,233,${0.8 + 0.2 * Math.sin(Date.now() / 200)})`
                : "#a0a0a0";
            ctx.beginPath();
            ctx.arc(x, y, radio, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.font = "15px 'Poppins'";
            ctx.fillStyle = "#d8dee9";
            ctx.fillText(op.nombre, x, y + 55);
        });

        // Modo de juego
        ctx.font = "20px 'Segoe UI'";
        ctx.fillStyle = "#64ffda";
        ctx.fillText("Modo de juego:", canvas.width / 2, 440);

        const modoY = 460;
        const anchoBoton = 170;
        const altoBoton = 40;

        this.btnContraReloj = { x: canvas.width / 2 - anchoBoton - 15, y: modoY, w: anchoBoton, h: altoBoton };
        this.btnLibre = { x: canvas.width / 2 + 15, y: modoY, w: anchoBoton, h: altoBoton };

        this.dibujarBoton(ctx, this.btnContraReloj, "Contra Reloj", this.modoSeleccionado === 0);
        this.dibujarBoton(ctx, this.btnLibre, "Modo Libre", this.modoSeleccionado === 1);

        // Control de tiempo solo si está en contrarreloj
        if (this.modoSeleccionado === 0) {
            ctx.font = "18px 'Poppins'";
            ctx.fillStyle = "#b6eaff";
            ctx.fillText("Tiempo: " + this.tiempoContraReloj + "s", canvas.width / 2, 525);

            // Botones + / −
            const separacionExtra = 25;
            const yBoton = 505;
            this.btnMenos = { x: canvas.width / 2 - 80 - separacionExtra, y: yBoton, w: 35, h: 35 };
            this.btnMas = { x: canvas.width / 2 + 50 + separacionExtra, y: yBoton, w: 35, h: 35 };
            this.dibujarMiniBoton(ctx, this.btnMenos, "-");
            this.dibujarMiniBoton(ctx, this.btnMas, "+");
        }

        // Botón principal
        const b = this.boton;
        const brilloBoton = (Math.sin(this.colorAnim * 2) + 1) / 2;
        const colorBoton = `rgba(0,245,233,${0.7 + brilloBoton * 0.3})`;

        ctx.fillStyle = colorBoton;
        ctx.shadowColor = "#00f5e9";
        ctx.shadowBlur = 15;
        this.roundRect(ctx, b.x, b.y, b.w, b.h, 12);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#64ffda";
        ctx.lineWidth = 2;
        this.roundRect(ctx, b.x, b.y, b.w, b.h, 12);
        ctx.stroke();

        ctx.fillStyle = "#0a192f";
        ctx.font = "bold 22px 'Poppins'";
        ctx.textAlign = "center";
        ctx.fillText("Empezar", canvas.width / 2, b.y + 35);

        ctx.restore();
    }

    dibujarBoton(ctx, b, texto, activo) {
        ctx.save();
        const color = activo ? "#00f5e9" : "#1b354a";
        ctx.fillStyle = color;
        ctx.shadowColor = activo ? "#00f5e9" : "transparent";
        ctx.shadowBlur = activo ? 10 : 0;
        this.roundRect(ctx, b.x, b.y, b.w, b.h, 10);
        ctx.fill();

        ctx.fillStyle = activo ? "#001c26" : "#b6eaff";
        ctx.font = "bold 18px 'Poppins'";
        ctx.textAlign = "center";
        ctx.fillText(texto, b.x + b.w / 2, b.y + 25);
        ctx.restore();
    }

    dibujarMiniBoton(ctx, b, texto) {
        ctx.save();
        ctx.fillStyle = "#00f5e9";
        ctx.shadowColor = "#00f5e9";
        ctx.shadowBlur = 6;
        this.roundRect(ctx, b.x, b.y, b.w, b.h, 8);
        ctx.fill();

        ctx.fillStyle = "#00141f";
        ctx.font = "bold 18px 'Poppins'";
        ctx.textAlign = "center";
        ctx.fillText(texto, b.x + b.w / 2, b.y + b.h / 2 + 5);
        ctx.restore();
    }

    detectarClick(e) {
        if (this.enTransicion) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Fichas
        const espacio = 120;
        const inicioX = this.canvas.width / 2 - espacio;
        this.opcionesFichas.forEach((_, i) => {
            const fx = inicioX + i * espacio;
            const fy = 350;
            const radio = 38;
            if (Math.hypot(x - fx, y - fy) < radio) this.fichaSeleccionada = i;
        });

        // Modos
        if (this.enRect(x, y, this.btnContraReloj)) this.modoSeleccionado = 0;
        if (this.enRect(x, y, this.btnLibre)) this.modoSeleccionado = 1;

        // + / −
        if (this.modoSeleccionado === 0) {
            if (this.enRect(x, y, this.btnMas)) this.tiempoContraReloj = Math.min(this.tiempoContraReloj + 15, 300);
            if (this.enRect(x, y, this.btnMenos)) this.tiempoContraReloj = Math.max(this.tiempoContraReloj - 15, 15);
        }

        // Empezar
        if (this.enRect(x, y, this.boton)) this.fadeOut(() => this.prepararJuego());
    }

    enRect(x, y, b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    }

    fadeOut(callback) {
        this.enTransicion = true;
        const animar = () => {
            this.alpha -= 0.05;
            if (this.alpha <= 0) {
                this.alpha = 0;
                callback();
            } else requestAnimationFrame(animar);
        };
        animar();
    }

    prepararJuego() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const fichaElegida = this.opcionesFichas[this.fichaSeleccionada].img;
        const tablero = new Tablero();
        const vista = new TableroVista(this.canvas, tablero, fichaElegida);
        const controlador = new TableroControlador(tablero, vista, this.modos[this.modoSeleccionado], this.tiempoContraReloj);
    }

    roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }
}
