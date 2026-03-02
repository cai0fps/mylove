// ==================== 1. VARIÁVEIS E SELEÇÃO ====================
const startDate = new Date(2025, 7, 9); // Mês 7 = Agosto (Index 0 = Janeiro)

const audio = document.getElementById('audioPlayer');
const playIcon = document.getElementById('playIcon');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startSiteBtn');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');

const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');
const progressBarContainer = document.getElementById('progressBarContainer');

const wrappedScreen = document.getElementById('wrappedScreen');
const mainScreen = document.getElementById('mainScreen');
const storyImage = document.getElementById('storyImage');
const storyVideo = document.getElementById('storyVideo');
const progressContainer = document.getElementById('progressContainer');
const captionText = document.getElementById('captionText');

let isPlaying = false;
let currentIndex = 0; 
let storyTimer;

// ==================== 2. PLAYLIST E ÁUDIO ====================
const songs = [
    { title: "Sonha Comigo", artist: "Nossa Música", src: "videoplayback.weba" },
    { title: "Nosso Amor", artist: "5km", src: "videoplayback2.webm" },
    { title: "Para Sempre", artist: "duas metades", src: "videoplayback3.webm" }
];

let songIndex = 0; 
loadSong(songs[songIndex]);
audio.addEventListener('ended', nextSong);

audio.addEventListener('play', () => {
    isPlaying = true;
    if(playIcon) { 
        playIcon.classList.remove('fa-play', 'ml-1'); 
        playIcon.classList.add('fa-pause'); 
    }
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    if(playIcon) { 
        playIcon.classList.remove('fa-pause'); 
        playIcon.classList.add('fa-play', 'ml-1'); 
    }
});

function loadSong(song) {
    audio.src = song.src;
    if(songTitle) songTitle.innerText = song.title;
    if(songArtist) songArtist.innerText = song.artist;
    if(currentTimeEl) currentTimeEl.innerText = "0:00";
    if(progressBar) progressBar.style.width = "0%";
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1; 
    loadSong(songs[songIndex]);
    if (isPlaying) audio.play().catch(e => console.error("Erro ao reproduzir:", e));
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) songIndex = 0; 
    loadSong(songs[songIndex]);
    if (isPlaying) audio.play().catch(e => console.error("Erro ao reproduzir:", e));
}

function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
        audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    } else {
        audio.pause();
    }
}

// ==================== 3. BARRA DE PROGRESSO ====================
audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    const duration = audio.duration;
    
    if(currentTimeEl) currentTimeEl.innerText = formatTime(current);
    
    if (!isNaN(duration) && isFinite(duration) && duration > 0) {
        if(totalDurationEl) totalDurationEl.innerText = formatTime(duration);
        const percent = (current / duration) * 100;
        if(progressBar) progressBar.style.width = `${percent}%`;
    }
});

audio.addEventListener('loadedmetadata', () => {
    if(totalDurationEl && !isNaN(audio.duration) && isFinite(audio.duration)) {
        totalDurationEl.innerText = formatTime(audio.duration);
    }
});

function seek(event) {
    const rect = progressBarContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const duration = audio.duration;
    if(!isNaN(duration) && isFinite(duration) && duration > 0) {
        audio.currentTime = (clickX / width) * duration;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// ==================== 4. TELA DE ENTRADA E PRELOAD (LAZY LOAD) ====================
if (startBtn && overlay) {
    startBtn.addEventListener('click', () => {
        if (audio) {
            audio.play().catch(e => console.log("Áudio bloqueado pelo browser:", e));
        }
        overlay.style.display = 'none';
        
        preloadMedia(0); 
        checkDay9Surprise();
    });
}

function preloadMedia(index) {
    const load = (story) => {
        if (!story) return;
        if (story.type === 'image') {
            const img = new Image(); img.src = story.src;
        } else if (story.type === 'video') {
            const vid = document.createElement('video'); vid.preload = 'auto'; vid.src = story.src;
        }
    };
    
    if (index < stories.length) load(stories[index]);
    if (index + 1 < stories.length) load(stories[index + 1]);
}

// ==================== 5. MENSAGEM ====================
function toggleMessage(btn) {
    const container = document.getElementById('messageContainer');
    if (container.classList.contains('max-h-40')) {
        btn.innerText = "Recolher"; 
        container.classList.remove('max-h-40');
        container.classList.add('max-h-[1000px]');
    } else {
        btn.innerText = "Ler tudo"; 
        container.classList.remove('max-h-[1000px]');
        container.classList.add('max-h-40');
    }
}

// ==================== 6. CONTADOR DE NAMORO ====================
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    if (diff < 0) return;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if(document.getElementById('years')) {
        document.getElementById('years').innerText = years;
        document.getElementById('months').innerText = months;
        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    }
}
setInterval(updateCounter, 1000);
updateCounter();

// ==================== 7. CHUVA DE CORAÇÕES ====================
let heartInterval;
let heartTimeout; 

function loveExplosion() {
    clearInterval(heartInterval);
    clearTimeout(heartTimeout);

    heartInterval = setInterval(createHeart, 100);
    heartTimeout = setTimeout(() => { clearInterval(heartInterval); }, 4000);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-bg');
    heart.innerHTML = '❤️'; 
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
}

// ==================== 8. WRAPPED (STORIES) ====================
const stories = [
    { type: 'video', src: 'tela-wrapped/video1.webm', duration: 8500, caption: "amor da minha vida ❤️" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_142558_242.webp', duration: 5000, caption: "Momentos únicos...😻" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_142617_834.webp', duration: 5000, caption: "Nossas memórias ❤️" },
    { type: 'video', src: 'tela-wrapped/Video2.webm', duration: 3500, caption: "Teu sorriso...❤️" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_142657_499.webp', duration: 5000, caption: "Iluminas tudo!✨" },
    { type: 'image', src: 'tela-wrapped/IMG_20251006_162932_318.webp', duration: 5000, caption: "Juntos sempre.🫂" },
    { type: 'image', src: 'tela-wrapped/sobre_casal.jpg', duration: 6000, caption: "Meu mundo🌌" },
    { type: 'video', src: 'tela-wrapped/VID_20251229_140651_619.mp4', duration: 5000, caption: "Cada nosso reencontro🥹" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_153004_275.webp', duration: 6000, caption: "Minha garotinha❤️" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_142750_132.webp', duration: 5000, caption: "Sempre meu nenem.🥹" },
    { type: 'video', src: 'tela-wrapped/output.webm', duration: 4000, caption: "Sempre voce.😍" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_151428_109.webp', duration: 6000, caption: "Amo-te!❤️ " }
];

let animationDelayTimer; 
let isPaused = false;
let storyStartTime = 0;
let storyRemainingTime = 0;
let holdTimer; 
let isHolding = false;
let videoPlayPromise; 

function startWrapped() {
    mainScreen.style.display = 'none'; 
    wrappedScreen.classList.remove('hidden'); 
    wrappedScreen.classList.add('flex');
    if(isPlaying) togglePlay(); 
    initProgressBars();
    setupStoryControls();
    showStory(0);
}

function closeWrapped() {
    clearTimeout(storyTimer);
    clearTimeout(animationDelayTimer); 
    isPaused = false;
    if(storyVideo) { 
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.then(() => { storyVideo.pause(); storyVideo.src = ""; }).catch(() => {});
        } else {
            storyVideo.pause(); storyVideo.src = "";
        }
    }
    wrappedScreen.classList.add('hidden');
    wrappedScreen.classList.remove('flex');
    mainScreen.style.display = 'flex'; 
}

function initProgressBars() {
    if(!progressContainer) return;
    progressContainer.innerHTML = '';
    stories.forEach((_, index) => {
        const bar = document.createElement('div'); bar.className = 'progress-bar';
        const fill = document.createElement('div'); fill.className = 'progress-fill'; fill.id = `progress-${index}`;
        bar.appendChild(fill); progressContainer.appendChild(bar);
    });
}

function showStory(index) {
    if (index >= stories.length) { closeWrapped(); return; }
    if (index < 0) index = 0;
    
    clearTimeout(storyTimer); clearTimeout(animationDelayTimer); isPaused = false;
    currentIndex = index; const story = stories[index];

    preloadMedia(currentIndex);

    stories.forEach((_, i) => {
        const fill = document.getElementById(`progress-${i}`);
        if(fill) { fill.style.transition = 'none'; fill.style.width = (i < index) ? '100%' : '0%'; }
    });

    if (story.type === 'image') {
        storyVideo.classList.add('hidden'); 
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.then(() => storyVideo.pause()).catch(() => {});
        } else {
            storyVideo.pause();
        }
        storyImage.classList.remove('hidden'); storyImage.src = story.src;
        animateBar(story.duration);
    } else {
        storyImage.classList.add('hidden'); storyVideo.classList.remove('hidden');
        storyVideo.src = story.src; storyVideo.currentTime = 0;
        
        videoPlayPromise = storyVideo.play();
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.catch(e => {
                if(e.name !== 'AbortError') console.log("Erro vídeo:", e);
            });
        }
        animateBar(story.duration);
    }
    if(captionText) captionText.innerText = story.caption;
}

function animateBar(duration) {
    const fill = document.getElementById(`progress-${currentIndex}`);
    storyRemainingTime = duration; storyStartTime = Date.now(); 
    if(fill) {
        fill.style.transition = 'none'; fill.style.width = '0%';
        animationDelayTimer = setTimeout(() => {
            if(isPaused) return; 
            fill.style.transition = `width ${storyRemainingTime}ms linear`; fill.style.width = '100%';
        }, 50);
    }
    storyTimer = setTimeout(() => { nextStory(); }, storyRemainingTime);
}

function pauseStory() {
    if(isPaused) return;
    isPaused = true;
    clearTimeout(storyTimer); clearTimeout(animationDelayTimer);
    storyRemainingTime -= (Date.now() - storyStartTime);
    
    if (stories[currentIndex].type === 'video' && !storyVideo.paused) {
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.then(() => storyVideo.pause()).catch(() => {});
        } else {
            storyVideo.pause();
        }
    }
    
    const fill = document.getElementById(`progress-${currentIndex}`);
    if (fill) {
        const computedWidth = window.getComputedStyle(fill).width;
        fill.style.transition = 'none'; fill.style.width = computedWidth; 
    }
}

function resumeStory() {
    if(!isPaused) return;
    isPaused = false;
    
    if (stories[currentIndex].type === 'video') {
        videoPlayPromise = storyVideo.play();
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.catch(e => {
                if(e.name !== 'AbortError') console.log("Erro vídeo resume:", e);
            });
        }
    }
    
    const fill = document.getElementById(`progress-${currentIndex}`);
    if (fill) {
        fill.style.transition = `width ${storyRemainingTime}ms linear`; fill.style.width = '100%';
    }
    storyStartTime = Date.now();
    storyTimer = setTimeout(() => { nextStory(); }, storyRemainingTime);
}

function setupStoryControls() {
    const leftZone = document.getElementById('leftZone');
    const rightZone = document.getElementById('rightZone');

    function handlePointerDown(e, action) {
        isHolding = false;
        holdTimer = setTimeout(() => { isHolding = true; pauseStory(); }, 200); 
    }

    function handlePointerUp(action) {
        clearTimeout(holdTimer);
        if (isHolding) resumeStory();
        else { if (action === 'next') nextStory(); else prevStory(); }
        isHolding = false;
    }

    leftZone.replaceWith(leftZone.cloneNode(true)); rightZone.replaceWith(rightZone.cloneNode(true));
    const newLeft = document.getElementById('leftZone'); const newRight = document.getElementById('rightZone');

    newLeft.addEventListener('pointerdown', (e) => handlePointerDown(e, 'prev'));
    newLeft.addEventListener('pointerup', () => handlePointerUp('prev'));
    newLeft.addEventListener('pointercancel', () => handlePointerUp('prev')); 

    newRight.addEventListener('pointerdown', (e) => handlePointerDown(e, 'next'));
    newRight.addEventListener('pointerup', () => handlePointerUp('next'));
    newRight.addEventListener('pointercancel', () => handlePointerUp('next'));
}

function nextStory() { showStory(currentIndex + 1); }
function prevStory() { showStory(currentIndex - 1); }


// ==================== 9. SURPRESAS ESCONDIDAS (EASTER EGGS) ====================
function checkDay9Surprise() {
    const hoje = new Date();
    if (hoje.getDate() === 9) {
        const popup = document.getElementById('day9Popup');
        const card = document.getElementById('day9Card');
        
        if(popup && card) {
            popup.classList.remove('hidden');
            popup.classList.add('flex');
            
            setTimeout(() => {
                popup.classList.remove('opacity-0');
                popup.classList.add('opacity-100');
                card.classList.remove('scale-95');
                card.classList.add('scale-100');
                
                loveExplosion(); 
            }, 100);
        }
    }
}

function closeDay9Popup() {
    const popup = document.getElementById('day9Popup');
    const card = document.getElementById('day9Card');
    
    if(popup && card) {
        popup.classList.remove('opacity-100');
        popup.classList.add('opacity-0');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
        
        setTimeout(() => {
            popup.classList.add('hidden');
            popup.classList.remove('flex');
        }, 500); 
    }
}

function openSecretLetter() {
    const modal = document.getElementById('secretLetterModal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeSecretLetter() {
    const modal = document.getElementById('secretLetterModal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// ==================== 10. PWA - SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker Registado!', reg.scope))
        .catch(err => console.log('Erro no Service Worker:', err));
    });
}
