
import {
    Direction,
    Id,
    Pos,
    make_hints
} from './grid';

declare global {
  interface Target {
    step(paint: boolean): boolean;
  }
}

type StepFunction = (paint: boolean) => boolean;

export class AutoStepper {
    step: StepFunction;
    paused: boolean;

    constructor(step: StepFunction) {
        this.step = step;
        this.paused = true;
    }

    auto_step() {
        let next_frame_time = 0;

        function step(this: AutoStepper, timestamp: DOMHighResTimeStamp) {
            if(this.paused) {
                return;
            }
            if(timestamp >= next_frame_time) {
                const step_rate = parseInt((document.getElementById('auto_step_rate') as HTMLInputElement).value);
                next_frame_time = timestamp + (1000 / 60);

                for(let i = 0; i < step_rate; ++i) {
                    if(performance.now() >= next_frame_time) {
                        break;
                    }
                    if(!this.step(true)) {
                        this.auto_step_stop();
                        next_frame_time = 0;
                        return false;
                    }
                }
            }
            window.requestAnimationFrame(step.bind(this));
        }

        window.requestAnimationFrame(step.bind(this));
    }

    auto_step_start() {
        this.paused = false;
        const button = document.getElementById('auto') as HTMLButtonElement;
        button.innerHTML = 'stop';
        console.log(this);
        button.onclick = this.auto_step_stop.bind(this);

        this.auto_step();
    }

    auto_step_stop() {
        this.paused = true;
        const button = document.getElementById('auto') as HTMLButtonElement;
        button.innerHTML = 'start';
        button.onclick = this.auto_step_start.bind(this);
    }
}
