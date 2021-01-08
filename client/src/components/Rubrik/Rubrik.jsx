import React from 'react'
import './Rubrik.css'

export default function Rubrik(props) {
    const page = props.page
    return (
        <div id="rubrik-div">
            <h1 id="rubrik">{page}</h1>
        </div>
    )
}
