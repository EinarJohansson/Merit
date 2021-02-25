import React, {useState, useEffect, useRef} from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalBarSeries, HorizontalGridLines, XAxis, YAxis, DiscreteColorLegend, Hint} from 'react-vis'
import { ToggleButtonGroup, ToggleButton, Container, Row, Col } from 'react-bootstrap';

function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value;
    })
    return ref.current
}

export default function Betyg(props) {
    const avslutadeIndex = 3

    const [value, setValue] = useState([avslutadeIndex])
    const [betyg, setBetyg] = useState(props.data)
    const [tooltip, setTooltip] = useState(false)

    const statusar = [
        {title :'Pågående', color: "#F5E1FD", strokeWidth: 6,},
        {title :'Kommande', color: "#B399D4", strokeWidth: 6},
        {title :'Avslutade', color: "#AF76C3", strokeWidth: 6}
    ]

    const prevBetyg = usePrevious(props.data);
    
    useEffect(() => {
        if (prevBetyg !== props.data)
            setBetyg(props.data)
    }, [prevBetyg, props.data])

    const handleChange = (val) => {
        val.sort((a, b) => a - b)
        setValue(val)
    }

    const nodes = betyg.reduce((acc, d) => [...acc, ...d], [])

    const getDomain = (data, key) => {
        const {max} = data.reduce(
            (acc, row) => ({
                max: Math.max(acc.max, row[key])
                }),
            {max: -Infinity}
        )
        return max;
    }
    
    // Summerar betygen för att få en korrekt domain
    const sumBetyg = Array.from(
        nodes.reduce((m, { x, y }) => m.set(x, (m.get(x) || 0) + y), new Map()),
            ([x, y]) => ({ x, y })
    )

    const yDomain = getDomain(sumBetyg, 'y')

    const formatTooltip = node => [{title: node.x, value: `${node.y}`}]

    return (
        <Container fluid>
            <Row>
                <Col>
                    <XYPlot
                        dontCheckIfEmpty
                        xType="ordinal" 
                        stackBy="y" 
                        width={300} 
                        height={300}
                        yDomain={[0, yDomain]}
                        xDomain={['A', 'B', 'C', 'D', 'E', 'F']}
                        onMouseLeave={() => setTooltip(false)}
                    >
                        <HorizontalGridLines tickTotal={yDomain} />
                        <XAxis />
                        <YAxis  />
                        {value.map(i => <VerticalBarSeries
                                cluster="stack 1"
                                data={betyg[i-1]}
                                opacity={1}
                                color={statusar[i-1].color}
                                animation={'noWobble'}
                                onNearestX={value => setTooltip(value)}
                                />
                        )}
                        {tooltip && <Hint value={tooltip} format={formatTooltip}/>}

                        <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
                            {statusar.map((status, i) => <ToggleButton value={i+1}>{status.title}</ToggleButton>)}
                        </ToggleButtonGroup>
                    </XYPlot>
                </Col>
                <Col>
                    <DiscreteColorLegend items={statusar} />
                </Col>
            </Row>
        </Container>
    )
}
