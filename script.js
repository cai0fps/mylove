// ==================== 1. VARIÁVEIS E SELEÇÃO ====================
const startDate = new Date(2025, 7, 9); // Mês 7 = Agosto

const audio = document.getElementById('audioPlayer');
const playIcon = document.getElementById('playIcon');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startSiteBtn');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');

// Variáveis da Barra de Progresso
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');
const progressBarContainer = document.getElementById('progressBarContainer');

// Elementos do Wrapped
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
    {
        title: "Sonha Comigo",
        artist: "Nossa Música",
        src: "videoplayback.weba"
    },
    {
        title: "Nosso Amor",
        artist: "5km",
        src: "videoplayback2.webm"
    },
    {
        title: "Para Sempre",
        artist: "duas metades",
        src: "videoplayback3.webm"
    }
];

let songIndex = 0; 

// Carrega a primeira música
loadSong(songs[songIndex]);

// ---> AQUI: MUDANÇA AUTOMÁTICA DE MÚSICA <---
audio.addEventListener('ended', nextSong);

function loadSong(song) {
    audio.src = song.src;
    if(songTitle) songTitle.innerText = song.title;
    if(songArtist) songArtist.innerText = song.artist;
    // Reseta os tempos visuais
    if(currentTimeEl) currentTimeEl.innerText = "0:00";
    if(progressBar) progressBar.style.width = "0%";
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1; 
    }
    loadSong(songs[songIndex]);
    if (isPlaying) audio.play();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0; 
    }
    loadSong(songs[songIndex]);
    if (isPlaying) audio.play();
}

function togglePlay() {
    if (!audio) return;
    if (isPlaying) {
        audio.pause();
        if(playIcon) {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    } else {
        audio.play();
        if(playIcon) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }
    }
    isPlaying = !isPlaying;
}

// ==================== 3. BARRA DE PROGRESSO ====================
audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    const duration = audio.duration;
    
    if(currentTimeEl) currentTimeEl.innerText = formatTime(current);

    if (!isNaN(duration) && duration > 0) {
        if(totalDurationEl) totalDurationEl.innerText = formatTime(duration);
        const percent = (current / duration) * 100;
        if(progressBar) progressBar.style.width = `${percent}%`;
    }
});

audio.addEventListener('loadedmetadata', () => {
    if(totalDurationEl && !isNaN(audio.duration)) {
        totalDurationEl.innerText = formatTime(audio.duration);
    }
});

function seek(event) {
    const width = progressBarContainer.clientWidth;
    const clickX = event.offsetX;
    const duration = audio.duration;
    
    if(!isNaN(duration) && duration > 0) {
        audio.currentTime = (clickX / width) * duration;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// ==================== 4. TELA DE ENTRADA ====================
if (startBtn && overlay) {
    startBtn.addEventListener('click', () => {
        if (audio) {
            audio.play().then(() => {
                isPlaying = true;
                if(playIcon) {
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                }
            }).catch(e => console.log("Erro áudio:", e));
        }
        overlay.style.display = 'none';
    });
}

// ==================== 5. MENSAGEM ====================
function toggleMessage() {
    const container = document.getElementById('messageContainer');
    const btn = event.target; 
    
    if (container.style.height === "auto") {
        btn.innerText = "Ler tudo";
        container.style.height = "10rem"; 
    } else {
        btn.innerText = "Recolher";
        container.style.height = "auto";
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

// ==================== 7. CHUVA DE CORAÇÕES (A FUNÇÃO) ====================
let heartInterval;

function loveExplosion() {
    // Cria corações rapidamente (a cada 100ms)
    heartInterval = setInterval(createHeart, 100);
    
    // Para a chuva depois de 3 segundos
    setTimeout(() => {
        clearInterval(heartInterval);
    }, 3000);
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
    { type: 'image', src: 'tela-wrapped/sobre casal.jpg', duration: 6000, caption: "Meu mundo🌌" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_153004_275.webp', duration: 6000, caption: "Minha garotinha❤️" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_142750_132.webp', duration: 5000, caption: "Sempre meu nenem.🥹" },
    { type: 'video', src: 'tela-wrapped/output.webm', duration: 4000, caption: "Sempre voce.😍" },
    { type: 'image', src: 'tela-wrapped/IMG_20251009_151428_109.webp', duration: 6000, caption: "Amo-te!❤️ " }
];

function startWrapped() {
    mainScreen.style.display = 'none'; 
    wrappedScreen.classList.remove('hidden'); 
    wrappedScreen.classList.add('flex');
    if(isPlaying) togglePlay(); 
    initProgressBars();
    showStory(0);
}

function closeWrapped() {
    clearTimeout(storyTimer);
    if(storyVideo) storyVideo.pause();
    wrappedScreen.classList.add('hidden');
    wrappedScreen.classList.remove('flex');
    mainScreen.style.display = 'flex'; 
}

function initProgressBars() {
    if(!progressContainer) return;
    progressContainer.innerHTML = '';
    stories.forEach((_, index) => {
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        const fill = document.createElement('div');
        fill.className = 'progress-fill';
        fill.id = `progress-${index}`;
        bar.appendChild(fill);
        progressContainer.appendChild(bar);
    });
}

function showStory(index) {
    if (index >= stories.length) { closeWrapped(); return; }
    if (index < 0) index = 0;
    currentIndex = index;
    const story = stories[index];

    stories.forEach((_, i) => {
        const fill = document.getElementById(`progress-${i}`);
        if(fill) {
            fill.style.transition = 'none';
            fill.style.width = (i < index) ? '100%' : '0%';
        }
    });

    if (story.type === 'image') {
        storyVideo.classList.add('hidden');
        storyVideo.pause();
        storyImage.classList.remove('hidden');
        storyImage.src = story.src;
        animateBar(story.duration);
    } else {
        storyImage.classList.add('hidden');
        storyVideo.classList.remove('hidden');
        storyVideo.src = story.src;
        storyVideo.currentTime = 0;
        storyVideo.play().catch(e => console.log("Erro vídeo:", e));
        animateBar(story.duration);
    }
    if(captionText) captionText.innerText = story.caption;
}

function animateBar(duration) {
    clearTimeout(storyTimer);
    const fill = document.getElementById(`progress-${currentIndex}`);
    if(fill) {
        setTimeout(() => {
            fill.style.transition = `width ${duration}ms linear`;
            fill.style.width = '100%';
        }, 50);
    }
    storyTimer = setTimeout(() => { nextStory(); }, duration);
}

function nextStory() { showStory(currentIndex + 1); }

function prevStory() { showStory(currentIndex - 1); }
