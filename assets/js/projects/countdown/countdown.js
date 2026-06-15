// BOTÃO - MUTE
const muteBtn = document.getElementById('button-audio');
const audioPath = window.customAudioPath;

if (muteBtn) {
    if (audioPath) {
        const bgMusic = new Audio(audioPath);
        bgMusic.loop = true;

        muteBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    bgMusic.volume = 1;
                    muteBtn.textContent = '🔊';
                }).catch(error => {
                    console.error("Erro ao tocar áudio. Verifique o caminho (audioPath):", error);
                });
            } else if (bgMusic.volume > 0) {
                bgMusic.volume = 0;
                muteBtn.textContent = '🔇';
            } else {
                bgMusic.volume = 1;
                muteBtn.textContent = '🔊';
            }
        });
    } else {
        // Oculta o botão automaticamente caso não tenha áudio definido no HTML
        muteBtn.style.display = 'none';
    }
}

// TIMER
class CountdownTimer {
    constructor(targetDate, elementId) {
        this.targetDate = targetDate.getTime();
        this.element = document.getElementById(elementId);
        this.interval = null;

        if (this.element) {
            this.start();
        }
    }

    calculateTime() {
        const now = new Date().getTime();
        return this.targetDate - now;
    }

    updateDisplay(milliseconds) {
        const displayMs = milliseconds > 0 ? milliseconds : 0;

        const d = Math.floor(displayMs / (1000 * 60 * 60 * 24));
        const h = Math.floor((displayMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((displayMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((displayMs % (1000 * 60)) / 1000);

        this.element.textContent = `${d.toString().padStart(2, '0')}D ${h.toString().padStart(2, '0')}H ${m.toString().padStart(2, '0')}M ${s.toString().padStart(2, '0')}S`;
    }

    tick() {
        const milliseconds = this.calculateTime();

        if (milliseconds > 0) {
            this.updateDisplay(milliseconds);
        } else {
            this.updateDisplay(0);
            this.stop();
        }
    }

    start() {
        this.tick();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }
}

// ANO, MÊS, DIA, HORA, MINUTO, SEGUNDO
// GMT (Brasil) -> UTC (Londres) = + 3h
// JAN = 0 | FEV = 1 | MAR = 2 | ABR = 3 | MAI = 4 | JUN = 5 | JUL = 6 | AGO = 7 | SET = 8 | OUT = 9 | NOV = 10 | DEZ = 11

let hideNewsTimeout; // Variável para controlar o temporizador do fade-out
let timerFadeTimeout; // Variável para controlar o temporizador do contador

function showLastNews(event) {
    event.preventDefault();
    clearTimeout(hideNewsTimeout); // Cancela o fechamento se o usuário clicar rápido demais
    clearTimeout(timerFadeTimeout);
    const newsSection = document.getElementById('last-news');
    const scrollDownBtn = document.querySelector('.scroll-down-wrapper');
    const timersWrapper = document.querySelector('.timers-wrapper');
    const subnavbar = document.querySelector('.subnavbar');

    if (scrollDownBtn) scrollDownBtn.classList.add('hide'); // Esconde o botão LAST NEWS
    if (timersWrapper) timersWrapper.classList.add('hide-timer'); // Inicia o fade-out do contador
    if (subnavbar) subnavbar.classList.add('hide'); // Inicia o fade-out da navbar junto com o contador

    // Aguarda o contador sumir para mostrar as notícias (500ms)
    timerFadeTimeout = setTimeout(() => {
        if (timersWrapper) timersWrapper.style.display = 'none'; // Some com o timer do layout

        document.body.classList.add('news-open'); // Evita que o Flexbox empurre a tela pra cima
        newsSection.style.display = 'block';
        window.scrollTo(0, 0); // Força a tela para o topo

        setTimeout(() => {
            newsSection.classList.add('show'); // Fade-in suave das notícias
        }, 10);
    }, 500);
}

function hideLastNews(event) {
    event.preventDefault();
    clearTimeout(hideNewsTimeout);
    clearTimeout(timerFadeTimeout);
    const newsSection = document.getElementById('last-news');
    const scrollDownBtn = document.querySelector('.scroll-down-wrapper');
    const timersWrapper = document.querySelector('.timers-wrapper');
    const subnavbar = document.querySelector('.subnavbar');

    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola de volta ao topo
    newsSection.classList.remove('show'); // Inicia o sumiço do bloco preto (fade-out)

    // Aguarda o tempo da rolagem e do fade (500ms) antes de apagar totalmente
    hideNewsTimeout = setTimeout(() => {
        newsSection.style.display = 'none';
        document.body.classList.remove('news-open'); // Restaura o alinhamento original

        if (timersWrapper) {
            timersWrapper.style.display = 'flex'; // Devolve o espaço do contador
            if (scrollDownBtn) scrollDownBtn.classList.remove('hide'); // Traz o botão LAST NEWS de volta

            setTimeout(() => {
                timersWrapper.classList.remove('hide-timer'); // Fade-in do contador
                if (subnavbar) subnavbar.classList.remove('hide'); // Fade-in da navbar
            }, 10);
        }
    }, 500);
}