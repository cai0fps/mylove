export function initUI(config) {
    const coupleNameEl = document.getElementById('coupleNameDisplay');
    if (coupleNameEl) coupleNameEl.innerText = config.coupleNames || '';

    const specialMsgEl = document.getElementById('specialMessageText');
    if (specialMsgEl) specialMsgEl.innerHTML = config.messages?.special || '';

    const secretMsgEl = document.getElementById('secretMessageText');
    if (secretMsgEl) secretMsgEl.innerHTML = config.messages?.secret || '';

    // Ajusta o ano dinâmico em "Juntos desde ..." se a data estiver configurada
    if (config.startDate) {
        const startYear = new Date(config.startDate).getFullYear();
        const btnSecret = document.getElementById('btnSecret');
        if (btnSecret && !isNaN(startYear)) {
            btnSecret.innerText = `Juntos desde ${startYear}`;
        }
    }

    const overlay = document.getElementById('overlay');
    const btnStartSite = document.getElementById('btnStartSite');
    
    if (btnStartSite) {
        btnStartSite.addEventListener('click', () => {
            const audio = document.getElementById('audioPlayer');
            if (audio) {
                audio.play().catch(() => {});
            }
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 1000);
            }
        });
    }

    const btnToggleMessage = document.getElementById('btnToggleMessage');
    if (btnToggleMessage) {
        btnToggleMessage.addEventListener('click', function() {
            const container = document.getElementById('messageContainer');
            if (!container) return;
            const isExpanded = container.classList.contains('max-h-[1000px]');
            container.classList.toggle('max-h-40', isExpanded);
            container.classList.toggle('max-h-[1000px]', !isExpanded);
            this.innerText = isExpanded ? "Ler tudo" : "Recolher";
        });
    }

    // Modal de segredo
    const secretModal = document.getElementById('secretLetterModal');
    const btnSecret = document.getElementById('btnSecret');
    const btnCloseSecret = document.getElementById('btnCloseSecret');

    if (btnSecret && secretModal) {
        btnSecret.addEventListener('click', () => {
            secretModal.classList.remove('hidden');
            secretModal.classList.add('flex');
        });
    }

    if (btnCloseSecret && secretModal) {
        btnCloseSecret.addEventListener('click', () => {
            secretModal.classList.add('hidden');
            secretModal.classList.remove('flex');
        });
    }

    // Fechar modal de segredo ao clicar no fundo escuro
    if (secretModal) {
        secretModal.addEventListener('click', (e) => {
            if (e.target === secretModal) {
                secretModal.classList.add('hidden');
                secretModal.classList.remove('flex');
            }
        });
    }

    // Botão de curtida / explosão de corações
    const btnLove = document.getElementById('btnLoveExplosion');
    if (btnLove) {
        const heartIcon = btnLove.querySelector('i');
        const savedLike = localStorage.getItem('mylove_liked');
        // Se ainda não houver valor salvo, padrão é curtido (true)
        const isLiked = savedLike !== null ? savedLike === 'true' : true;
        
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

    const day9Popup = document.getElementById('day9Popup');
    if (day9Popup) {
        day9Popup.addEventListener('click', (e) => {
            if (e.target === day9Popup) {
                closeDay9Popup();
            }
        });
    }

    checkDay9Surprise();
}

export function loveExplosion() {
    for (let i = 0; i < 16; i++) {
        setTimeout(createHeart, i * 90);
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-bg fixed z-[100] text-pink-500 drop-shadow-md pointer-events-none select-none';
    heart.innerHTML = '❤️';
    heart.style.left = (Math.random() * 92 + 4) + 'vw';
    heart.style.bottom = '-10vh';
    
    const size = Math.random() * 20 + 20;
    heart.style.fontSize = `${size}px`;
    
    const duration = Math.random() * 2 + 3; // 3 a 5 segundos
    heart.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 100);
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
