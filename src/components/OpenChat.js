import { Avatar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import "./OpenChat.css";

const Chat= ({persons,time,message,qty, id}) => {

    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(persons, user);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email','==', recipientEmail));

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    return (
        <div className="chatSample">
            <div className="chatSample_avatar">
                {recipient ? (
                    <Avatar src={recipient?.photoURL}/> 
                ):
            (
                <Avatar>{recipientEmail[0]}</Avatar>
            )}
            </div>
            <div className="chat_description">
                <h3 className="chatSample_person">{recipientEmail}</h3>
                <p className="chatSample_lastMessage_time">{time}</p>
                <p className="chatSample_lastMessage">{message}</p>
                <div className="chatSample_qty">
                    <p className="qty_pending">{qty}</p>
                </div>
            </div>
        </div>
    );
}

export default Chat;