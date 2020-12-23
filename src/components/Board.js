import React, { Component, useState } from "react";
import Row from "./Row";

function Board({ isSolving }) {

    // const initialBoard = []
    // for (let i = 0; i < 9; i++) {
    //     const row = []
    //     for (let j = 0; j < 9; j++) {
    //         row.push(0)
    //     }
    //     initialBoard.push(row)
    // }
    const values = [
        [3, 0, 0, 9, 0, 6, 8, 7, 1],
        [7, 1, 0, 0, 0, 0, 0, 0, 5],
        [0, 0, 9, 7, 0, 0, 0, 2, 0],
        [0, 0, 7, 5, 6, 0, 2, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 8, 0, 7, 2, 4, 0, 0],
        [0, 7, 0, 0, 0, 5, 3, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 5, 4],
        [2, 9, 5, 1, 0, 4, 0, 0, 8]
    ]
    const tilesToSolve = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // examine tile at indeces i, j
            // add empty tiles to tilesToSolve array
            if (!values[i][j]) {
                tilesToSolve.push({row: i, col: j})
            }
        }
    }

    const [tiles, setTiles] = useState({
        values: values,
        tilesToSolve: tilesToSolve
    });

    console.log('empty tiles: ', tiles.tilesToSolve)

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
        board.push(<Row rowNum={i} values={tiles.values[i]} tileClick={tileClick} />)
    }

    const isPossVal = (row, column, value) => {
        // if the value already exists in the row, return false
        if (tiles.values[row].includes(value)) {
            return false
        }
        // if the value already exists in the column, return false
        for (let i = 0; i < 9; i++) {
            if (tiles.values[i][column] === value) {
                return false
            }
        }
        // A box holds 3 x 3 tiles
        const boxRow = Math.floor(row / 3)
        const boxCol = Math.floor(column / 3)
        // iterate over rows of box
        for (let i = boxRow * 3; i < (boxRow * 3) + 3; i++) {
            // iterate over columns of box
            for (let j = boxCol * 3; j < (boxCol * 3) + 3; j++) {
                // if the value already exists in the tile, return false
                if (tiles.values[i][j] === value) {
                    console.log('value', value, 'found at row:', i, 'column:', j)
                    return false
                }
            }
        }
        
    }

    const liveSolution = () => {
        tiles.tilesToSolve.forEach(tile => {
            // iterate over all digits
            for (let testValue = 1; testValue <= 9; testValue++) {
                // check if value is possible
                if (isPossVal(tile.row, tile.col, testValue)) {
                    
                }
            }
        })
    }

    if (isSolving) {
        liveSolution()
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
