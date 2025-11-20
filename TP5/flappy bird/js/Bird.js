class Bird {
  constructor(birdElementId, containerHeight) {
    this.bird = document.getElementById(birdElementId);
    this.containerHeight = containerHeight;
    this.gravity = 0.8;
    this.lift = -7;
    this.velocity = 0;
    this.position = this.containerHeight / 2;
    this.maxFallSpeed = 4;
    this.isAlive = true;
    this.gameStarted = false;
    this.invincible = false; // para el parpadeo
    this.radius = this.bird.offsetWidth / 2; // para colisión circular
    this.sonidoVuelo = new Audio("./../audio/vuelo.mp3");
    this.init();
  }

  init() {
    this.bird.style.top = `${this.position}px`;

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.sonidoVuelo.currentTime = 0;
        this.sonidoVuelo.play();
        if (!this.gameStarted) {
          this.gameStarted = true;
          this.update();
          document.dispatchEvent(new Event('game-started'));
        }
        this.flap();
      }
    });
  }

  flap() {
    if (this.isAlive) this.velocity = this.lift;
  }

  update() {
    if (!this.isAlive) return;

    this.velocity += this.gravity;
    this.velocity = Math.min(this.velocity, this.maxFallSpeed);
    this.position += this.velocity;

    // Limites superior e inferior
    if (this.position > this.containerHeight - this.bird.offsetHeight) {
      this.position = this.containerHeight - this.bird.offsetHeight;
      this.velocity = 0;
      this.hitPipe();
    } else if (this.position < 0) {
      this.position = 0;
      this.velocity = 0;
      this.hitPipe();
    }

    this.bird.style.top = `${this.position}px`;
    requestAnimationFrame(() => this.update());
  }

  hitPipe() {
    if (this.invincible) return; // si ya es invencible, no pasa nada

    this.invincible = true;

    // Guardar valores originales
    const gravityOriginal = this.gravity;

    // Tiempo
    const tiempoInmovil = 900;  // tiempo Inmovil segundos
    const tiempoInvencible = 4000; // tiempo Invencible segundos

    // --- BLOQUEAR GRAVEDAD ---
    this.gravity = 0;
    this.velocity = 0;

    // --- POSICIÓN FIJA DURANTE 0.5s ---
    this.position = this.containerHeight / 2;
    this.bird.style.top = `${this.position}px`;

    // --- EVENTO DE VIDA PERDIDA ---
    document.dispatchEvent(new Event("hit-limit"));

    // --- PARPADEO ---
    let visible = true;
    const blinkInterval = setInterval(() => {
      this.bird.style.opacity = visible ? "0.3" : "1";
      visible = !visible;
    }, 150);

    // liberar movimiento pero sigue invencible
    setTimeout(() => {
      // Restaurar gravedad pero sigue invencible
      this.gravity = gravityOriginal;
    }, tiempoInmovil);

    // Dejar de parpadear y volver a normal
    setTimeout(() => {

      clearInterval(blinkInterval);
      this.bird.style.opacity = "1";

      // Restaurar estado original
      this.invincible = false;      

    }, tiempoInvencible);
  }


  respawn() {
    // Invencibilidad temporal para efecto de parpadeo
    this.invincible = true;
    this.velocity = 0;
    this.bird.style.top = `${this.position}px`;

    let visible = true;
    const blinkInterval = setInterval(() => {
      this.bird.style.opacity = visible ? '0.3' : '1';
      visible = !visible;
    }, 150);

    setTimeout(() => {
      clearInterval(blinkInterval);
      this.bird.style.opacity = '1';
      this.invincible = false;
    }, 3000);
  }

  gainLife() {
    // Efecto de parpadeo al ganar vida
    this.respawn();
  }

  getCircle() {
    const rect = this.bird.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      r: this.radius
    };
  }
}