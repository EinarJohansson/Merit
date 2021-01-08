import React from 'react'
import './Rubrik.css'

export default function Rubrik(props) {
    const page = props.page
    return (
        <>
        {props.program ? 
            (
            <div style={{'margin-top': '24px'}} id="rubrik-div">
                <h1 id="rubrik">{page}</h1>
            </div>
        ): (
            <div style={{'margin-top': '64px'}} id="rubrik-div">
                <h1 id="rubrik">{page}</h1>
            </div>
        )
        }
        </>
    )
}
