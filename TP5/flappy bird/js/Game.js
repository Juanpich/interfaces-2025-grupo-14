class Game {
    constructor() {
        this.container = document.querySelector(".game-container");
        this.startScreen = document.getElementById("start-screen");
        this.bird = null;
        this.coins = null;
        this.hearts = null;
        this.generadorTuberias = null;
        this.score = 0;
        this.lives = 3;
        this.gameStarted = false;
        this.hud = null;
        this.sonidoCaida = new Audio("./../audio/caida.mp3");

        this.init();
    }

    init() {
        const containerHeight = this.container.offsetHeight;

        // Crear pájaro
        this.bird = new Bird("bird", containerHeight);

        // Crear generador de tuberías con valores iniciales más amplios
        if (window.GeneradorTuberias && window.Tuberia) {
            this.generadorTuberias = new GeneradorTuberias({
                contenedor: document.getElementById("pipes-container"),
                
                // ═══════════════════════════════════════════════════════════
                // 🎯 AJUSTA ESTOS VALORES PARA CAMBIAR LA DIFICULTAD
                // ═══════════════════════════════════════════════════════════
                
                // 📏 SEPARACIÓN VERTICAL (hueco entre tubo superior e inferior)
                separacionVerticalInicial: 300,  // 🔧 MÁS GRANDE = MÁS FÁCIL (rango: 150-300)
                minSeparacion: 100,              // 🔧 Mínimo al que llega (rango: 70-150)
                
                // ↔️ SEPARACIÓN HORIZONTAL (distancia entre pares de tuberías)
                separacionHorizontalInicial: 700, // 🔧 MÁS GRANDE = MÁS TIEMPO (rango: 400-900)
                minSeparacionHorizontal: 250,     // 🔧 Mínimo al que llega (rango: 180-400)
                
                // 🚀 VELOCIDAD (píxeles por segundo)
                velocidadInicial: 100,            // 🔧 MÁS BAJO = MÁS LENTO (rango: 100-200)
                
                // 📉 FACTOR DE DIFICULTAD (reducción progresiva)
                factorDificultad: 0.9999,         // 🔧 MÁS CERCA DE 1 = MÁS LENTO (rango: 0.9995-0.9999)
                
                // 🔨 ALTURA MÍNIMA DE CADA TUBO
                minAlturaTubo: 30                 // No modificar (mantener en 30)
            });
            
            // Establecer referencia al pájaro para detección de colisiones
            this.generadorTuberias.setPajaro(this.bird);
        }

        // Crear monedas
        this.coins = new Coin(this.container, document.getElementById("bird"));

        // Crear corazones
        this.hearts = new Heart(this.container, document.getElementById("bird"));

        // Crear HUD
        this.hud = new HUD();
        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);

        // Configurar eventos
        this.setupEventListeners();

        // Iniciar el bucle principal (pero sin actualizar tuberías hasta que empiece el juego)
        this.gameLoop();
    }

    setupEventListeners() {
        // Evento de colectar monedas
        document.addEventListener("coin-collected", () => {
            this.score += 3;
            this.hud.updateScore(this.score);
        });

        // Evento de pasar tubería
        document.addEventListener("pipe-passed", () => {
            this.score++;
            this.hud.updateScore(this.score);
        });

        // Evento de colectar corazón
        document.addEventListener("heart-collected", () => this.gainLife());
        
        // Evento de perder vida
        document.addEventListener("hit-limit", () => this.loseLife());

        // Evento de inicio del juego (cuando se presiona ESPACIO por primera vez)
        document.addEventListener("game-started", () => {
            if (!this.gameStarted) {
                this.gameStarted = true;

                // Ocultar pantalla de inicio
                if (this.startScreen) {
                    this.startScreen.style.opacity = "0";
                    setTimeout(() => {
                        this.startScreen.style.display = "none";
                    }, 300);
                }

                // Iniciar monedas con delay
                setTimeout(() => {
                    if (this.coins) this.coins.start();
                }, 3000);

                // Iniciar corazones con delay mayor
                setTimeout(() => {
                    if (this.hearts) this.hearts.start();
                }, 8000);
            }
        });
    }

    gainLife() {
        if (this.lives < 3) {
            this.lives++;
            this.hud.updateLives(this.lives);
            this.bird.gainLife();
        }
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            this.hud.updateLives(this.lives);

            // Reset posición pájaro
            this.bird.position = this.container.offsetHeight / 2;
            this.bird.velocity = 0;
            this.bird.bird.style.top = `${this.bird.position}px`;
        }

        // Si ya no quedan vidas → GAME OVER
        if (this.lives <= 0) {
            this.bird.isAlive = false;
            this.gameStarted = false; // Detener actualizaciones
            this.showGameOverScreen();
            this.sonidoCaida.play();
            
            // Detener generador de tuberías
            if (this.generadorTuberias) {
                this.generadorTuberias.detener();
            }
            
            // Detener monedas y corazones
            if (this.coins) {
                this.coins.stop();
                this.coins.clear();
            }
            if (this.hearts) {
                this.hearts.stop();
                this.hearts.clear();
            }
        }
    }

    showGameOverScreen() {
        const panel = document.getElementById("game-over");
        if (!panel) return;

        panel.classList.remove("hidden");
        setTimeout(() => panel.classList.add("visible"), 10);

        const restartHandler = (e) => {
            if (e.code === "Space") {
                document.removeEventListener("keydown", restartHandler);
                panel.classList.remove("visible");
                setTimeout(() => {
                    panel.classList.add("hidden");
                    this.restartGame();
                }, 300);
            }
        };

        document.addEventListener("keydown", restartHandler);
    }

    restartGame() {
        window.location.reload();
    }

    gameLoop() {
        let ultimo = performance.now();

        const loop = (ahora) => {
            const dt = ahora - ultimo; // dt en milisegundos
            ultimo = ahora;

            // IMPORTANTE: Solo actualizar tuberías si el juego ha comenzado
            if (this.bird && this.bird.isAlive && this.gameStarted) {
                // Actualizar generador de tuberías
                if (this.generadorTuberias) {
                    this.generadorTuberias.update(dt);
                }
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
});