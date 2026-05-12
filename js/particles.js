/**
 * Cherry Blossom & Star Particle Effects
 */
(function () {
    'use strict';

    const particlesContainer = document.getElementById('particles');
    const starsContainer = document.getElementById('floatingStars');

    // Cherry blossom petals
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';

        const size = 8 + Math.random() * 12;
        const startX = Math.random() * window.innerWidth;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 10;
        const hue = 330 + Math.random() * 30;
        const drift = (Math.random() - 0.5) * 200;

        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = startX + 'px';
        petal.style.top = '-20px';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        petal.style.background = 'radial-gradient(ellipse at center, hsl(' + hue + ', 100%, 85%) 0%, transparent 70%)';

        const keyframes = `
            @keyframes petalDrift${Date.now()}${Math.random()} {
                0% {
                    opacity: 0;
                    transform: translateX(0) translateY(-20px) rotate(0deg) scale(0.5);
                }
                10% {
                    opacity: 0.8;
                }
                50% {
                    transform: translateX(${drift}px) translateY(50vh) rotate(360deg) scale(0.7);
                }
                90% {
                    opacity: 0.4;
                }
                100% {
                    opacity: 0;
                    transform: translateX(${drift * 1.5}px) translateY(100vh) rotate(720deg) scale(0.2);
                }
            }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = keyframes;
        document.head.appendChild(styleEl);

        const animName = keyframes.match(/@keyframes\s+([\w]+)/)[1];
        petal.style.animationName = animName;

        particlesContainer.appendChild(petal);

        setTimeout(function () {
            petal.remove();
            styleEl.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial petals
    for (let i = 0; i < 15; i++) {
        setTimeout(createPetal, i * 600);
    }

    // Continuously create petals
    setInterval(createPetal, 2000);

    // Stars
    function createStars() {
        const count = 50;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            const size = 1 + Math.random() * 3;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDuration = (2 + Math.random() * 4) + 's';
            star.style.animationDelay = Math.random() * 4 + 's';

            if (Math.random() > 0.7) {
                star.style.background = '#FFB7C5';
            } else if (Math.random() > 0.5) {
                star.style.background = '#B8A9FF';
            }

            starsContainer.appendChild(star);
        }
    }

    createStars();

    // Sparkle burst on calculator button clicks
    document.querySelector('.calculator').addEventListener('click', function (e) {
        if (!e.target.closest('.btn')) return;

        const rect = e.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        for (let i = 0; i < 4; i++) {
            createSparkle(x, y);
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';

        const colors = ['#FFB7C5', '#7B68EE', '#FFD700', '#FF69B4', '#B8A9FF'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        document.body.appendChild(sparkle);

        sparkle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0)',
                opacity: 0
            }
        ], {
            duration: 500 + Math.random() * 300,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
        }).onfinish = function () {
            sparkle.remove();
        };
    }
})();
