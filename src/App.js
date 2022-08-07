import $ from 'jquery'
import './App.css';
import Board from './Components/Board'
import ModificationSection from './Components/ModificationSection'
import React, { useState } from 'react';

// TODO: create pop up alert when value not possible instead of using alert()

function App() {

  let isFinished;

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

  const [possibilitiesSnapshots, setPossibilitiesSnapshots] = useState([])

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

  const updatePossibilities = (row, col, val, isAddedValue) => {

    let newPossibilities = possibilities
    
    // update row's possibilities
    for (let index = 0; index < 9; index++) {
      // only if not on updated cell
      newPossibilities[row][index][val] = (index !== col) ? !isAddedValue : isAddedValue
    }

    // update column's possibilities
    for (let index = 0; index < 9; index++) {
      // only if not on updated cell
      if (index !== row) {
        newPossibilities[index][col][val] = !isAddedValue
      }
    }

    // update box's possibilities
    const boxRows = (row > 5) ? [6, 7, 8] : (row > 2) ? [3, 4, 5] : [0, 1, 2]
    const boxColumns = (col > 5) ? [6, 7, 8] : (col > 2) ? [3, 4, 5] : [0, 1, 2]
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        // only if not on update cell
        if (row !== boxRows[rowIndex] && col !== boxColumns[colIndex]) {
          newPossibilities[boxRows[rowIndex]][boxColumns[colIndex]][val] = !isAddedValue
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

      // store snapshot of current possibilities
      setPossibilitiesSnapshots([...possibilitiesSnapshots, possibilities])

      let newBoard = board
      newBoard[focusedCell.row][focusedCell.column] = value
      setBoard(newBoard)
      $("#cell-" + focusedCell.row + "-" + focusedCell.column).html(value)

      // change possibilities of affected cells in row, column, and box
      updatePossibilities(focusedCell.row, focusedCell.column, value, true)

      

    } else { // if not possible

      // change background of contradicting cell to red
      $("#cell-" + contradictingCell.row + "-" + contradictingCell.column).css("background-color", "red")
      // undo contradicting cell color change after 1 second
      setTimeout(clearContradictingCellColor, 1000, contradictingCell)
    }
  }

  const clearValue = () => { 
    let newBoard = board
    let oldValue = newBoard[focusedCell.row][focusedCell.column]
    newBoard[focusedCell.row][focusedCell.column] = 0
    setBoard(newBoard)
    $("#cell-" + focusedCell.row + "-" + focusedCell.column).html("")
    // restore affected cell possibilities
    // TODO: THIS DOESN'T ACCOUNT FOR other possibly conteradicting cells for what's set to now possible - needs to check if poss before changing to possible
    updatePossibilities(focusedCell.row, focusedCell.column, oldValue, false)
  }

  const solve = (boardToSolve) => {

    // iterating over each digit
    for (let digit = 1; digit <= 9; digit++) {
      // Check if digit can only be used in one cell in row or column
      for (let index = 0; index <= 8; index++) {
        let rowToCheck = [
          boardToSolve[index][0], boardToSolve[index][1], boardToSolve[index][2],
          boardToSolve[index][3], boardToSolve[index][4], boardToSolve[index][5],
          boardToSolve[index][6], boardToSolve[index][7], boardToSolve[index][8]
        ]
        let colToCheck = [
          boardToSolve[0][index], boardToSolve[1][index], boardToSolve[2][index],
          boardToSolve[3][index], boardToSolve[4][index], boardToSolve[5][index],
          boardToSolve[6][index], boardToSolve[7][index], boardToSolve[8][index]
        ]

      }
    }



    // Check if digit can only be used in one cell in box
    let digitPossibilitiesInBox = 0
    
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
        <button onClick={() => {
          isFinished = false;
          solve(board)
        }} className="solve-btn">SOLVE</button>
      </div>
      

    </div>
  );
}

export default App;
