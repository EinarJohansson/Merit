import React, {useState, useEffect, useRef} from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalBarSeries, HorizontalGridLines, XAxis, YAxis, DiscreteColorLegend} from 'react-vis'
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

    return (
        <Container fluid>
            <Row>
                <Col>
                    <XYPlot 
                        xType="ordinal" 
                        stackBy="y" 
                        width={300} 
                        height={300}
                    >
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />

                        {value.length !== 0 ? 
                            (value.map(i => <VerticalBarSeries
                                cluster="stack 1"
                                data={betyg[i-1]}
                                opacity={1}
                                color={statusar[i-1].color}
                                animation={'noWobble'}
                                />)
                            ): 
                            (<VerticalBarSeries
                                data={[{x: 'Tomt 🤔', y: 0}]}
                            />)
                        }
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
