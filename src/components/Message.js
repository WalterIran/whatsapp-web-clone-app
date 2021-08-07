import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import "./Message.css";
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const Message = ({message, timestamp, email, photoUrl, img}) =>{

    const [seeImg, setSeeImg] = useState(false);
    const [user] = useAuthState(auth);
    const [toSee, setToSee] = useState(img);
    return(
        <div className="messageContainer">
            <div className={`message ${user.email === email? 'send':'receive'}`}>
                {img? <img src={img} alt="img" onClick={() =>{setSeeImg(true)}}/>:<></>}
                <p>{message}</p>
                <p>{moment(timestamp).format('LT')}</p>
            </div>
            <div className={`see-img ${seeImg? '':'hidden'}`}>
                <div className="see-img-header">
                    <IconButton onClick={() =>{setSeeImg(false)}}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="see-img-content">
                    <img src={toSee} alt="watching"/>
                </div>
            </div>
        </div>
    );
}

export default Message;