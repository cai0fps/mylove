export function initUI(config) {
    document.getElementById('coupleNameDisplay').innerText = config.coupleNames;
    document.getElementById('specialMessageText').innerHTML = config.messages.special;
    document.getElementById('secretMessageText').innerHTML = config.messages.secret;

    const overlay = document.getElementById('overlay');
    
    document.getElementById('btnStartSite').addEventListener('click', () => {
        const audio = document.getElementById('audioPlayer');
        if (audio) audio.play().catch(() => {});
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 1000);
    });

    document.getElementById('btnToggleMessage').addEventListener('click', function() {
        const container = document.getElementById('messageContainer');
        const isExpanded = container.classList.contains('max-h-[1000px]');
        container.classList.toggle('max-h-40', isExpanded);
        container.classList.toggle('max-h-[1000px]', !isExpanded);
        this.innerText = isExpanded ? "Ler tudo" : "Recolher";
    });

    document.getElementById('btnSecret').addEventListener('click', () => {
        document.getElementById('secretLetterModal').classList.remove('hidden');
        document.getElementById('secretLetterModal').classList.add('flex');
    });

    document.getElementById('btnCloseSecret').addEventListener('click', () => {
        document.getElementById('secretLetterModal').classList.add('hidden');
        document.getElementById('secretLetterModal').classList.remove('flex');
    });

    document.getElementById('btnLoveExplosion').addEventListener('click', loveExplosion);
    document.getElementById('btnCloseDay9').addEventListener('click', closeDay9Popup);

    checkDay9Surprise();
}

function loveExplosion() {
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 100);
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-bg fixed z-[100] text-pink-500 drop-shadow-md pointer-events-none';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.transition = `transform ${Math.random() * 2 + 3}s linear, opacity 3s`;
    
    document.body.appendChild(heart);
    
    requestAnimationFrame(() => {
        heart.style.transform = `translateY(-120vh) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
    });
    
    setTimeout(() => heart.remove(), 5000);
}

function checkDay9Surprise() {
    if (new Date().getDate() === 9) {
        document.getElementById('overlayTitle').innerText = "Feliz nosso dia! 🥹❤️";
        const popup = document.getElementById('day9Popup');
        const card = document.getElementById('day9Card');
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        setTimeout(() => {
            popup.classList.replace('opacity-0', 'opacity-100');
            card.classList.replace('scale-95', 'scale-100');
            loveExplosion();
        }, 100);
    }
}

function closeDay9Popup() {
    const popup = document.getElementById('day9Popup');
    popup.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('flex');
    }, 500);
}
