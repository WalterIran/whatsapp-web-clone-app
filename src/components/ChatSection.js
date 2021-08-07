import { Avatar, Box, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import "./ChatSection.css";
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import MoodIcon from '@material-ui/icons/Mood';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PhotoIcon from '@material-ui/icons/Photo';
import { useSelector } from 'react-redux';
import { selectOpenChat } from '../features/chatsSlice';
import TimeAgo from 'timeago-react';
import { auth, db, storage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

const ChatSection = () =>{

    const [send, setSend] = useState(false);
    const [input, setInput] = useState("");
    const [attach, setAttach] = useState(false);
    const [user] = useAuthState(auth);
    const [preview, setPreview] = useState(false);
    const imgRef = useRef(null);
    const [imgUpload, setImgUpload] = useState(null);
    const [progress, setProgress] = useState(0);

    const chatHeaderContent = useSelector( selectOpenChat );
    const [messagesSnapshot] = useCollection(
        db.collection('chats').doc(chatHeaderContent.id).collection('messages').orderBy('timestamp','asc')
    );

    const changeInput = (e) =>{
        setInput(e.target.value)
        setSend(true)
        if(e.target.value.length === 0){
            setSend(false);
        }
    }

    const showMessages = () =>{
        if(messagesSnapshot){
            return messagesSnapshot.docs.map((message) =>(
                <Message 
                key={message.id} 
                img={message.data()?.img}
                message={message.data().message}  
                timestamp={message.data().timestamp?.toDate().getTime()} 
                email={message.data().user}
                photoUrl={message.data().photoURL} 
                />
            ));
        }
        
    }

    const sendMessage = (e) =>{
        e.preventDefault();

        db.collection('chats').doc(chatHeaderContent.id).collection('messages').add(
            {
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL
            }
        );

        setInput('');
    }

    const handleFile = (e) =>{
        const file = e.target.files[0];
        if(!file.type.startsWith("image/")) return;
        setImgUpload(file);

        const reader = new FileReader();

        console.log(e.target.files[0]);

        reader.onload = (e) =>{
            setPreview(true); 
            setAttach(false);
            imgRef.current.src = e.target.result;
        }

        reader.readAsDataURL(file);
    }

    const sendImg = () =>{
        let imgName = Date.now();
        const uploadTask = storage.ref(`images/whatsapp-web-clone-${imgName}`).put(imgUpload);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) =>{
                setProgress(0)
                console.log(error.message);
            },
            () =>{
                imgName = `whatsapp-web-clone-${imgName}`;
                storage.ref("images").child(imgName).getDownloadURL().then((url) => {
                    db.collection('chats').doc(chatHeaderContent.id).collection('messages').add(
                        {
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            img: url,
                            message: '',
                            user: user.email,
                            photoURL: user.photoURL
                        }
                    );

                    
                })
                setProgress(0);
                setPreview(false);
            }
        )
    }

    return(
        <div className="chatSection">
            <div className="chatHeader">
                <div className="chatHeader-avatar">
                    {chatHeaderContent.photoUrl.length !== 1? <Avatar src={chatHeaderContent.photoUrl} />:<Avatar>{chatHeaderContent.photoUrl}</Avatar>}
                </div>
                <div className="chatHeader-description">
                    <h3>{chatHeaderContent.email}</h3>
                    <p> Last Seen: {
                        chatHeaderContent.lastSeen !== '' ?
                        <TimeAgo datetime={chatHeaderContent?.lastSeen?.toDate()} />:'Unavailable' 
                    }
                    </p>
                </div>
                <div className="chatHeader-options">
                    <div className="header-optSearchIcon">
                        <SearchIcon />
                    </div>
                    <div className="header-optMoreVertIcon">
                        <MoreVertIcon />
                    </div>
                </div>
            </div>
            {preview ? (
                <div className="file-preview">
                    <div className="preview-header">
                        <div onClick={() => {setPreview(false); imgRef.current.src = null;}} className="preview-close">
                            <CloseIcon/>
                        </div>
                        <h2>Preview</h2>
                    </div>
                    <div className="preview-content">
                        <img ref={imgRef} alt="Preview"/>
                    </div>
                    <div className="preview-send">
                        <button className="preview-send-btn">
                            <SendIcon onClick={sendImg} />
                        </button>
                    </div>
                    <div className={`upload-progress ${progress !== 0? '':'hidden'}`}>
                        <CircularProgress variant="determinate" value={progress} />
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                            progress,
                            )}%`}</Typography>
                        </Box>
                    </div>
                </div>
            ):(
                <>
                    <div className="chatScreen">
                    {showMessages()}
                    </div>
                    <div className="writeChatSection">
                        <div className="writeSection-media">
                            <Tooltip  title="Emojis" placement="top-end">
                                <MoodIcon />
                            </Tooltip>
                            <div className="attach-file">
                                <Tooltip title="Attach" placement="top-end">
                                    <AttachFileIcon onClick={() => {setAttach(!attach)}} />
                                </Tooltip>
                                <ul className={`${attach ? '':'hidden'}`}>
                                    <Tooltip title="Photos & Videos" placement="right"> 
                                        <li className="img-upload">{/* onClick={() => {setPreview(true); setAttach(false)}} */}
                                            <label htmlFor="img-preview">
                                                <PhotoIcon/>
                                            </label>
                                            <input accept="image/*" type="file" id="img-preview" onChange={handleFile}/>
                                        </li>
                                    </Tooltip>
                                </ul>
                            </div>
                        </div>
                        <div className="writeSection">
                            <div className="writeInput">
                                <input value={input} onChange={changeInput} type="text" placeholder="Type a message"/>
                            </div>
                        </div>
                        <div className="writeSection-right">
                            <div className="writeSendAction">
                                {send? <SendIcon onClick={sendMessage} /> : <MicIcon />}
                            </div>
                        </div>
                    </div>
                </>
            )}
            
        </div>
    );
}

export default ChatSection;