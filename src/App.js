import $ from 'jquery'
import './App.css';
import Board from './Components/Board'
import ModificationSection from './Components/ModificationSection'
import React, { useState } from 'react';

// TODO: create pop up alert when value not possible instead of using alert()

function App() {

  let solving = false

  let isFinished;

  const [board, setBoard] = useState([
    [3, 1, 6, 5, 4, 0, 0, 0, 8],
    [0, 0, 0, 6, 0, 3, 0, 2, 0],
    [0, 0, 9, 0, 0, 0, 0, 3, 4],
    [0, 0, 1, 0, 5, 6, 4, 0, 0],
    [0, 4, 0, 9, 0, 1, 0, 6, 0],
    [0, 0, 2, 4, 3, 0, 1, 0, 0],
    [9, 7, 0, 0, 0, 0, 2, 0, 0],
    [0, 2, 0, 8, 0, 9, 0, 0, 0],
    [1, 0, 0, 0, 7, 5, 3, 4, 9],
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

  const [algoRuns, setAlgoRuns] = useState(0)

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

  const isValuePossible = (row, col, value) => {

    // value is possible by default
    let isPoss = true
    let contradictingCell

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
    let columnValues = [board[0][col], board[1][col], board[2][col], board[3][col], board[4][col], board[5][col], board[6][col], board[7][col], board[8][col]]
    columnValues.forEach((cellValue, cellRow) => {
      // if value is found in column, value not possible
      if (parseInt(cellValue) === value) {
        contradictingCell = {
          row: cellRow,
          column: col
        }
        isPoss = false
      }
    })

    // check if value possible for focused cell's box
    const boxRows = (row > 5) ? [6, 7, 8] : (row > 2) ? [3, 4, 5] : [0, 1, 2]
    const boxColumns = (col > 5) ? [6, 7, 8] : (col > 2) ? [3, 4, 5] : [0, 1, 2]
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

    // update changed cell's possibilities
    for (let digit = 0; digit <= 9; digit++) {
      // if not on set digit
      if (digit != val) {
        newPossibilities[row][col][digit] = false
      }
    }
    
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

  const changeCell = (row, column, value) => {
    // check if possible to input value given the current values in cell's row column and cube
    const [isPoss, contradictingCell] = isValuePossible(row, column, value)
    if (isPoss) {

      // store snapshot of current possibilities
      setPossibilitiesSnapshots([...possibilitiesSnapshots, possibilities])

      let newBoard = board
      newBoard[row][column] = value
      setBoard([...newBoard])
      $("#cell-" + row + "-" + column).html(value)

      // change possibilities of affected cells in row, column, and box
      updatePossibilities(row, column, value, true)

    } else { // if not possible
      if (!solving) {
        // change background of contradicting cell to red
        $("#cell-" + contradictingCell.row + "-" + contradictingCell.column).css("background-color", "red")
        // undo contradicting cell color change after 1 second
        setTimeout(clearContradictingCellColor, 1000, contradictingCell)
      } 
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

  const occurences = (arr, value) => {
    let occ = []
    for (let index = 0; index < arr.length; index++) {
      if (arr[index] === value) {
        occ.push(index)
      }
    }
    return occ
  }

  const isNotSolved = () => {
    // default to false
    let notSolved = false
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (board[row][column] == 0) {
          notSolved = true
          break
        }
      }
      if (notSolved) {
        break
      }
    }
    return notSolved
  }

  const runAlgo = (boardToSolve) => {
    let boardSnapShot = [...boardToSolve]

    // iterating over each digit
    for (let digit = 1; digit <= 9; digit++) {
      // Check if digit can only be used in one cell in row or column
      for (let index = 0; index <= 8; index++) {
        // TODO: split up iterating through column and row
        console.log("checking row and column", index)
        let columnValues  = [
          boardToSolve[0][index], boardToSolve[1][index], boardToSolve[2][index],
          boardToSolve[3][index], boardToSolve[4][index], boardToSolve[5][index],
          boardToSolve[6][index], boardToSolve[7][index], boardToSolve[8][index],
        ]
        // if digit is not in row or column
        if (!boardToSolve[index].includes(digit) || !columnValues.includes(digit)) {
            let rowToCheck = [
              possibilities[index][0][digit], possibilities[index][1][digit], possibilities[index][2][digit],
              possibilities[index][3][digit], possibilities[index][4][digit], possibilities[index][5][digit],
              possibilities[index][6][digit], possibilities[index][7][digit], possibilities[index][8][digit]
            ]
            let colToCheck = [
              possibilities[0][index][digit], possibilities[1][index][digit], possibilities[2][index][digit],
              possibilities[3][index][digit], possibilities[4][index][digit], possibilities[5][index][digit],
              possibilities[6][index][digit], possibilities[7][index][digit], possibilities[8][index][digit]
            ]
  
            let rowPossibilities = occurences(rowToCheck, true)
            let colPossibilities = occurences(colToCheck, true)
  
            // if digit appears only once in row
            if (rowPossibilities.length == 1) {
              // update cell
              let columnToUpdate = rowPossibilities[0]
              console.log("SETTING CELL [", index, "][", columnToUpdate, "] with value ", digit)
              changeCell(index, columnToUpdate, digit)
            }

            // if digit appears only once in column
            if (colPossibilities.length == 1) {
              // update cell
              let rowToUpdate = colPossibilities[0]
              console.log("SETTING CELL [", rowToUpdate, "][", index, "] with value ", digit)
              changeCell(rowToUpdate, index, digit)
            }
        }
      }

      // Check if digit can only be used in one cell in box
      const boxRows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
      const boxColumns = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
      for (let rowBoxIndex = 0; rowBoxIndex < 3; rowBoxIndex++) {
        for (let colBoxIndex = 0; colBoxIndex < 3; colBoxIndex++) {   
          let rows = boxRows[rowBoxIndex]
          let columns = boxColumns[colBoxIndex]
          let boxValues = [
            board[rows[0], columns[0]], board[rows[0], columns[1]], board[rows[0], columns[2]],
            board[rows[1], columns[0]], board[rows[1], columns[1]], board[rows[1], columns[2]],
            board[rows[2], columns[0]], board[rows[2], columns[1]], board[rows[2], columns[2]],
          ]
          // if digit not in box
          if (!boxValues.includes(digit)) {
            let boxToCheck = [
              possibilities[rows[0]][columns[0]][digit], possibilities[rows[0]][columns[1]][digit], possibilities[rows[0]][columns[2]][digit],
              possibilities[rows[1]][columns[0]][digit], possibilities[rows[1]][columns[1]][digit], possibilities[rows[1]][columns[2]][digit],
              possibilities[rows[2]][columns[0]][digit], possibilities[rows[2]][columns[1]][digit], possibilities[rows[2]][columns[2]][digit],
            ]

            let boxPossibilities = occurences(boxToCheck, true)
      
            // if digit appears only once in box
            if (boxPossibilities.length == 1) {
              // update cell
              let rowToUpdate = rows[Math.floor(boxPossibilities[0] / 3)]
              let columnToUpdate = columns[boxPossibilities[0] % 3]
              changeCell(rowToUpdate, columnToUpdate, digit)
            }
          }
          
        }
      }

      // Update algo run through count
      setAlgoRuns(algoRuns + 1)
      
    }
    
    // check if algo is stuck
    if (isNotSolved()) {
      // if stuck on solving (board hasn't changed) 
      let isStuck = boardSnapShot == board
      // unless stuck on solving, run algorithm again
      if (!isStuck) {
        runAlgo(board)
      } else {
        return false
      }
    } else {
      // board is solved
      return true
      console.log("solved")
    }
    
  }


  const solve = (boardToSolve) => {

    solving = true

    // initialize possibilities
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        // if cell is filled
        if (boardToSolve[row][column]) {
          updatePossibilities(row, column, boardToSolve[row][column], true)
        }
      }
    }

    let solvable = runAlgo(boardToSolve)
    
  }

  return (
    <div className="App">

      <h1 className="title">Sudoku Solver</h1>

      <p className="instructions">
        Click cells to update their values
      </p>
      
      <Board focus={focus} board={board} />

      <ModificationSection clearValue={clearValue} changeCell={changeCell} focusedCell={focusedCell} />

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
