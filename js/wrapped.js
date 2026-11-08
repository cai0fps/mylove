export function initWrapped(stories) {
    if (!stories || stories.length === 0) return;

    const wrappedScreen = document.getElementById('wrappedScreen');
    const mainScreen = document.getElementById('mainScreen');
    const storyImage = document.getElementById('storyImage');
    const storyVideo = document.getElementById('storyVideo');
    const progressContainer = document.getElementById('progressContainer');
    const captionText = document.getElementById('captionText');
    const btnStartWrapped = document.getElementById('btnStartWrapped');
    const btnCloseWrapped = document.getElementById('btnCloseWrapped');
    
    let currentIndex = 0;
    let storyTimer = null;
    let animationDelayTimer = null;
    let isPaused = false;
    let storyStartTime = 0;
    let storyRemainingTime = 0;
    let holdTimer = null;
    let isHolding = false;
    let videoPlayPromise = null;
    let wasAudioPlayingBefore = false;

    btnStartWrapped.addEventListener('click', startWrapped);
    btnCloseWrapped.addEventListener('click', closeWrapped);

    function startWrapped() {
        mainScreen.style.display = 'none';
        wrappedScreen.classList.remove('hidden');
        wrappedScreen.classList.add('flex');
        
        // Pausar música principal ao abrir stories e lembrar status
        const audio = document.getElementById('audioPlayer');
        if (audio && !audio.paused) {
            wasAudioPlayingBefore = true;
            audio.pause();
        } else {
            wasAudioPlayingBefore = false;
        }
        
        initProgressBars();
        setupStoryControls();
        showStory(0);
    }

    function closeWrapped() {
        clearTimeout(storyTimer);
        clearTimeout(animationDelayTimer);
        clearTimeout(holdTimer);
        isPaused = false;
        isHolding = false;

        if (storyVideo) {
            storyVideo.onended = null;
            storyVideo.onplaying = null;
            if (videoPlayPromise !== undefined && videoPlayPromise !== null) {
                videoPlayPromise.then(() => {
                    storyVideo.pause();
                    storyVideo.removeAttribute('src');
                    storyVideo.load();
                }).catch(() => {
                    storyVideo.removeAttribute('src');
                    storyVideo.load();
                });
            } else {
                storyVideo.pause();
                storyVideo.removeAttribute('src');
                storyVideo.load();
            }
        }

        if (storyImage) {
            storyImage.src = '';
        }

        wrappedScreen.classList.add('hidden');
        wrappedScreen.classList.remove('flex');
        mainScreen.style.display = '';

        // Se a música estava tocando antes dos stories, retoma
        const audio = document.getElementById('audioPlayer');
        if (audio && wasAudioPlayingBefore) {
            audio.play().catch(() => {});
        }
    }

    function initProgressBars() {
        if (!progressContainer) return;
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
        if (index >= stories.length) {
            closeWrapped();
            return;
        }
        if (index < 0) index = 0;
        
        clearTimeout(storyTimer);
        clearTimeout(animationDelayTimer);
        isPaused = false;
        currentIndex = index;
        const story = stories[index];

        stories.forEach((_, i) => {
            const fill = document.getElementById(`progress-${i}`);
            if (fill) {
                fill.style.transition = 'none';
                fill.style.width = (i < index) ? '100%' : '0%';
            }
        });

        if (captionText) {
            captionText.innerText = story.caption || '';
        }

        if (story.type === 'image') {
            storyVideo.classList.add('hidden');
            storyVideo.onended = null;
            storyVideo.onplaying = null;

            if (videoPlayPromise !== undefined && videoPlayPromise !== null) {
                videoPlayPromise.then(() => storyVideo.pause()).catch(() => {});
            } else {
                storyVideo.pause();
            }

            storyImage.classList.remove('hidden');
            storyImage.src = story.src;

            // Inicia barra quando a imagem já estiver em cache ou ao carregar
            if (storyImage.complete) {
                animateBar(story.duration);
            } else {
                storyImage.onload = () => animateBar(story.duration);
            }
        } else {
            storyImage.classList.add('hidden');
            storyVideo.classList.remove('hidden');
            storyVideo.src = story.src;
            storyVideo.currentTime = 0;
            
            // Avança automaticamente quando o vídeo terminar
            storyVideo.onended = () => {
                nextStory();
            };

            // Inicia o progresso apenas quando o vídeo de fato começar a reproduzir
            storyVideo.onplaying = () => {
                const duration = (story.duration && story.duration > 0) 
                    ? story.duration 
                    : (storyVideo.duration ? storyVideo.duration * 1000 : 5000);
                animateBar(duration);
            };

            videoPlayPromise = storyVideo.play();
            if (videoPlayPromise !== undefined && videoPlayPromise !== null) {
                videoPlayPromise.catch(e => {
                    if (e.name !== 'AbortError') {
                        console.log("Erro vídeo:", e);
                        // Se o vídeo não tocar, continua com o timer normal
                        animateBar(story.duration);
                    }
                });
            }
        }
    }

    function animateBar(duration) {
        clearTimeout(storyTimer);
        clearTimeout(animationDelayTimer);

        const fill = document.getElementById(`progress-${currentIndex}`);
        storyRemainingTime = duration;
        storyStartTime = Date.now();

        if (fill) {
            fill.style.transition = 'none';
            fill.style.width = '0%';
            animationDelayTimer = setTimeout(() => {
                if (isPaused) return;
                fill.style.transition = `width ${storyRemainingTime}ms linear`;
                fill.style.width = '100%';
            }, 50);
        }

        storyTimer = setTimeout(() => {
            nextStory();
        }, storyRemainingTime);
    }

    function pauseStory() {
        if (isPaused) return;
        isPaused = true;
        clearTimeout(storyTimer);
        clearTimeout(animationDelayTimer);

        const elapsed = Date.now() - storyStartTime;
        storyRemainingTime = Math.max(0, storyRemainingTime - elapsed);
        
        if (stories[currentIndex].type === 'video' && !storyVideo.paused) {
            if (videoPlayPromise !== undefined && videoPlayPromise !== null) {
                videoPlayPromise.then(() => storyVideo.pause()).catch(() => {});
            } else {
                storyVideo.pause();
            }
        }
        
        const fill = document.getElementById(`progress-${currentIndex}`);
        if (fill) {
            const computedWidth = window.getComputedStyle(fill).width;
            fill.style.transition = 'none';
            fill.style.width = computedWidth;
        }
    }

    function resumeStory() {
        if (!isPaused) return;
        isPaused = false;
        
        if (stories[currentIndex].type === 'video') {
            videoPlayPromise = storyVideo.play();
            if (videoPlayPromise !== undefined && videoPlayPromise !== null) {
                videoPlayPromise.catch(e => {
                    if (e.name !== 'AbortError') console.log("Erro ao retomar vídeo:", e);
                });
            }
        }
        
        const fill = document.getElementById(`progress-${currentIndex}`);
        if (fill) {
            fill.style.transition = `width ${storyRemainingTime}ms linear`;
            fill.style.width = '100%';
        }
        storyStartTime = Date.now();
        storyTimer = setTimeout(() => {
            nextStory();
        }, storyRemainingTime);
    }

    function setupStoryControls() {
        const leftZone = document.getElementById('leftZone');
        const rightZone = document.getElementById('rightZone');
        if (!leftZone || !rightZone) return;

        function handlePointerDown(e) {
            isHolding = false;
            holdTimer = setTimeout(() => {
                isHolding = true;
                pauseStory();
            }, 200);
        }

        function handlePointerUp(action) {
            clearTimeout(holdTimer);
            if (isHolding) {
                resumeStory();
            } else {
                if (action === 'next') nextStory();
                else prevStory();
            }
            isHolding = false;
        }

        function handlePointerCancel() {
            clearTimeout(holdTimer);
            if (isHolding) {
                resumeStory();
            }
            isHolding = false;
        }

        leftZone.replaceWith(leftZone.cloneNode(true));
        rightZone.replaceWith(rightZone.cloneNode(true));
        const newLeft = document.getElementById('leftZone');
        const newRight = document.getElementById('rightZone');

        newLeft.addEventListener('pointerdown', handlePointerDown);
        newLeft.addEventListener('pointerup', () => handlePointerUp('prev'));
        newLeft.addEventListener('pointercancel', handlePointerCancel);

        newRight.addEventListener('pointerdown', handlePointerDown);
        newRight.addEventListener('pointerup', () => handlePointerUp('next'));
        newRight.addEventListener('pointercancel', handlePointerCancel);
    }

    function nextStory() {
        showStory(currentIndex + 1);
    }

    function prevStory() {
        showStory(currentIndex - 1);
    }
}
