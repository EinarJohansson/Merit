import React, { Component } from 'react'
import Table from '../Table/Table'
import Utbildning from '../Utbildning/Utbildning.jsx'

import { Container } from 'react-bootstrap'

export default class Profil extends Component {
    render() {
        return (
            <Container>
                <Utbildning
                    namn={this.props.namn}
                    program={this.props.program}
                    inriktning={this.props.inriktning}
                    bild={this.props.bild}
                />
                <Table
                    kurser={this.props.kurser}
                />
            </Container>
        )
    }
}