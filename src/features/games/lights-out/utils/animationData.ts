export const EXAMPLE_ANIMATION_DATA = {
    boardStates: [
        [6, 5, 7], // 0: Start
        [4, 2, 5], // 1: After (1,1)
        [0, 4, 1], // 2: After (1,2)
        [0, 0, 7], // 3: After (2,2) - End of Chase 1
        [0, 0, 7], // 4: Calculator Start
        [0, 0, 7], // 5: Entering Input...
        [0, 0, 7], // 6: Entering Input...
        [0, 0, 7], // 7: Calculator Result / Switch to Board
        [7, 2, 7], // 8: After (0,1)
        [6, 1, 6], // 9: After (1,0)
        [4, 6, 4], // 10: After (1,1)
        [0, 0, 0], // 11: Solved
    ],
    inputStates: [
        [0, 0, 0], // 0
        [0, 0, 0], // 1
        [0, 0, 0], // 2
        [0, 0, 0], // 3
        [0, 0, 0], // 4
        [1, 0, 0], // 5
        [1, 1, 0], // 6
        [1, 1, 1], // 7
        [1, 1, 1], // 8
        [1, 1, 1], // 9
        [1, 1, 1], // 10
        [1, 1, 1], // 11
    ],
    outputStates: [
        [0, 0, 0], // 0
        [0, 0, 0], // 1
        [0, 0, 0], // 2
        [0, 0, 0], // 3
        [0, 0, 0], // 4
        [1, 1, 0], // 5
        [0, 0, 1], // 6
        [0, 1, 0], // 7
        [0, 1, 0], // 8
        [0, 1, 0], // 9
        [0, 1, 0], // 10
        [0, 1, 0], // 11
    ],
    phaseIndices: {
        calculatorStart: 4,
        secondChaseStart: 7,
    },
    // Explicit indicators to show at each frame
    indicators: [
        { r: 1, c: 1, label: '1' }, // 0: Click (1,1) -> frame 1
        { r: 1, c: 2, label: '2' }, // 1: Click (1,2) -> frame 2
        { r: 2, c: 2, label: '3' }, // 2: Click (2,2) -> frame 3
        null, // 3: View full board
        { c: 0, label: '4' }, // 4: Calculator Input 1
        { c: 1, label: '5' }, // 5: Calculator Input 2
        { c: 2, label: '6' }, // 6: Calculator Input 3
        { r: 0, c: 1, label: '7' }, // 7: Back to Board -> Click (0,1) -> frame 8
        { r: 1, c: 0, label: '8' }, // 8: Click (1,0) -> frame 9
        { r: 1, c: 1, label: '9' }, // 9: Click (1,1) -> frame 10
        { r: 1, c: 2, label: '10' }, // 10: Click (1,2) -> Solved
        null, // 11: Solved (Trophy)
    ],
};
