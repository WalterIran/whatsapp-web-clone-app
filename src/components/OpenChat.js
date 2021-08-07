import { Avatar, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDispatch } from 'react-redux';
import { openChat, selectChat } from '../features/chatsSlice';
import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import "./OpenChat.css";

const Chat= ({persons,time,message,qty, id}) => {

    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(persons, user);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email','==', recipientEmail));

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    
    //const [lastMessageSnapshot] = useCollection( db.collection('chats').doc(id).collection('messages').orderBy('timestamp','desc').limit(1) );
    
    const [lastMsjSnapshot] = useCollection( db.collection('chats').doc(id).collection('messages').orderBy('timestamp','desc').limit(1) );
    

    const lastMsj = lastMsjSnapshot?.docs?.[0]?.data();

    const defineLastMsj = () =>{
        try{
        let date = <><p>{moment(lastMsj?.timestamp.toDate().getTime()).format('L')}</p> <p>{moment(lastMsj?.timestamp.toDate().getTime()).format('LT')}</p></>;
        
        return date;
        }catch(err){

        }
    }

    const dispatch = useDispatch();

    const OpenChat = () =>{
        let email = recipientEmail;
        let lastSeen = recipient?.lastSeen;
        let photoUrl = recipient?.photoURL;

        email = email !== undefined ? email:'';
        lastSeen = lastSeen !== undefined ? lastSeen:'';
        photoUrl = photoUrl !== undefined ? photoUrl: recipientEmail[0];

        dispatch(openChat());

        dispatch(
            selectChat(
                {
                    id,
                    email,
                    lastSeen,
                    photoUrl
                }
            )
        );
    }

    return (

        <div onClick={OpenChat} className="chatSample">
            <div className="chatSample_avatar">
                {recipient ? (
                    <Avatar src={recipient?.photoURL}/> 
                ):
            (
                <Avatar>{recipientEmail[0]}</Avatar>
            )}
            </div>
            <div className="chat_description">
                <Tooltip title={recipientEmail} placement="bottom-end">
                    <h3 className="chatSample_person">{recipientEmail}</h3>
                </Tooltip>
                <p className="chatSample_lastMessage_time">{defineLastMsj()}</p>
                <Tooltip title={ lastMsj?.message } placement="bottom-end">
                    <p className="chatSample_lastMessage">{ lastMsj?.message ? lastMsj?.message : 'Foto 📷'}</p>
                </Tooltip>
                <div className="chatSample_qty">
                    {qty && <p className="qty_pending">{qty}</p>}
                </div>
            </div>
        </div>
    );
}

export default Chat;