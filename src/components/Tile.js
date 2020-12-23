import React from "react";

function Tile({ row, column, value, tileClick }) {

    return (
        <div onClick={tileClick} class="tile-container">
            <div class="tile">{
                value ?
                value :
                " "
            }</div>
        </div>
    )
    
}

export default Tile;