class Bird {
  constructor(birdElementId, containerHeight) {
    this.bird = document.getElementById(birdElementId);
    this.containerHeight = containerHeight;
    this.gravity = 0.2;//baja pra la gravedad
    this.lift = -7;//movimiento hacia arriba
    this.velocity = 0;
    this.position = this.containerHeight / 2;
    this.maxFallSpeed = 2;//velocidad de caida
    this.isAlive = true;
    this.gameStarted = false;
    this.isBlinking = false; // para el parpadeo
    this.isFrozen = false;
    this.radius = this.bird.offsetWidth / 2; // para colisión circular
    this.sonidoVuelo = new Audio("./../audio/vuelo.mp3");
    this.contadorMovimiento = 0;
    this.contadorMovimientoCada = 0
    this.init();
     setInterval(() => {
      console.log("sumo tiempo")
      this.contadorMovimientoCada += 1000
    }, 1000)

  }

  init() {
    this.bird.style.top = `${this.position}px`;

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.sonidoVuelo.currentTime = 0;
        this.sonidoVuelo.play();
        if (!this.gameStarted) {
          this.gameStarted = true;
          this.contadorMovimiento = 7000
          this.contadorMovimientoCada = 0
          this.update();
          document.dispatchEvent(new Event('game-started'));
        }
        this.flap();
      }
    });
  }

  flap() {
    if (!this.isAlive) return;
    if (this.isFrozen) return;
    this.velocity = this.lift;
    

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
    if (this.contadorMovimiento === this.contadorMovimientoCada) {
      console.log("Cambio la velocidad ")
      this.contadorMovimientoCada = 0;
      if (this.gravity < 0.6) {
        this.gravity += 0.1
      }
      if (this.maxFallSpeed < 4) {
        this.maxFallSpeed += 0.5
      }
    }
   



    this.bird.style.top = `${this.position}px`;
    requestAnimationFrame(() => this.update());
  }
  

  hitPipe() {
    // Evitar perder vida múltiple
    if (this.isBlinking) return;

    this.isBlinking = true;
    document.dispatchEvent(new Event("hit-limit"));

    // Crear y mostrar explosión
    this.showExplosion();

    // Congelar por un momento
    this.isFrozen = true;
    const originalGravity = this.gravity;
    this.gravity = 0;
    this.velocity = 0;

    // A media pantalla
    this.position = this.containerHeight / 2;
    this.bird.style.top = `${this.position}px`;

    const freezeTime = 150;

    // Restore gravity y permitir flap normalmente
    setTimeout(() => {
      this.gravity = originalGravity;
      this.isFrozen = false;
    }, freezeTime);

    // Parpadeo visual del pájaro
    let visible = true;
    const blinkInterval = setInterval(() => {
      this.bird.style.opacity = visible ? "0.3" : "1";
      visible = !visible;
    }, 150);

    setTimeout(() => {
      clearInterval(blinkInterval);
      this.bird.style.opacity = "1";
      this.isBlinking = false;
    }, 1500);
  }

  showExplosion() {
    this.bird.style.opacity = '0'; // Ocultar el pájaro temporalmente
    // Crear elemento de explosión
    const explosion = document.createElement('div');
    explosion.className = 'explosion';

    // Posicionar en el lugar del pájaro
    const birdRect = this.bird.getBoundingClientRect();
    const containerRect = this.bird.parentElement.getBoundingClientRect();

    explosion.style.position = 'absolute';
    explosion.style.left = `${birdRect.left - containerRect.left}px`;
    explosion.style.top = `${birdRect.top - containerRect.top}px`;
    explosion.style.zIndex = '100';

    // Agregar al contenedor
    this.bird.parentElement.appendChild(explosion);

    // Remover después de que termine la animación (500ms)
    setTimeout(() => {
      explosion.remove();
    }, 500);
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



  getCircle() {
    const rect = this.bird.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      r: this.radius
    };
  }
}