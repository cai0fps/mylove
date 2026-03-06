export function initWrapped(stories) {
    const wrappedScreen = document.getElementById('wrappedScreen');
    const mainScreen = document.getElementById('mainScreen');
    const storyImage = document.getElementById('storyImage');
    const storyVideo = document.getElementById('storyVideo');
    const progressContainer = document.getElementById('progressContainer');
    const captionText = document.getElementById('captionText');
    const btnStartWrapped = document.getElementById('btnStartWrapped');
    const btnCloseWrapped = document.getElementById('btnCloseWrapped');
    
    let currentIndex = 0;
    let storyTimer;
    let animationDelayTimer;
    let isPaused = false;
    let storyStartTime = 0;
    let storyRemainingTime = 0;
    let holdTimer;
    let isHolding = false;
    let videoPlayPromise;

    btnStartWrapped.addEventListener('click', startWrapped);
    btnCloseWrapped.addEventListener('click', closeWrapped);

    function startWrapped() {
        mainScreen.style.display = 'none';
        wrappedScreen.classList.remove('hidden');
        wrappedScreen.classList.add('flex');
        
        // Pausar música principal ao abrir stories
        const audio = document.getElementById('audioPlayer');
        if (audio && !audio.paused) {
            audio.pause();
            document.getElementById('playIcon').classList.replace('fa-pause', 'fa-play');
            document.getElementById('playIcon').classList.add('ml-1');
        }
        
        initProgressBars();
        setupStoryControls();
        showStory(0);
    }

    function closeWrapped() {
        clearTimeout(storyTimer);
        clearTimeout(animationDelayTimer);
        isPaused = false;
        if (storyVideo) {
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
        if (!progressContainer) return;
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

        stories.forEach((_, i) => {
            const fill = document.getElementById(`progress-${i}`);
            if (fill) { fill.style.transition = 'none'; fill.style.width = (i < index) ? '100%' : '0%'; }
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
                    if (e.name !== 'AbortError') console.log("Erro vídeo:", e);
                });
            }
            animateBar(story.duration);
        }
        if (captionText) captionText.innerText = story.caption;
    }

    function animateBar(duration) {
        const fill = document.getElementById(`progress-${currentIndex}`);
        storyRemainingTime = duration; storyStartTime = Date.now();
        if (fill) {
            fill.style.transition = 'none'; fill.style.width = '0%';
            animationDelayTimer = setTimeout(() => {
                if (isPaused) return;
                fill.style.transition = `width ${storyRemainingTime}ms linear`; fill.style.width = '100%';
            }, 50);
        }
        storyTimer = setTimeout(() => { nextStory(); }, storyRemainingTime);
    }

    function pauseStory() {
        if (isPaused) return;
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
        if (!isPaused) return;
        isPaused = false;
        
        if (stories[currentIndex].type === 'video') {
            videoPlayPromise = storyVideo.play();
            if (videoPlayPromise !== undefined) {
                videoPlayPromise.catch(e => {
                    if (e.name !== 'AbortError') console.log("Erro vídeo resume:", e);
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

        function handlePointerDown(e) {
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

        newLeft.addEventListener('pointerdown', handlePointerDown);
        newLeft.addEventListener('pointerup', () => handlePointerUp('prev'));
        newLeft.addEventListener('pointercancel', () => handlePointerUp('prev'));

        newRight.addEventListener('pointerdown', handlePointerDown);
        newRight.addEventListener('pointerup', () => handlePointerUp('next'));
        newRight.addEventListener('pointercancel', () => handlePointerUp('next'));
    }

    function nextStory() { showStory(currentIndex + 1); }
    function prevStory() { showStory(currentIndex - 1); }
}
