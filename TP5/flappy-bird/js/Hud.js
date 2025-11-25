class HUD {
    constructor() {
        this.scoreElement = document.getElementById("score");
        this.lifeElements = Array.from(document.querySelectorAll("#lives .life"));
        this.maxLives = this.lifeElements.length;
    }

    updateScore(score) { this.scoreElement.textContent = score; }

    updateLives(currentLives) {
        for (let i = 0; i < this.maxLives; i++) {
            if (i < currentLives) {
                this.lifeElements[i].classList.remove("empty");
                this.lifeElements[i].classList.add("full");
            } else {
                this.lifeElements[i].classList.remove("full");
                this.lifeElements[i].classList.add("empty");
            }
        }
    }
}
