import { initAudio } from './audio.js';
import { initUI } from './ui.js';
import { initTimer } from './timer.js';
import { initWrapped } from './wrapped.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('config.json');
        const config = await response.json();

        // Inicializa Módulos passando o Config
        initUI(config);
        initAudio(config.songs);
        initTimer(config.startDate);
        initWrapped(config.stories);

        // Service Worker PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('SW Registrado com sucesso.'))
                .catch(err => console.error('Erro no SW:', err));
        }
    } catch (error) {
        console.error('Falha ao iniciar app. Você está offline?', error);
    }
});
