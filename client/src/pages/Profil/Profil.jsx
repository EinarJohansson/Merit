import React from 'react'
import Table from '../../components/Table/Table'
import Inställningar from '../../components/Inställningar/Inställningar'
import { Container } from 'react-bootstrap'

export default function Profil(props) {
    return (
        <Container>
            <Inställningar
                namn={props.namn}
                program={props.program}
                inriktning={props.inriktning}
                bild={props.bild}
            />
            <Table
                kurser={props.kurser}
            />
        </Container>
    )
}