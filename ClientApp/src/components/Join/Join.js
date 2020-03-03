import React, { Component } from 'react';
import { Link } from "react-router-dom";

export class Join extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container'>
                <h1>Join</h1>
                <Link to='/'>Back</Link>
                <br/>
                <Link to='/lobby'>Continue</Link>
            </div>
        );
    }
}