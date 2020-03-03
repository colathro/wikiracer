import React, { Component } from 'react';
import { Link } from "react-router-dom";


export class HowTo extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container'>
                <h1>HowTo</h1>
                <Link to='/'>Back</Link>
            </div>
        );
    }
}