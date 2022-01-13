import $ from 'jquery'
import './App.css';
import Board from './Components/Board'
import ModificationSection from './Components/ModificationSection'
import React, { useState } from 'react';

// TODO: create pop up alert when value not possible instead of using alert()


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

  const isValuePossible = (value) => {

    // value is possible by default
    let isPoss = true
    let contradictingCell
    const row = focusedCell.row
    const column = focusedCell.column

    // check if value possible for focused cell's row
    // iterate over row values
    const rowValues = board[row]
    rowValues.forEach((cellValue, cellColumn) => {
      // if value is found in row, value not possible
      if (parseInt(cellValue) === value) {
        contradictingCell = {
          row: row,
          column: cellColumn
        }
        isPoss = false
      }
    })

    // check if value possible for focused cell's column
    // iterate over column
    let columnValues = [board[0][column], board[1][column], board[2][column], board[3][column], board[4][column], board[5][column], board[6][column], board[7][column], board[8][column]]
    columnValues.forEach((cellValue, cellRow) => {
      // if value is found in column, value not possible
      if (parseInt(cellValue) === value) {
        contradictingCell = {
          row: cellRow,
          column: column
        }
        isPoss = false
      }
    })

    // check if value possible for focused cell's box
    const boxRows = (row > 5) ? [6, 7, 8] : (row > 2) ? [3, 4, 5] : [0, 1, 2]
    const boxColumns = (column > 5) ? [6, 7, 8] : (column > 2) ? [3, 4, 5] : [0, 1, 2]
    boxRows.forEach(rowToCheck => {
      boxColumns.forEach(columnToCheck => {
        // if value is found in column, value not possible
        if (board[rowToCheck][columnToCheck] === value) {
          contradictingCell = {
            row: rowToCheck,
            column: columnToCheck
          }
          isPoss = false
        }
      })
    })

    console.log("contradicting cell:", contradictingCell)
    return isPoss
  }

  const changeCell = (value) => {
    // check if possible to input value given the current values in cell's row column and cube
    if (isValuePossible(value)) {
      let newBoard = board
      newBoard[focusedCell.row][focusedCell.column] = value
      setBoard(newBoard)
      $("#cell-" + focusedCell.row + "-" + focusedCell.column).html(value)
    }
  }

  const clearValue = () => {
    console.log("clearing value")
    let newBoard = board
    newBoard[focusedCell.row][focusedCell.column] = 0
    setBoard(newBoard)
    $("#cell-" + focusedCell.row + "-" + focusedCell.column).html("")
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