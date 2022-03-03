
import {
    Direction,
    make_hints
} from '../src/grid';

import {
    GridState,
    make_grid_state,
    parse_code
} from '../src/grid_state';

it('should do nothing', () => {
    const grid_state = make_grid_state(4, 4, [
            { pos: { x: 1, y: 1 }, direction: Direction.South },
            { pos: { x: 0, y: 2 }, direction: Direction.East },
            { pos: { x: 1, y: 4 }, direction: Direction.East },
            { pos: { x: 2, y: 4 }, direction: Direction.South }
        ],
        make_hints([4,3,3,2], [4,3,3,2])
    );

    expect(true).toEqual(false);
});

it('should generate matching codes for various puzzles', () => {
    const codes = ['8x8:n9a5a3g5a9k3i5hCd,7,8,8,S7,6,4,5,2,8,7,S5,6,7,5,5,4'];

    for(const code of codes) {
        const new_code = parse_code(code).encode();
        expect(new_code).toEqual(code);
    }
});
