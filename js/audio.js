export function initAudio(songs) {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('btnPlay');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('btnPrev');
    const nextBtn = document.getElementById('btnNext');
    const shuffleBtn = document.getElementById('btnShuffle');
    const repeatBtn = document.getElementById('btnRepeat');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressBarContainer');
    
    let songIndex = parseInt(localStorage.getItem('mylove_songIndex')) || 0;
    let isShuffle = false;
    let isRepeat = false;

    function loadSong(index) {
        audio.src = songs[index].src;
        document.getElementById('songTitle').innerText = songs[index].title;
        document.getElementById('songArtist').innerText = songs[index].artist;
        
        const savedTime = parseFloat(localStorage.getItem('mylove_currentTime'));
        if (savedTime && audio.readyState > 0) audio.currentTime = savedTime;
        localStorage.setItem('mylove_songIndex', index);
    }

    function togglePlay() {
        if (audio.paused) audio.play().catch(e => console.error(e));
        else audio.pause();
    }

    function nextSong() {
        if (isShuffle) {
            let newIndex = songIndex;
            if (songs.length > 1) {
                while (newIndex === songIndex) {
                    newIndex = Math.floor(Math.random() * songs.length);
                }
            }
            songIndex = newIndex;
        } else {
            songIndex = (songIndex + 1) % songs.length;
        }
        localStorage.setItem('mylove_currentTime', '0');
        loadSong(songIndex);
        audio.play().catch(e => console.error(e));
    }

    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        localStorage.setItem('mylove_currentTime', '0');
        loadSong(songIndex);
        audio.play().catch(e => console.error(e));
    }

    // Eventos de Controle Básico
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audio.addEventListener('ended', nextSong);

    // Lógica de Aleatório e Repetir
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('text-pink-500', isShuffle);
        shuffleBtn.classList.toggle('text-gray-400', !isShuffle);
        // Garante que o ícone interno também mude de cor
        shuffleBtn.querySelector('i').classList.toggle('text-pink-500', isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        audio.loop = isRepeat; // Faz o áudio repetir nativamente
        repeatBtn.classList.toggle('text-pink-500', isRepeat);
        repeatBtn.classList.toggle('text-gray-400', !isRepeat);
        repeatBtn.querySelector('i').classList.toggle('text-pink-500', isRepeat);
    });

    audio.addEventListener('play', () => {
        playIcon.classList.replace('fa-play', 'fa-pause');
        playIcon.classList.remove('ml-1');
    });

    audio.addEventListener('pause', () => {
        playIcon.classList.replace('fa-pause', 'fa-play');
        playIcon.classList.add('ml-1');
    });

    audio.addEventListener('timeupdate', () => {
        const current = audio.currentTime;
        const duration = audio.duration;
        if (duration) {
            progressBar.style.width = `${(current / duration) * 100}%`;
            document.getElementById('currentTime').innerText = formatTime(current);
            document.getElementById('totalDuration').innerText = formatTime(duration);
            if (Math.floor(current) % 2 === 0) localStorage.setItem('mylove_currentTime', current);
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    loadSong(songIndex);
}
