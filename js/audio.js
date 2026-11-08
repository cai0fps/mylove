export function initAudio(songs) {
    if (!songs || songs.length === 0) return;

    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('btnPlay');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('btnPrev');
    const nextBtn = document.getElementById('btnNext');
    const shuffleBtn = document.getElementById('btnShuffle');
    const repeatBtn = document.getElementById('btnRepeat');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressBarContainer');
    
    let songIndex = parseInt(localStorage.getItem('mylove_songIndex'), 10);
    if (isNaN(songIndex) || songIndex < 0 || songIndex >= songs.length) {
        songIndex = 0;
    }
    
    let isShuffle = false;
    let isRepeat = false;
    let lastStorageSave = 0;

    function restoreTime() {
        const savedTime = parseFloat(localStorage.getItem('mylove_currentTime'));
        if (!isNaN(savedTime) && isFinite(audio.duration) && savedTime < audio.duration) {
            audio.currentTime = savedTime;
        }
    }

    function updateMediaSession(song) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: 'MyLove',
                artwork: [
                    { src: 'tela-inicial/nova.jpg', sizes: '512x512', type: 'image/jpeg' }
                ]
            });
        }
    }

    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        document.getElementById('songTitle').innerText = song.title;
        document.getElementById('songArtist').innerText = song.artist;
        
        localStorage.setItem('mylove_songIndex', index.toString());
        updateMediaSession(song);

        if (audio.readyState >= 1) {
            restoreTime();
        } else {
            const onLoaded = () => {
                restoreTime();
                audio.removeEventListener('loadedmetadata', onLoaded);
            };
            audio.addEventListener('loadedmetadata', onLoaded);
        }
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().catch(e => console.error('Erro ao tocar áudio:', e));
        } else {
            audio.pause();
        }
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
        // Se a música já tocou por mais de 3 segundos, reinicia a atual
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            audio.play().catch(e => console.error(e));
            return;
        }
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        localStorage.setItem('mylove_currentTime', '0');
        loadSong(songIndex);
        audio.play().catch(e => console.error(e));
    }

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audio.addEventListener('ended', () => {
        if (!isRepeat) {
            nextSong();
        }
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('text-pink-500', isShuffle);
        shuffleBtn.classList.toggle('text-gray-400', !isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        audio.loop = isRepeat;
        repeatBtn.classList.toggle('text-pink-500', isRepeat);
        repeatBtn.classList.toggle('text-gray-400', !isRepeat);
    });

    audio.addEventListener('play', () => {
        playIcon.classList.replace('fa-play', 'fa-pause');
        playIcon.classList.remove('ml-1');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
        }
    });

    audio.addEventListener('pause', () => {
        playIcon.classList.replace('fa-pause', 'fa-play');
        playIcon.classList.add('ml-1');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const current = audio.currentTime;
        const duration = audio.duration;
        if (isFinite(duration) && duration > 0) {
            progressBar.style.width = `${(current / duration) * 100}%`;
            document.getElementById('currentTime').innerText = formatTime(current);
            document.getElementById('totalDuration').innerText = formatTime(duration);
            
            // Gravação no localStorage com throttle (a cada 2 segundos)
            const now = Date.now();
            if (now - lastStorageSave > 2000) {
                localStorage.setItem('mylove_currentTime', current.toString());
                lastStorageSave = now;
            }
        }
    });

    function seekFromEvent(e) {
        if (!isFinite(audio.duration) || audio.duration <= 0) return;
        const rect = progressContainer.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left);
        const clickX = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));
        audio.currentTime = percent * audio.duration;
        localStorage.setItem('mylove_currentTime', audio.currentTime.toString());
    }

    progressContainer.addEventListener('click', seekFromEvent);

    function formatTime(sec) {
        if (!isFinite(sec) || isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // Suporte aos controles da barra de notificação/tela de bloqueio (MediaSession)
    if ('mediaSession' in navigator) {
        try {
            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
            navigator.mediaSession.setActionHandler('previoustrack', prevSong);
            navigator.mediaSession.setActionHandler('nexttrack', nextSong);
        } catch (e) {
            // Ignora navegadores que não suportam certas ações
        }
    }

    loadSong(songIndex);
}
