import React from "react";
import PropTypes from "prop-types";
import {utils} from "near-api-js";
import {Card, Button, Col, Badge, Stack, Form} from "react-bootstrap";
import {useState} from "react";

const Quote = ({quote, likeQuote, saveComment, isOwner, changeQuote}) => {
    const {id, description, owner, likes, comments} = quote;

    const [ammount, setAmmount] = useState('');
    const [comment, setComment] = useState('');
    const [newDescription, setnewDescription] = useState('');


    const triggerLike = () => {
        likeQuote(id, ammount);
    };

    const triggerCreateComment = () => {
        saveComment(id, {commentDescription: comment});

    };

    const triggerChangeQuote = () => {
        changeQuote(id, newDescription);

    };

    return (
        <Col key={id}>
            <Card className=" h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={3}>
                        <span className="font-monospace text-secondary">{owner}</span>
                        <Badge bg="secondary" className="ms-auto">
                            {likes} likes
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className=" ratio ratio-4x3">
                    <Card.Title>" {description} "</Card.Title>
                </div>
                <Card.Body className="d-flex  flex-column text-center">


                    {isOwner !== true && (
                        <>
                            <Form.Control
                                className={"pt-2 mb-1"}
                                type="text"
                                placeholder="Enter comment"
                                onChange={(e) => {
                                    setComment(e.target.value);
                                }}
                            />

                            <Button
                                variant="primary"
                                className={"mb-4"}
                                onClick={() => triggerCreateComment()}
                            >
                                Comment
                            </Button>
                        </>
                    )}

            {isOwner === true && (
                        <>
                            <Form.Control
                                className={"pt-2 mb-1"}
                                type="text"
                                placeholder="Enter new Description"
                                onChange={(e) => {
                                    setnewDescription(e.target.value);
                                }}
                            />

                            <Button
                                variant="primary"
                                className={"mb-4"}
                                onClick={() => triggerChangeQuote()}
                            >
                               Submit
                            </Button>
                        </>
                    )}


                    {isOwner !== true && (
                        <>
                            <Card.Text className="flex-grow-1 ">like this quote by sending some near to the
                                author</Card.Text>
                        </>
                    )}

                    {isOwner !== true && (
                        <>
                            <Form.Control
                                className={"pt-2 mb-1"}
                                type="text"
                                placeholder="Enter ammount"
                                onChange={(e) => {
                                    setAmmount(e.target.value);
                                }}
                            />

                            <Button
                                variant="primary"
                                className={"mb-4"}
                                onClick={() => triggerLike()}
                            >
                                Like
                            </Button>
                        </>
                    )}


                    <Card.Text className="flex-grow-1 "> <h3>COMMENTS</h3></Card.Text>
                            <hr className="solid"></hr>

                    {comments.map((com) => (
                        <Card.Text className="flex-grow-1">
                           description: <h4>{com.commentDescription}</h4>  <br/>
                            <hr className="solid"></hr>
                        </Card.Text>
                        
                    ))
                    }


                </Card.Body>
            </Card>
        </Col>
    );
};

Quote.propTypes = {
    quote: PropTypes.instanceOf(Object).isRequired,
    likeQuote: PropTypes.func.isRequired,
    saveComment: PropTypes.func.isRequired,
    changeQuote: PropTypes.func.isRequired,
};

export default Quote;