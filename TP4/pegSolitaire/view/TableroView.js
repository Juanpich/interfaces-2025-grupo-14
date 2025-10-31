class TableroVista {
    constructor(canvas, tablero) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tablero = tablero;
        this.tamanioCelda = canvas.width / 7;

        this.destinosValidos = [];
        // Cargar imagen de fondo una sola vez
        this.fondo = new Image();
        this.fondo.src = "fondo.png";
        this.fondoCargado = false;
        this.fondo.onload = () => {
            this.fondoCargado = true;
            this.dibujar(); // primer render cuando la imagen esté lista
        };


        // Callbacks que asigna el controlador
        this.onMouseDown = null;
        this.onMouseMove = null;
        this.onMouseUp = null;

        //La vista solo reenvía eventos, no decide lógica
        canvas.addEventListener('mousedown', e => this.onMouseDown?.(e));
        canvas.addEventListener('mousemove', e => this.onMouseMove?.(e));
        canvas.addEventListener('mouseup', e => this.onMouseUp?.(e));
    }

    obtenerCeldaDesdeEvento(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        console.log(x, y);
        return {
            fila: Math.floor(y / this.tamanioCelda),
            col: Math.floor(x / this.tamanioCelda)
        };
    }

    setDestinosValidos(destinos) {
        this.destinosValidos = destinos;
    }

    dibujar(fichaArrastrada = null, offset = null, arrastreX = null, arrastreY = null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.fondoCargado) {
            this.ctx.drawImage(this.fondo, 0, 0, this.canvas.width, this.canvas.height);
        }

        for (let fila = 0; fila < 7; fila++) {
            for (let col = 0; col < 7; col++) {
                const estado = this.tablero.estado[fila][col];
                const ficha = this.tablero.obtenerFicha(fila, col);
                const x = col * this.tamanioCelda;
                const y = fila * this.tamanioCelda;


                this.ctx.strokeStyle = '#999';
                this.ctx.strokeRect(x, y, this.tamanioCelda, this.tamanioCelda);
                if(estado === -1){
                    this.ctx.fillStyle = '#0000006e';
                    this.ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);
                }
                // pintar destinos válidos
                if (this.destinosValidos.some(d => d.fila === fila && d.col === col)) {
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.25)';
                    this.ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);
                }

                if (ficha?.estaActiva() && ficha !== fichaArrastrada) {
                    this.dibujarFicha(x, y, false);
                }
            }
        }

        if (fichaArrastrada && arrastreX !== null && arrastreY !== null) {
            this.dibujarFicha(
                arrastreX - offset.x,
                arrastreY - offset.y,
                true
            );
        }




    }

    dibujarFicha(x, y, seleccionada) {
        this.ctx.beginPath();
        this.ctx.arc(
            x + this.tamanioCelda / 2,
            y + this.tamanioCelda / 2,
            this.tamanioCelda / 3,
            0,
            2 * Math.PI
        );
        this.ctx.fillStyle = '#007bff';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(
            x + this.tamanioCelda / 2,
            y + this.tamanioCelda / 2,
            this.tamanioCelda / 3,
            0,
            2 * Math.PI
        );
        this.ctx.strokeStyle = seleccionada ? '#ff0000' : '#000';
        this.ctx.lineWidth = seleccionada ? 3 : 1;
        this.ctx.stroke();
    }
}