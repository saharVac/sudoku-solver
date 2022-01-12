import React from "react";

function BoardCell({ value, colNum, rowNum, focus }) {

    const focusCell = () => {
        focus(rowNum, colNum)
    }

    return(
        
        <td onClick={() => focusCell()} id={"cell-" + rowNum + "-" + colNum} className={"cell column-" + (colNum + 1)}>{value ? String(value) : ""}</td>
            
    )
}

export default BoardCell