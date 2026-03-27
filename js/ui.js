export function initUI(config) {
    // Verificações de segurança adicionadas (uso do encadeamento opcional ?.)
    document.getElementById('coupleNameDisplay').innerText = config.coupleNames || '';
    document.getElementById('specialMessageText').innerHTML = config.messages?.special || '';
    document.getElementById('secretMessageText').innerHTML = config.messages?.secret || '';

    const overlay = document.getElementById('overlay');
    
    document.getElementById('btnStartSite').addEventListener('click', () => {
        const audio = document.getElementById('audioPlayer');
        if (audio) audio.play().catch(() => {});
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 1000);
        }
    });

    document.getElementById('btnToggleMessage').addEventListener('click', function() {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        const isExpanded = container.classList.contains('max-h-[1000px]');
        container.classList.toggle('max-h-40', isExpanded);
        container.classList.toggle('max-h-[1000px]', !isExpanded);
        this.innerText = isExpanded ? "Ler tudo" : "Recolher";
    });

    document.getElementById('btnSecret').addEventListener('click', () => {
        const modal = document.getElementById('secretLetterModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    });

    document.getElementById('btnCloseSecret').addEventListener('click', () => {
        const modal = document.getElementById('secretLetterModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });

    const btnLove = document.getElementById('btnLoveExplosion');
    if (btnLove) {
        const heartIcon = btnLove.querySelector('i');
        const isLiked = localStorage.getItem('mylove_liked') === 'true';
        
        if (heartIcon) {
            if (isLiked) {
                heartIcon.classList.remove('far', 'text-white');
                heartIcon.classList.add('fas', 'text-pink-500');
            } else {
                heartIcon.classList.remove('fas', 'text-pink-500');
                heartIcon.classList.add('far', 'text-white');
            }
        }

        btnLove.addEventListener('click', () => {
            loveExplosion();

            if (heartIcon) {
                const currentlyLiked = heartIcon.classList.contains('fas');
                if (currentlyLiked) {
                    heartIcon.classList.remove('fas', 'text-pink-500');
                    heartIcon.classList.add('far', 'text-white');
                    localStorage.setItem('mylove_liked', 'false');
                } else {
                    heartIcon.classList.remove('far', 'text-white');
                    heartIcon.classList.add('fas', 'text-pink-500');
                    localStorage.setItem('mylove_liked', 'true');
                }
            }
        });
    }

    const btnCloseDay9 = document.getElementById('btnCloseDay9');
    if (btnCloseDay9) {
        btnCloseDay9.addEventListener('click', closeDay9Popup);
    }

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
        const title = document.getElementById('overlayTitle');
        if (title) title.innerText = "Feliz nosso dia! 🥹❤️";
        
        const popup = document.getElementById('day9Popup');
        const card = document.getElementById('day9Card');
        if (popup && card) {
            popup.classList.remove('hidden');
            popup.classList.add('flex');
            setTimeout(() => {
                popup.classList.replace('opacity-0', 'opacity-100');
                card.classList.replace('scale-95', 'scale-100');
                loveExplosion();
            }, 100);
        }
    }
}

function closeDay9Popup() {
    const popup = document.getElementById('day9Popup');
    if (popup) {
        popup.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => {
            popup.classList.add('hidden');
            popup.classList.remove('flex');
        }, 500);
    }
}
    if (isLiked) {
        heartIcon.classList.remove('far', 'text-white');
        heartIcon.classList.add('fas', 'text-pink-500');
    } else {
        heartIcon.classList.remove('fas', 'text-pink-500');
        heartIcon.classList.add('far', 'text-white');
    }

    btnLove.addEventListener('click', () => {
        loveExplosion();

        const currentlyLiked = heartIcon.classList.contains('fas');
        
        if (currentlyLiked) {
            heartIcon.classList.remove('fas', 'text-pink-500');
            heartIcon.classList.add('far', 'text-white');
            localStorage.setItem('mylove_liked', 'false');
        } else {
            heartIcon.classList.remove('far', 'text-white');
            heartIcon.classList.add('fas', 'text-pink-500');
            localStorage.setItem('mylove_liked', 'true');
        }
    });

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
            }        popup.classList.add('hidden');
        popup.classList.remove('flex');
    }, 500);
}
