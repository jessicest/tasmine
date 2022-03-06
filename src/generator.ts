
// to generate:
// inputs: width and height
// steps:
// 1) pick the height of the western onramp
// 2) meander a path off the southern edge of the map
// 3) run validity checks, and discard if it's bad
// 4) generate hints
// 5) run the solver to find all solutions
// 6) check the number of solutions:
//  a) if it's unique, we're done. emit the code
//  b) if it's 0, grab a random link as a clue and continue solving
//  c) if it's 2+, grab a random link as a clue and restart solving

import {
    make_grid
} from 'grid';

function random_element<T>(array: Array<T>): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

class GridGenerator {
    grid_state: GridState;
    cursor: [Pos, Direction] | null;

    constructor(xmax: Index, ymax: Index) {
        const grid = make_grid(xmax, ymax, [], []);
        this.grid_state = new GridState(grid, new Map());
        this.grid_state.initialize();
        reset();
    }

    reset() {
        const y = Math.floor(Math.random() * this.grid_state.grid.ymax) + 1;
        this.cursor = [{ x: 0, y }, Direction.East];
    }

    step() {
        todo;
    }
}

export function try_generate_track_path(xmax: Index, ymax: Index, grid_state: GridState) {
    const onramp_y = Math.floor(Math.random() * (ymax)) + 1;
    let pos = { x: 0, y: onramp_y };
    let direction = Direction.East;

    while(true) {
        if(pos.x > xmax) {
            return false;
        }
        
        if(pos.y > ymax) {
            return true;
        }

        builder.add_permalink(pos, direction);
        pos = go(pos, direction);
        switch(direction) {
            case Direction.North: direction = random_element([Direction.South, Direction.East, Direction.West]); break;
            case Direction.South: direction = random_element([Direction.North, Direction.East, Direction.West]); break;
            case Direction.East: direction = random_element([Direction.South, Direction.North, Direction.West]); break;
            case Direction.West: direction = random_element([Direction.South, Direction.East, Direction.North]); break;
        }
    }
}
