import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { emojis } from './EmojiList';
import { Button, Input, Row, Col, Container } from 'reactstrap';
import Twemoji from 'react-twemoji';
import LazyLoad from 'react-lazyload';

function selected() {
    return 'btn-outline-dark';
}

function unselected() {
    return 'btn-light';
}

export class Join extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            emoji: null
        };

        this.setEmojiAvatar = this.setEmojiAvatar.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.props.hub.invoke("SendMessage", event.target.value);
        this.setState({ user: event.target.value })
    }

    setEmojiAvatar(name) {
        this.setState({emoji: name});
    }

    render() {
        return (
            <div className='container'>
                <h1>Join</h1>
                <div className='width-300' style={{ 'display': 'inline-block' }}>
                    <Input type='text' onChange={this.handleChange}></Input>
                </div>
                <Link to='/'>Back</Link>
                <br />
                <Container style={{ 'overflow': 'scroll', 'height': '500px'}}>
                    <Row>
                        {emojis.map(function (name, index) {
                            var className = unselected();
                            if (this.state.emoji === name) {
                                className = selected();
                            }
                            return (
                                <Col className='mt-2' key={name + index} style={{'width': '70px'}}>
                                    <Button className={className} onClick={() => this.setEmojiAvatar(name)}>
                                        <Twemoji options={{ className: 'twemoji' }}>
                                            {name}
                                        </Twemoji>
                                    </Button>
                                </Col>);
                        }, this)}
                    </Row>
                </Container>
                <Link to='/lobby'>Continue</Link>
            </div>
        );
    }
}