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

  const possList = []
  for (let row = 1; row <= 9; row++) {
    let rowToAdd = []
    for (let col = 1; col <= 9; col++) {
      let cellPossibilities = {}
      for (let poss = 1; poss <= 9; poss++) {
        cellPossibilities[poss] = true
      }
      rowToAdd.push(cellPossibilities)
    }
    possList.push(rowToAdd)
  }
  const [possibilities, setPossibilities] = useState(possList)

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

  const isValuePossible = (value, cell) => {

    // value is possible by default
    let isPoss = true
    let contradictingCell
    const row = cell.row
    const column = cell.column

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

    return [isPoss, contradictingCell]
  }

  const clearContradictingCellColor = (contradictingCell) => {
    $("#cell-" + contradictingCell.row + "-" + contradictingCell.column).css("background-color", "")
  }

  const updatePossibilities = (row, col, val) => {

    let newPossibilities = possibilities
    
    // update row's possibilities
    for (let index = 0; index < 9; index++) {
      // only if not on updated cell
      if (index !== col) {
        newPossibilities[row][index][val] = false
      }
    }

    // update column's possibilities
    for (let index = 0; index < 9; index++) {
      // only if not on updated cell
      if (index !== row) {
        newPossibilities[index][col][val] = false
      }
    }

    // update box's possibilities
    const boxRows = (row > 5) ? [6, 7, 8] : (row > 2) ? [3, 4, 5] : [0, 1, 2]
    const boxColumns = (col > 5) ? [6, 7, 8] : (col > 2) ? [3, 4, 5] : [0, 1, 2]
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        // only if not on update cell
        if (row !== boxRows[rowIndex] && col !== boxColumns[colIndex]) {
          newPossibilities[boxRows[rowIndex]][boxColumns[colIndex]][val] = false
        }
      }
    }

    // set new possibilities
    setPossibilities(newPossibilities)
  }

  const changeCell = (value) => {
    // check if possible to input value given the current values in cell's row column and cube
    const [isPoss, contradictingCell] = isValuePossible(value, focusedCell)
    if (isPoss) {

      let newBoard = board
      newBoard[focusedCell.row][focusedCell.column] = value
      setBoard(newBoard)
      $("#cell-" + focusedCell.row + "-" + focusedCell.column).html(value)

      // change possibilities of affected cells in row, column, and box
      updatePossibilities(focusedCell.row, focusedCell.column, value)

    } else { // if not possible

      // change background of contradicting cell to red
      $("#cell-" + contradictingCell.row + "-" + contradictingCell.column).css("background-color", "red")
      // undo contradicting cell color change after 1 second
      setTimeout(clearContradictingCellColor, 1000, contradictingCell)
    }
  }

  const clearValue = () => {
    let newBoard = board
    newBoard[focusedCell.row][focusedCell.column] = 0
    setBoard(newBoard)
    $("#cell-" + focusedCell.row + "-" + focusedCell.column).html("")
  }

  const solve = (boardToSolve) => {

    // iterate over board to solve
    boardToSolve.forEach((rowToSolve, rowNum) => {
      rowToSolve.forEach((valueToSolve, colNum) => {

        // if cell already has a zero value
        if (!valueToSolve) {

          const cellToSolve = {
            row: rowNum,
            column: colNum
          }

          // iterate over all possible cell values

          // set test value

          // update possibility of cells affected in row, col and box

          // if not possible, remove value from cell possibilities, update affected cells possibilities, try next possible values
          
          // if already iterated over all possibilities, return false

        }
      })
    })

  }

  return (
    <div className="App">

      <h1 className="title">Sudoku Solver</h1>

      <p className="instructions">
        Click cells to update their values
      </p>
      
      <Board focus={focus} board={board} />

      <ModificationSection clearValue={clearValue} changeCell={changeCell} />

      <div className="solve-section">
        <button onClick={() => solve(board)} className="solve-btn">SOLVE</button>
      </div>
      

    </div>
  );
}

export default App;
