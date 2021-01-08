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
    const [betyg, setBetyg] = useState(props.data[avslutadeIndex-1])

    const statusar = [
        {status :'Pågående', färg: "#2d2d2d"},
        {status :'Kommande', färg: "#f44f4f"},
        {status :'Avslutade', färg: "#4f4f4f"}
    ]

    const prevBetyg = usePrevious(props.data);

    useEffect(() => {
        if (prevBetyg !== props.data) {
            let tmp = []
            if (value.length > 0) {
                value.forEach(i => tmp.push(props.data[i-1]))
                const grouped = Array.from(
                    tmp.flat().reduce((m, { x, y }) => m.set(x, (m.get(x) || 0) + y), new Map),
                        ([x, y]) => ({ x, y })
                )
                setBetyg(grouped)
            } 
            else
                setBetyg([{x: 'Tomt 🤔', y: 0}])
        }
    }, [prevBetyg, props.data, value])

    const handleChange = (val) => {
        // Ändra betygen som visas!
        setValue(val)
        let tmp = []
        val.forEach(i => tmp.push(props.data[i-1]))
        const tmpFlat = tmp.flat()
        const grouped = Array.from(
            tmpFlat.reduce((m, { x, y }) => m.set(x, (m.get(x) || 0) + y), new Map),
                ([x, y]) => ({ x, y })
        )

        if (val.length === 0 || grouped.length === 0)
            setBetyg([{x: 'Tomt 🤔', y: 0}])
        else 
            setBetyg(grouped)
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <XYPlot xType="ordinal" width={300} height={300}>
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />
                        <VerticalBarSeries
                            data={betyg}
                            opacity={0.5}
                        />
                        <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
                            <ToggleButton value={1}>{statusar[0].status}</ToggleButton>
                            <ToggleButton value={2}>{statusar[1].status}</ToggleButton>
                            <ToggleButton value={3}>{statusar[2].status}</ToggleButton>
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
