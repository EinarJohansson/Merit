import React from 'react'
import {XYPlot, VerticalBarSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis} from 'react-vis'

export default function Betyg(props) {
    return (
        <XYPlot xType="ordinal" width={300} height={300}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis 
                tickLabelAngle={-45}
            />
            <YAxis />
            <VerticalBarSeries
                data={props.data}
            />
        </XYPlot>
    ) 
}