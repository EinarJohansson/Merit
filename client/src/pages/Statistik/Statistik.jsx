import React, { Component } from 'react'
import Rubrik from '../../components/Rubrik/Rubrik'
import { Container } from 'react-bootstrap'

export default class Statistik extends Component{
    render() {
        return(
            <Container>
                <Rubrik
                    page={'Statistik'}
                />
            </Container>
        )
    }
}