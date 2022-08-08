import React from "react";
import Option from './Option'

function modificationSection({ changeCell, clearValue, focusedCell }) {
    const fucusedRow = focusedCell.row 
    const focusedCol = focusedCell.column

    return(

        <div className="modification-section">
            <div className="modification-options">
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 1)} value={1} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 2)} value={2} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 3)} value={3} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 4)} value={4} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 5)} value={5} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 6)} value={6} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 7)} value={7} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 8)} value={8} />
                <Option changeValue={() => changeCell(fucusedRow, focusedCol, 9)} value={9} />
            </div>

            <button onClick={() => clearValue()} className="clear-btn">Clear Value</button>
        </div>

    )
}

export default modificationSection