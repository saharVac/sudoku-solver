import React from "react";
import Row from "./Row";

function Solve({ solve }) {

    return (
        <div id="solve" onClick={() => solve()}> 
            Solve
        </div>
    )
    
    
}

export default Solve;
