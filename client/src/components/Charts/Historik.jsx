import React, {useState, useEffect} from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineMarkSeries, LineSeries, Hint} from 'react-vis'

export default function Historik(props) {
    const [tooltip, setTooltip] = useState(false)
    const [ticks, setTicks] = useState([])
    const [BI, setBI] = useState([])
    const [BII, setBII] = useState([])
    const [medel, setMedel] = useState(0)

    const formatTooltip = node => {
        // Visa BI och BII
        const BII_merit = BII.find(termin => termin.x === node.x).y
    return [{title: 'BI', value: `${node.y}`}, {title: 'BII', value: `${BII_merit || '*/-'}`}]
    }

    useEffect(() => {
        const B1_ = props.data[0].map(termin => ({'x': termin[0], 'y': isNaN(parseFloat(termin[6])) ? 0 : parseFloat(termin[6])}))
        setBI(B1_)

        const BII_ = props.data[1].map(termin => ({'x': termin[0], 'y': isNaN(parseFloat(termin[6])) || termin[6] === '*' || termin[6] === '-' ? 0 : parseFloat(termin[6])}))
        setBII(BII_)

        setTicks(props.data[0].map(termin => termin[0]))

        const medelBI = props.data[0]
        .map(termin => isNaN(parseFloat(termin[6])) || termin[6] === '*' || termin[6] === '-' ? 0 : parseFloat(termin[6]))
        .reduce((poäng, next) => poäng + next, 0) / B1_.length

        const medelBII = props.data[1]
        .map(termin => isNaN(parseFloat(termin[6])) || termin[6] === '*' || termin[6] === '-' ? 0 : parseFloat(termin[6]))
        .reduce((poäng, next) => poäng + next, 0) / BII_.length

        setMedel((medelBI + medelBII) / 2)
    }, [])

    return (
        <XYPlot height={500} width= {500} xType="ordinal" yDomain={[0.0, 22.5]} onMouseLeave={() => setTooltip(false)}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Termin" tickLabelAngle={-45} />
            <YAxis title="Poäng" tickFormat={v => v === 0 ? `*/-` : `${v}`} />
            <LineMarkSeries data={BI} onNearestX={value => setTooltip(value)}/>
            <LineMarkSeries data={BII} strokeStyle="dashed" />
            <LineSeries data={ticks.map(tick => ({'x': tick, 'y': medel}))}/>
            <LineSeries data={ticks.map(tick => ({'x': tick, 'y': props.meritvärde}))}/>
            {tooltip && <Hint value={tooltip} format={formatTooltip}/>}
        </XYPlot>
    )
}
