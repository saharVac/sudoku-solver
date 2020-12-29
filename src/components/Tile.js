import React from "react";

function Tile({ row, column, value, tileClick }) {

    return (
        <div onClick={tileClick} className="tile-container">
            <div className="tile">{
                value ?
                value :
                " "
            }</div>
        </div>
    )
    
}

export default Tile;