// BOTÃO - MUTE
const muteBtn = document.getElementById('button-audio');
const audioPath = window.customAudioPath;
const bgMusic = new Audio(audioPath);
bgMusic.loop = true;

if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if(bgMusic.paused){
            bgMusic.play();
            bgMusic.volume = 1;
            muteBtn.textContent = '🔊';
        }else if(bgMusic.volume > 0){
            bgMusic.volume = 0;
            muteBtn.textContent = '🔇';
        }else{
            bgMusic.volume = 1;
            muteBtn.textContent = '🔊';
        }
    });
}

// TIMER
class CountdownTimer {
    constructor(targetDate, elementId){
        this.targetDate = targetDate.getTime();
        this.element = document.getElementById(elementId);
        this.interval = null;

        if(this.element){
            this.start();
        }
    }

    calculateTime(){
        const now = new Date().getTime();
        return this.targetDate - now;
    }

    updateDisplay(milliseconds){
        const displayMs = milliseconds > 0 ? milliseconds : 0;

        const d = Math.floor(displayMs / (1000 * 60 * 60 * 24));
        const h = Math.floor((displayMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((displayMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((displayMs % (1000 * 60)) / 1000);

        this.element.textContent = `${d.toString().padStart(2, '0')}D ${h.toString().padStart(2, '0')}H ${m.toString().padStart(2, '0')}M ${s.toString().padStart(2, '0')}S`;
    }

    tick(){
        const milliseconds = this.calculateTime();

        if(milliseconds > 0){
            this.updateDisplay(milliseconds);
        }else{
            this.updateDisplay(0);
            this.stop();
        }
    }

    start(){
        this.tick();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    stop(){
        clearInterval(this.interval);
        this.interval = null;
    }
}

// ANO, MÊS, DIA, HORA, MINUTO, SEGUNDO
// GMT (Brasil) -> UTC (Londres) = + 3h
// JAN = 0 | FEV = 1 | MAR = 2 | ABR = 3 | MAI = 4 | JUN = 5 | JUL = 6 | AGO = 7 | SET = 8 | OUT = 9 | NOV = 10 | DEZ = 11