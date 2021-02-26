import React, {useState, useEffect} from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineMarkSeries, LineSeries, Hint, DiscreteColorLegend} from 'react-vis'
import {Col, Row, ToggleButton} from 'react-bootstrap'

export default function Historik(props) {
    const [tooltip, setTooltip] = useState(false)
    const [ticks, setTicks] = useState([])
    const [BI, setBI] = useState([])
    const [BII, setBII] = useState([])
    const [medel, setMedel] = useState(0)
    const [disabled, setDisabled] = useState([false, false, false, false])
    const [checked, setChecked] = useState(props.bevakat);

    const colors = ['#69646E', '#D7928B', '#668A78', '#F0DCC2']
    const titles = ['BI', 'BII', `Medelvärde - ${medel.toFixed(2)}`, `Ditt meritvärde - ${props.meritvärde.toFixed(2)}`]
    const kod = props.data[0][0][3]

    const formatTooltip = node => {
        // Visa BI och BII
        const BII_merit = BII.find(termin => termin.x === node.x).y
        return [{title: titles[0], value: `${node.y || '*/-'}`}, {title: titles[1], value: `${BII_merit || '*/-'}`}]
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
        <Row>
            <Col>
                <XYPlot
                    height={500}
                    width= {500}
                    xType="ordinal"
                    yDomain={[0.0, 22.5]}
                    onMouseLeave={() => setTooltip(false)}
                >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis title="Termin" tickLabelAngle={-45} />
                    <YAxis title="Poäng" tickFormat={v => v === 0 ? `*/-` : `${v}`} />
                    {/* Omfaktorisera */}
                    <LineMarkSeries data={disabled[1] ? null : BII} color={colors[1]} />
                    <LineMarkSeries data={disabled[0] ? null : BI}  onNearestX={value => setTooltip(value)} color={colors[0]}/>
                    <LineSeries data={disabled[2] ? null : ticks.map(tick => ({'x': tick, 'y': medel}))}  color={colors[2]}/>
                    <LineSeries data={disabled[3] ? null : ticks.map(tick => ({'x': tick, 'y': props.meritvärde}))} color={colors[3]}/>
                    {tooltip && <Hint value={tooltip} format={formatTooltip}/>}
                </XYPlot>
            </Col>
            <Col>
                <DiscreteColorLegend
                    items={titles.map((title, i) => ({title: title, color: colors[i], disabled: disabled[i]}))}
                    height={200}
                    width={300}
                    onItemClick={(obj, num) => {
                        if (!obj.disabled && disabled.filter(cond => cond === false).length > 1 || obj.disabled)
                            setDisabled(disabled.map((linje, i) => i === num ? !linje : linje ))
                    }}
                />
                <ToggleButton 
                    type="checkbox" 
                    variant="primary"
                    checked={checked}
                    onChange={e => {
                        // Bevaka programmet hära eller ta bort det från bevakat
                        setChecked(e.currentTarget.checked)
                        const body = {
                            kod: kod,
                            state: e.currentTarget.checked
                        }
                        const url = '/data/bevaka'

                        fetch(url, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Credentials": true
                            },
                            body: JSON.stringify(body)
                        })
                        .then(response => {
                            if (response.status === 200) return response.json()
                        })
                        .then(res => console.log('Uppdatera bevakning'))
                        .catch(err => console.log('Gick inte att uppdatera bevakning'))
                        }
                    }
                    value="1"
                >
                    Bekvaka program
                
                </ToggleButton>
            </Col>
    </Row>
    )
}
