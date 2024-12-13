window.addEventListener("load", function () {
    // // Get canvas and context.
    const canvas = document.getElementById('main-canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    // Set canvas dimensions to match the window size.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update displayed values for all range inputs.
    document.querySelectorAll('input[type=range]').forEach(function (input) {
        const spanId = input.id + '-value';
        const span = document.getElementById(spanId);

        if (span) {
            input.addEventListener('input', function () {
                span.textContent = input.value;
            });
            span.textContent = input.value;
        }
    });

    // Resize canvas to match window dimensions on resize.
    this.window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});