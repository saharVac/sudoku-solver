import React from "react";
import BoardCell from './BoardCell'

function BoardRow({ row, rowNum, focus }) {



    return(
        
        <tr className={"row row-" + (rowNum + 1)}>
        {
            row.map((value, colNum) => {
                return <BoardCell focus={focus} key={colNum} value={value} rowNum={rowNum} colNum={colNum} />
            })
        }
        </tr>
            
    )
}

export default BoardRow