document.addEventListener('DOMContentLoaded', function() {
    // Select all slider containers
    const containers = document.querySelectorAll('.ekwa-container');

    // Initialize each slider
    containers.forEach(function(container) {
        initEkwa(container);
    });

    // Function to initialize a single slider
    function initEkwa(container) {
        const beforeWrapper = container.querySelector('.ekwa-before-wrapper');
        const handle = container.querySelector('.ekwa-handle');
        const beforeImg = container.querySelector('.ekwa-before');
        const afterImg = container.querySelector('.ekwa-after');
        let dragging = false;
        let currentX = 0;
        let containerWidth = 0;

        // Get initial position from data attribute (if set)
        const initialPosition = container.dataset.initialPosition ?
                               parseInt(container.dataset.initialPosition) : 50;

        // Function to set container height and initial slider position
        function setDimensions() {
            // Reset container height based on image aspect ratio
            if (afterImg.naturalWidth && afterImg.naturalHeight) {
                const aspectRatio = afterImg.naturalHeight / afterImg.naturalWidth;
                container.style.height = container.offsetWidth * aspectRatio + 'px';
            } else {
                // Fallback fixed height if natural dimensions aren't available
                container.style.height = '400px';
            }

            // Store container width for calculations
            containerWidth = container.offsetWidth;

            // Set initial position
            moveSlider(initialPosition);
        }

        // Calculate container dimensions after images load
        afterImg.onload = setDimensions;

        // Fallback in case images already loaded
        if (afterImg.complete) {
            setDimensions();
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            // Get current position as percentage
            const currentPercent = (parseFloat(handle.style.left) || initialPosition) / 100;

            // Reset dimensions
            setDimensions();

            // Maintain same percentage position after resize
            moveSlider(currentPercent * 100);
        });

        // Move slider to a position (percent: 0-100)
        function moveSlider(percent) {
            percent = Math.max(0, Math.min(100, percent));

            // Move the slider handle
            handle.style.left = `${percent}%`;

            // Adjust before image clip
            const width = container.offsetWidth;
            const clipPos = width * (percent / 100);

            // Use modern clip-path for better compatibility
            beforeWrapper.style.clipPath = `inset(0 ${width - clipPos}px 0 0)`;
            beforeWrapper.style.clip = `rect(0, ${clipPos}px, ${container.offsetHeight}px, 0)`;
        }

        // Calculate the position based on mouse/touch
        function calculatePosition(clientX) {
            const containerRect = container.getBoundingClientRect();
            const offsetX = clientX - containerRect.left;
            return (offsetX / containerRect.width) * 100;
        }

        // Event handlers for mouse
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            dragging = true;
            container.classList.add('ekwa-active'); // Visual indicator
        });

        window.addEventListener('mousemove', function(e) {
            if (dragging) {
                const percent = calculatePosition(e.clientX);
                moveSlider(percent);
            }
        });

        window.addEventListener('mouseup', function() {
            if (dragging) {
                dragging = false;
                container.classList.remove('ekwa-active');
            }
        });

        // Event handlers for touch
        handle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            dragging = true;
            container.classList.add('ekwa-active'); // Visual indicator

            // Store current touch position
            currentX = e.touches[0].clientX;
        });

        window.addEventListener('touchmove', function(e) {
            if (dragging) {
                e.preventDefault();
                const percent = calculatePosition(e.touches[0].clientX);
                moveSlider(percent);

                // Update current touch position
                currentX = e.touches[0].clientX;
            }
        }, { passive: false });

        window.addEventListener('touchend', function() {
            if (dragging) {
                dragging = false;
                container.classList.remove('ekwa-active');
            }
        });

        // Allow clicking anywhere on the container to move slider
        container.addEventListener('click', function(e) {
            // Only trigger if it's a direct click, not a drag end
            if (!dragging) {
                const percent = calculatePosition(e.clientX);
                moveSlider(percent);
            }
        });
    }
});