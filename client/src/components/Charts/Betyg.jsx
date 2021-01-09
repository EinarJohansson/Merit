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
        {status :'Pågående', färg: "#F5E1FD"},
        {status :'Kommande', färg: "#B399D4"},
        {status :'Avslutade', färg: "#AF76C3"}
    ]

    const prevBetyg = usePrevious(props.data);
    useEffect(() => {
        if (prevBetyg !== props.data)
            setBetyg(props.data)
    }, [prevBetyg, props.data])

    const handleChange = (val) => {
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
                                opacity={0.8}
                                color={statusar[i-1].färg}
                            />)
                            ): 
                            (<VerticalBarSeries
                                data={[{x: 'Tomt 🤔', y: 0}]}
                            />)
                        }
                    <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
                        {statusar.map((status, i) => <ToggleButton value={i+1}>{status.status}</ToggleButton>)}
                    </ToggleButtonGroup>
                    </XYPlot>
                </Col>
                <Col>
                    <DiscreteColorLegend colors={statusar.map(status => status.färg)} items={statusar.map(status => status.status)} />
                </Col>
            </Row>
        </Container>
    )
}
