import React, {useState, useEffect} from 'react'
import { Container, Breadcrumb } from 'react-bootstrap'
import Rubrik from '../../components/Rubrik/Rubrik'
import './Program.css';
import {NavLink} from "react-router-dom"

function historik(kod) {
    return new Promise((resolve, reject) => {                
        const url = '/data/program?kod=' + kod

        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then(response => {
            if (response.status === 200) return response.json()
        })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

export default function Program(props) {
    const kod = props.match.params.kod 
    
    const [program, setProgram] = useState('');

    const getProgram = async (kod) => {
        const res = await historik(kod)
        const programNamn = res[0].urval[0][0][2]
        setProgram(programNamn)
    }


    useEffect(() => {
        if (!program && 
            typeof props.location.state !== 'undefined' &&
            typeof props.location.state.program !== 'undefined') {
            setProgram(props.location.state.program)
        }
        else if (!program) getProgram(kod)
    },[program, props.location.state, kod])
    
    return(
        <Container>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <NavLink to="/utbildningar">
                        Utbildningar
                    </NavLink>
                    <Breadcrumb.Item active> / {program}</Breadcrumb.Item>
                </li>
            </ol>
            <Rubrik
                page={program}
                program
            />
        </Container>
    )
}
