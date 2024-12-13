window.addEventListener("load", function () {
    // Get canvas and context.
    const canvas = document.getElementById("main-canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    // Set canvas dimensions to match the window size.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update displayed values for all range inputs.
    document.querySelectorAll("input[type=range]").forEach(function (input) {
        const spanId = input.id + "-value";
        const span = document.getElementById(spanId);

        if (span) {
            input.addEventListener("input", function () {
                span.textContent = input.value;
            });
            span.textContent = input.value;
        }
    });

    // Define the Particle class, representing each particle in the effect.
    class Particle {
        constructor(effect, x, y, color) {
            // Reference to the parent effect, x position, y position and particle color.
            this.effect = effect;
            this.x = Math.random() * effect.canvasWidth;
            this.y = Math.random() * effect.canvasHeight;
            this.color = color;

            // Target original particle position.
            this.originX = x;
            this.originY = y;

            // Particle size.
            this.size = effect.particleSize;

            // Movement velocity.
            this.velocityX = 0;
            this.velocityY = 0;

            // Ease factor for smooth movement.
            this.ease = Math.random() * 0.1 + 0.005;
            // Friction to reduce velocity.
            this.friction = Math.random() * 0.5 + 0.15;
        }

        // Draw the particle on the canvas.
        draw() {
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }

        // Update particle position and velocity based on mouse interaction.
        update() {
            const deltaX = this.effect.mouse.x - this.x;
            const deltaY = this.effect.mouse.y - this.y;
            const distanceSquared = deltaX * deltaX + deltaY * deltaY;

            // Apply repulsion if within mouse radius.
            if (distanceSquared < this.effect.mouse.radius) {
                const force = -this.effect.mouse.radius / distanceSquared;
                const angle = Math.atan2(deltaY, deltaX);
                this.velocityX += force * Math.cos(angle);
                this.velocityY += force * Math.sin(angle);
            }

            // Apply friction and update position.
            this.velocityX *= this.friction;
            this.velocityY *= this.friction;
            this.x += this.velocityX + (this.originX - this.x) * this.ease;
            this.y += this.velocityY + (this.originY - this.y) * this.ease;
        }
    }

    // Define the TextEffect class to manage text rendering and particles.
    class TextEffect {
        constructor(context, canvasWidth, canvasHeight) {
            // Reference to the context, canvas width and canvas height.
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;

            // Text rendering properties.
            this.textX = canvasWidth / 2;
            this.textY = canvasHeight / 2;
            this.fontSize = 150;
            this.lineHeight = this.fontSize * 0.8;
            this.maxTextWidth = canvasWidth * 0.8;

            // Particle properties.
            this.particles = [];
            this.particleSize = 6;
            this.gapSize = 3;

            // Mouse interaction properties.
            this.mouse = { radius: 50000, x: 0, y: 0 };

            // Input elements for interactive controls.
            this.textInput = document.getElementById("text-input");
            this.colorPicker = document.getElementById("color-picker");
            this.fontSizeSlider = document.getElementById("font-size");
            this.particleSizeSlider = document.getElementById("particle-size");
            this.gapSizeSlider = document.getElementById("gap-size");
            this.mouseRadiusSlider = document.getElementById("mouse-radius");

            // Maintain `this` context for event listeners.
            const self = this;

            // Bind input events to update text effect.
            if (this.textInput) {
                this.textInput.addEventListener("keyup", function (event) {
                    self.wrapText(event.target.value);
                });
            }

            // Update mouse position for particle interaction.
            window.addEventListener("mousemove", function (event) {
                self.mouse.x = event.x;
                self.mouse.y = event.y;
            });

            // Initialize canvas text properties.
            this.setContextProperties();

            // Bind control events to update text properties dynamically.
            if (this.colorPicker) {
                this.colorPicker.addEventListener("change", function () {
                    let textValue = "";

                    if (self.textInput && self.textInput.value) {
                        textValue = self.textInput.value;
                    }

                    self.wrapText(textValue);
                });
            }

            if (this.fontSizeSlider) {
                this.fontSizeSlider.addEventListener("input", function () {
                    self.updateFontSize();
                });
            }

            if (this.particleSizeSlider) {
                this.particleSizeSlider.addEventListener("input", function () {
                    self.updateParticleSize();
                });
            }

            if (this.gapSizeSlider) {
                this.gapSizeSlider.addEventListener("input", function () {
                    self.updateGapSize();
                });
            }

            if (this.mouseRadiusSlider) {
                this.mouseRadiusSlider.addEventListener("input", function () {
                    self.updateMouseRadius();
                });
            }
        }

        // Set initial canvas text properties.
        setContextProperties() {
            this.context.textAlign = "left";
            this.context.textBaseline = "middle";
            this.context.lineWidth = 3;
            this.context.strokeStyle = "transparent";
            this.context.font = "900 " + this.fontSize + "px \"JetBrains Mono\", monospace";
        }

        // Update font size and re-render text.
        updateFontSize() {
            if (!this.fontSizeSlider) {
                return;
            }

            this.fontSize = parseInt(this.fontSizeSlider.value, 10);
            this.lineHeight = this.fontSize * 0.8;
            this.context.font = "900 " + this.fontSize + "px \"JetBrains Mono\", monospace";
            let textValue = "";

            if (this.textInput && this.textInput.value) {
                textValue = this.textInput.value;
            }

            this.wrapText(textValue);
        }

        // Update particle size and re-render text.
        updateParticleSize() {
            if (!this.particleSizeSlider) {
                return;
            }

            this.particleSize = parseInt(this.particleSizeSlider.value, 10);
            let textValue = "";

            if (this.textInput && this.textInput.value) {
                textValue = this.textInput.value;
            }

            this.wrapText(textValue);
        }

        // Update gap size and re-render text.
        updateGapSize() {
            if (!this.gapSizeSlider) {
                return;
            }

            this.gapSize = parseInt(this.gapSizeSlider.value, 10);

            let textValue = "";

            if (this.textInput && this.textInput.value) {
                textValue = this.textInput.value;
            }

            this.wrapText(textValue);
        }

        // Update mouse radius.
        updateMouseRadius() {
            if (!this.mouseRadiusSlider) {
                return;
            }

            this.mouse.radius = parseInt(this.mouseRadiusSlider.value, 10);
        }

        // Render text on canvas and create particles.
        wrapText(text) {
            if (typeof text !== "string") {
                text = "";
            }

            let colorValue = "white";

            if (this.colorPicker && this.colorPicker.value) {
                colorValue = this.colorPicker.value;
            }

            let gradient;

            switch (colorValue) {
                case "red":
                    gradient = "#ff0000";
                    break;
                case "green":
                    gradient = "#00ff00";
                    break;
                case "blue":
                    gradient = "#0000ff";
                    break;
                default:
                    gradient = "#ff0000";
                    break;
            }

            // Set text fill style to gradient.
            this.context.fillStyle = gradient;

            // Split text into lines fitting the canvas.
            const upperText = text.toUpperCase();
            const words = upperText.split(" ");
            const lines = [];
            let line = "";

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + " ";
                const metrics = this.context.measureText(testLine);

                if (metrics.width > this.maxTextWidth && i > 0) {
                    lines.push(line.trim());
                    line = words[i] + " ";
                } else {
                    line = testLine;
                }
            }

            lines.push(line.trim());

            // Clear canvas and render text line by line.
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            const textHeight = this.lineHeight * lines.length;
            const centerY = this.canvasHeight / 2;
            const startY = centerY - ((lines.length - 1) * this.lineHeight / 2);

            for (let l = 0; l < lines.length; l++) {
                const lineY = startY + l * this.lineHeight;
                const lineWidth = this.context.measureText(lines[l]).width;
                const lineX = (this.canvasWidth - lineWidth) / 2;
                this.context.fillText(lines[l], lineX, lineY);
            }

            // Convert rendered text to particles.
            this.convertToParticles();
        }

        // Convert rendered text into particles.
        convertToParticles() {
            this.particles = [];
            const imageData = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            const pixels = imageData.data;
            const totalGap = this.particleSize + this.gapSize;

            for (let y = 0; y < this.canvasHeight; y += totalGap) {
                for (let x = 0; x < this.canvasWidth; x += totalGap) {
                    const index = (y * this.canvasWidth + x) * 4;

                    if (pixels[index + 3] > 0) {
                        const color = "rgb(" + pixels[index] + "," + pixels[index + 1] + "," + pixels[index + 2] + ")";
                        this.particles.push(new Particle(this, x, y, color));
                    }
                }
            }
        }

        // Render all particles.
        render() {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                this.particles[i].draw();
            }
        }

        // Adjust effect to new canvas dimensions.
        resize(width, height) {
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.textX = width / 2;
            this.maxTextWidth = width * 0.8;
            this.setContextProperties();
            let textValue = "";

            if (this.textInput && this.textInput.value) {
                textValue = this.textInput.value;
            }

            this.wrapText(textValue);
        }
    }


    // Initialize the effect and render loop.
    const textEffect = new TextEffect(context, canvas.width, canvas.height);
    let initText = "";

    if (textEffect.textInput && textEffect.textInput.value) {
        initText = textEffect.textInput.value;
    }

    textEffect.wrapText(initText);

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        textEffect.render();
        requestAnimationFrame(animate);
    }

    animate();

    // Resize canvas to match window dimensions on resize.
    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        textEffect.resize(canvas.width, canvas.height);
    });
});
