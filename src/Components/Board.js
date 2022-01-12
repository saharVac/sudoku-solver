import React from "react";
import BoardRow from './BoardRow'

function Board({ board, focus }) {



    return(
        <table className="board">
            <tbody>
            {
                board.map((row, rowNum) => {
                    return (
                    <BoardRow focus={focus} key={rowNum} row={row} rowNum={rowNum} />
                    )
                })
            }
            </tbody>
      </table>
    )
}

export default Board