
import {
    Direction,
    Id,
    Pos,
    make_hints
} from './grid';

import {
    Action,
    GridState,
    Status,
    make_grid_state,
    parse_code
} from './grid_state';

import {
    RuleReducer,
    SetStatus
} from './rule_reducer';

import {
    DrawRequest,
    View
} from './view';

import {
    AutoStepper
} from './auto_stepper';

declare global {
  interface Window {
    view: SolverView;
  }
}

export class SolverView {
    view!: View;
    rule_reducer!: RuleReducer;
    auto_stepper!: AutoStepper;

    constructor(canvas: any) {
        this.view = new View(canvas);
        this.auto_stepper = new AutoStepper(this.solve_step.bind(this));

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

        this.set_grid_state(make_grid_state(4, 4, [
                { pos: { x: 1, y: 1 }, direction: Direction.South },
                { pos: { x: 0, y: 2 }, direction: Direction.East },
                { pos: { x: 1, y: 4 }, direction: Direction.East },
                { pos: { x: 2, y: 4 }, direction: Direction.South }
            ],
            make_hints([4,3,3,2], [4,3,3,2])
        ));

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
        const id = this.view.pick(pixel_pos);

        if(id != null) {
            const status = this.view.grid_state.statuses.get(id);
            let new_status;
            if(left_click && status == Status.Live) {
                new_status = Status.Unknown;
            } else if(left_click && status == Status.Unknown) {
                new_status = Status.Live;
            } else if(!left_click && status == Status.Dead) {
                new_status = Status.Unknown;
            } else if(!left_click && status == Status.Unknown) {
                new_status = Status.Dead;
            }

            if(new_status != null) {
                if(id.charAt(0) == 'l') {
                    this.execute(new SetStatus(this.rule_reducer, this.view.grid_state.grid.links.get(id)!.node, new_status, "click"), true);
                } else {
                    this.execute(new SetStatus(this.rule_reducer, this.view.grid_state.grid.cells.get(id)!.node, new_status, "click"), true);
                }
            }
        }
    }

    next_candidate(): Id | null {
        let next_candidate = this.rule_reducer.next_candidate(this.rule_reducer.candidates);
        if(next_candidate == null) {
            next_candidate = this.rule_reducer.next_candidate(this.rule_reducer.guessables);
        }
        return next_candidate;

        /* idk why this don't work
        return
            this.rule_reducer.next_candidate(this.rule_reducer.candidates) ||
            this.rule_reducer.next_candidate(this.rule_reducer.guessables) ||
            null;
            */
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

    solve_step(paint: boolean): boolean {
        const action = this.rule_reducer.process();
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

