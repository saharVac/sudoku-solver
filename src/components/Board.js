import React, { Component, useState } from "react";
import Row from "./Row";

function Board({ isSolving }) {

    console.log('Solving: ', isSolving)

    const initialBoard = []
    for (let i = 0; i < 9; i++) {
        const row = []
        for (let j = 0; j < 9; j++) {
            row.push(0)
        }
        initialBoard.push(row)
    }

    const [tiles, setTiles] = useState([
        [3, 0, 0, 9, 0, 6, 8, 7, 1],
        [7, 1, 0, 0, 0, 0, 0, 0, 5],
        [0, 0, 9, 7, 0, 0, 0, 2, 0],
        [0, 0, 7, 5, 6, 0, 2, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 8, 0, 7, 2, 4, 0, 0],
        [0, 7, 0, 0, 0, 5, 3, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 5, 4],
        [2, 9, 5, 1, 0, 4, 0, 0, 8]
    ]);

    // TODO: incorporate in actual state -->>
    const state = {
        clickedTile: [0][0]
    }
    //  <<--

    const tileClick = (event) => {
        console.log(event.target)
    }

    const board = []
    for (let i = 0; i < 9; i++) {
        board.push(<Row rowNum={i} values={tiles[i]} tileClick={tileClick} />)
    }
    
    return (
        <div id="board"> 
            {
                board
            }
        </div>
    )
    
    
}

export default Board;
