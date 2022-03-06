
import {
    Direction,
    Id,
    Pos
} from './grid';

import {
    Action,
    GridState,
    Status
} from './grid_state';

import {
    GridGenerator
} from './generator';

import {
    DrawRequest,
    View
} from './view';

import {
    AutoStepper
} from './auto_stepper';

declare global {
  interface Window {
    view: GeneratorView;
  }
}

export class GeneratorView {
    view!: View;
    auto_stepper!: AutoStepper;
    generator!: GridGenerator;

    constructor(canvas: any) {
        this.view = new View(canvas);
        this.auto_stepper = new AutoStepper(this.solve_step.bind(this));
        this.generator = new GridGenerator();

        canvas.addEventListener('click', (event: any) => {
            this.click(true, this.event_pos(event));
            event.preventDefault();
            return false;
        });
        canvas.addEventListener('contextmenu', (event: any) => {
            this.click(false, this.event_pos(event));
            event.preventDefault();
            return false;
        });

        // set_grid_state?

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', this.redraw_all.bind(this), false);
    }

    set_grid_state(grid_state: GridState) {
        this.rule_reducer = new RuleReducer(grid_state, new Set(), new Set(), new Map(), true);
        this.rule_reducer.initialize();
        this.view.set_grid_state(grid_state);
        this.redraw_all();
    }

    event_pos(event: MouseEvent): Pos {
        return { x: event.offsetX, y: event.offsetY };
    }

    click(left_click: boolean, pixel_pos: Pos) {
    }

    execute(action: Action, paint: boolean) {
        const updated_ids = action.execute();

        if(paint) {
            this.redraw(updated_ids);
        }
    }

    redraw_all() {
        this.view.resize_canvas();
        this.redraw([...this.view.grid.hints.keys(), ...this.view.grid.cells.keys(), ...this.view.grid.links.keys()]);
    }

    redraw(ids: Array<Id>) {
        const updated_ids = Array.from(ids);
        const next_candidate = this.next_candidate();
        if(next_candidate !== null) {
            updated_ids.push(next_candidate);
        }
        this.view.redraw(ids.map((id) => this.get_draw_request(id)));
    }

    get_draw_request(id: Id): DrawRequest {
        const is_candidate = this.rule_reducer.candidates.has(id) || (this.rule_reducer.candidates.size == 0 && this.rule_reducer.guessables.has(id));
        const is_next_candidate = (id == this.next_candidate());
        return { id, is_candidate, is_next_candidate };
    }

    generate_step(paint: boolean): boolean {
        const action = this.generator.process();
        if(action) {
            this.execute(action, paint);
            return true;
        } else {
            return false;
        }
    }

    parse() {
        this.auto_stepper.auto_step_stop();
        const code = (document.getElementById('code') as HTMLInputElement).value;
        this.set_grid_state(parse_code(code));
    }

    encode() {
        this.auto_stepper.auto_step_stop();
        console.log(this.view.grid_state.encode());
    }
}

const canvas = document.getElementById('canvas');
window.view = new SolverView(canvas);

