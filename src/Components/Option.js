import React from "react";

function option({ value, changeValue }) {



    return(
        
        <div onClick={() => changeValue()} className="option">{value}</div>
            
    )
}

export default option