import React, {useEffect, useState, useCallback} from "react";
import {toast} from "react-toastify";
import AddQuote from "./AddQuote";
import Quote from "./Quote";
import Loader from "../utils/Loader";
import {Row} from "react-bootstrap";

import {NotificationSuccess, NotificationError} from "../utils/Notifications";
import {
    getQuotess as getQuoteList,
    likeQuote,
    addComment,
    createQuote,
} from "../../utils/marketplace";


const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const account = window.walletConnection.account();

    // function to get the list of books
    const getQuotes = useCallback(async () => {
        try {
            setLoading(true);
            setQuotes(await getQuoteList());
        } catch (error) {
            console.log({error});
        } finally {
            setLoading(false);
        }
    });

    const addQuote = async (data) => {
        setLoading(true);
        try {
            await createQuote(data).then((resp) => {
                toast(<NotificationSuccess text="Quote has beeen added successfully."/>);
                getQuotes();
            });
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to add quote."/>);
        } finally {
            setLoading(false);
        }
    };


    const createComment = async (id, comment) => {
        setLoading(true);
        try {
            await addComment(id, comment).then((resp) => {
                toast(<NotificationSuccess text="Comment has beeen added successfully."/>);
                getQuotes();
            });
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to add comment"/>);
        } finally {
            setLoading(false);
        }
    };


    //  function to initiate transaction
    const like = async (id, ammount) => {
        try {
            await likeQuote({
                id,
                ammount,
            }).then((resp) => {
                toast(<NotificationSuccess text="quote liked successfully"/>);
                getQuotes()
            });
        } catch (error) {
            toast(<NotificationError text="Failed to like quote."/>);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuotes();
    }, []);

    return (
        <>
            {!loading ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="fs-4 fw-bold mb-0">Near Quotes</h1>
                        <AddQuote save={addQuote}/>
                    </div>
                    <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                        {quotes.map((_quote) => (
                            <Quote
                                quote={{
                                    ..._quote,
                                }}
                                likeQuote={like}
                                saveComment={createComment}
                                isOwner={account.accountId === _quote.owner}
                            />
                        ))}
                    </Row>
                </>
            ) : (
                <Loader/>
            )}
        </>
    );
};

export default Quotes;
