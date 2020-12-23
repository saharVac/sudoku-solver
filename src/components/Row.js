import React from "react";
import Tile from "./Tile"

function Row({ rowNum, values, tileClick }) {

    const row = []
    for (let i = 0; i < 9; i++) {
        row.push(<Tile row={rowNum} column={i} value={values[i]} tileClick={tileClick} />)
    }

    return (
        <div class="row">
            {row}
        </div>
    )
    
}

export default Row;