import React, {useState, useEffect} from 'react'
import { Container, Breadcrumb } from 'react-bootstrap'
import Rubrik from '../../components/Rubrik/Rubrik'
import Historik from '../../components/Charts/Historik'
import './Program.css';
import {NavLink, Redirect} from "react-router-dom"

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
    
    const [program, setProgram] = useState('')
    const [data, setData] = useState([])
    const [err, setErr] = useState(false)

    const getProgram = async (kod) => {
        const res = await historik(kod)
        const terminerLen = res[0].urval[0].length

        if (terminerLen > 0) {
            if (props.location.state && props.location.state.program) {
                setProgram(props.location.state.program)
            }
            else {
                const programNamn = res[0].urval[0][terminerLen-1][2]
                setProgram(programNamn)
            }
            setData(res[0].urval)
        }
        else {
            setErr(true)
        }
    }

    useEffect(() => {
        if (program === '') // Om inte satt program
            getProgram(kod)
    },[program, kod])
    

    return(
        <Container>
            {err && 
                <Redirect to='/utbildningar'/>
            }
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <NavLink to="/utbildningar">
                        Utbildningar
                    </NavLink>
                    <Breadcrumb.Item active> / {program}</Breadcrumb.Item>
                </li>
            </ol>
            {program !== '' && 
                <Rubrik
                    page={program}
                    program
                />
            }

            {data.length !== 0 && 
                <Historik
                    data={data}
                    meritvärde={props.user.meritvärde}
                />
            }
        </Container>
    )
}
