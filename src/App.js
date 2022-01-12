import $ from 'jquery'
import './App.css';
import Board from './Components/Board'
import ModificationSection from './Components/ModificationSection'
import React, { useState } from 'react';


function App() {

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ])

  const [focusedCell, setFocusedCell] = useState({})

  const focus = (row, column) => {

    // if there already is a focused style
    if (focusedCell) {
      // check if cell clicked on isn't already focused
      if (focusedCell.row === row && focusedCell.column === column) {
        return
      }
      // bring already focused cell back to normal color
      $("#cell-" + focusedCell.row + "-" + focusedCell.column).css("background-color", "")
    }

    setFocusedCell({
      row: row,
      column: column
    })

    // change color of focused cell
    $("#cell-" + row + "-" + column).css("background-color", "#1e76e8")

  }

  const changeCell = (value) => {
    let newBoard = board
    console.log(newBoard)
    newBoard[focusedCell.row][focusedCell.column] = value
    setBoard(newBoard)
    // $("#cell-" + focusedCell.row + "-" + focusedCell.column).html(value)
  }

  const clearValue = () => {
    console.log("clearing board")
  }

  return (
    <div className="App">

      <h1 className="title">Sudoku Solver</h1>
      
      <Board focus={focus} board={board} />

      <ModificationSection clearValue={clearValue} changeCell={changeCell} />

    </div>
  );
}

export default App;
