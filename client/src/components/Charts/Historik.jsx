import React, {useState, useEffect, useRef} from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineMarkSeries, LineSeries} from 'react-vis'
import  {Container} from 'react-bootstrap';

export default function Historik(props) {

    const BI = props.data[0]
    .map(termin => ({'x': termin[0], 'y': isNaN(parseFloat(termin[6])) ? 0 : parseFloat(termin[6])}))
    const BII = props.data[1]
    .map(termin => ({'x': termin[0], 'y': isNaN(parseFloat(termin[6])) || termin[6] === '*' || termin[6] === '-' ? 0 : parseFloat(termin[6])}))

    const ticks = props.data[0].map(termin => termin[0])

    console.log(BI);
    console.log(BII);

    const medelBI = props.data[0]
    .map(termin => isNaN(parseFloat(termin[6])) || termin[6] === '*' || termin[6] === '-' ? 0 : parseFloat(termin[6]))
    .reduce((poäng, next) => poäng + next, 0) / BI.length

    const medelBII = props.data[1]
    .map(termin => isNaN(parseFloat(termin[6])) || termin[6] === '*' || termin[6] === '-' ? 0 : parseFloat(termin[6]))
    .reduce((poäng, next) => poäng + next, 0) / BII.length

    const medel = (medelBI + medelBII) / 2

    return (
        <XYPlot height={500} width= {500} xType="ordinal" yDomain={[0.0, 22.5]}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Termin" tickLabelAngle={-45} />
            <YAxis title="Poäng"/>
            <LineMarkSeries data={BI} />
            <LineMarkSeries data={BII} strokeStyle="dashed" />
            <LineSeries data={ticks.map(tick => ({'x': tick, 'y': medel}))}/>
        </XYPlot>
    )
}
