import React, { Component } from 'react'
import './Utbildning.css';

export default class Utbildning extends Component {
    state = {
        inriktning: '',
        program: ''
    }

    componentDidMount() {
        this.setState({
            program: this.props.program,
            inriktning: this.props.inriktning
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col d-flex">
                    <div className="card">
                        <img className="card-img-top" src={this.props.bild} referrerpolicy="no-referrer" />
                        <div className="card-body">
                            <h5 className="card-title">{this.props.namn}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{this.props.program}</h6>
                            <p className="card-subtitle mb-2 text-muted">{this.props.inriktning}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
