import React from 'react'
import Table from '../../components/Table/Table'
import Utbildning from '../../components/Inställningar/Inställningar.jsx'

import { Container } from 'react-bootstrap'

export default function Profil(props) {
    return (
        <Container>
            <Utbildning
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