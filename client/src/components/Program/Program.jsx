import React, {useState, useEffect} from 'react'
import { Container, Breadcrumb } from 'react-bootstrap'
import './Program.css';
 
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
        console.log('tjaa!');
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
    })
    
    return(
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href="/utbildningar">Utbildningar</Breadcrumb.Item>
                <Breadcrumb.Item active>{program}</Breadcrumb.Item>
            </Breadcrumb>
            <h1>{program}</h1>
        </Container>
    )
}
