import React, {useState, useEffect, useRef} from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {XYPlot, VerticalBarSeries, HorizontalGridLines, XAxis, YAxis} from 'react-vis'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value;
    })
    return ref.current
  }

export default function Betyg(props) {
    const [value, setValue] = useState([3]) // Aktivera avslutade
    const [betyg, setBetyg] = useState(props.data[2]) // Visa avslutade

    const prevBetyg = usePrevious(props.data);

    useEffect(() => {
        if (prevBetyg !== props.data) {
            let tmp = []
            if (value.length > 0) {
                value.forEach(i => tmp.push(props.data[i-1]))
                setBetyg(tmp.flat())
            } 
            else
                setBetyg([{x: 'Tomt :(', y: 0}])
        }
    }, [prevBetyg, props.data, value])

    const handleChange = (val) => {
        // Ändra betygen som visas!
        setValue(val)
        if (val.length === 0) {
            setBetyg([{x: 'Tomt :(', y: 0}])
        } else {
            let tmp = []
            val.forEach(i => tmp.push(props.data[i-1]))
            setBetyg(tmp.flat())
        }
    }

    return (
        <XYPlot xType="ordinal" width={300} height={300}>
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <VerticalBarSeries
                data={betyg}
                opacity={0.5}            
            />
            <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
                <ToggleButton value={1}>Pågående</ToggleButton>
                <ToggleButton value={2}>Kommande</ToggleButton>
                <ToggleButton value={3}>Avslutade</ToggleButton>
            </ToggleButtonGroup>
        </XYPlot>
    )
}
