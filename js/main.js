import { initUI } from './ui.js';
import { initAudio } from './audio.js';
import { initTimer } from './timer.js';
import { initWrapped } from './wrapped.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('Erro ao carregar o arquivo config.json');
        
        const config = await response.json();

        // Inicializa os módulos passando os dados do JSON
        initUI(config);
        
        if (config.songs && config.songs.length > 0) {
            initAudio(config.songs);
        }
        
        if (config.startDate) {
            initTimer(config.startDate);
        }
        
        if (config.stories && config.stories.length > 0) {
            initWrapped(config.stories);
        }

    } catch (error) {
        console.error('Falha crítica na inicialização do MyLove:', error);
    }
});
