import React from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalBarSeries, HorizontalGridLines, XAxis, YAxis} from 'react-vis'

export default function Betyg(props) {
    return (
        <XYPlot xType="ordinal" width={300} height={300}>
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <VerticalBarSeries
                data={props.data}
                opacity={0.5}            
            />
        </XYPlot>
    )
}