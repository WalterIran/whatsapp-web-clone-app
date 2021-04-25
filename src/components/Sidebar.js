import React, { useState } from 'react';
import "./Sidebar.css";
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import { Avatar, IconButton } from '@material-ui/core';
import OpenChat from "./OpenChat";
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';

const Sidebar = () => {
    const [moreOpt, setMoreOpt] = useState(false);

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users','array-contains',user.email);

    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () =>{
        const input = prompt('Please enter an email address for the user you wish to chat with: ');

        if(!input) return null;
        console.log(chatAlreadyExists(input));
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){
            
            db.collection('chats').add({
                users: [user.email, input],
            })

        }
    }

    const chatAlreadyExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            (chat) => 
            chat.data().users.find((user) => user === recipientEmail)?.length > 0
            );
    

    return(
        <div className="sidebar">
            <header className="sidebar_header">
                <Avatar src={user.photoURL} />
                <div className="sidebar_header_leftIcons">
                    <IconButton>
                    <svg id="df9d3429-f0ef-48b5-b5eb-f9d27b2deba6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12.072 1.761a10.05 10.05 0 0 0-9.303 5.65.977.977 0 0 0 1.756.855 8.098 8.098 0 0 1 7.496-4.553.977.977 0 1 0 .051-1.952zM1.926 13.64a10.052 10.052 0 0 0 7.461 7.925.977.977 0 0 0 .471-1.895 8.097 8.097 0 0 1-6.012-6.386.977.977 0 0 0-1.92.356zm13.729 7.454a10.053 10.053 0 0 0 6.201-8.946.976.976 0 1 0-1.951-.081v.014a8.097 8.097 0 0 1-4.997 7.209.977.977 0 0 0 .727 1.813l.02-.009z"></path><path fill="#009588" d="M19 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path></svg>
                    </IconButton>
                    <IconButton onClick={createChat}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={() =>{setMoreOpt(!moreOpt)}}>
                        <MoreVertIcon />
                    </IconButton>
                    <div className={`moreOptions ${moreOpt? '':'hidden'}`}>
                        <ul>
                            <li>Settings</li>
                            <li onClick={() => auth.signOut()}>Logout</li>
                        </ul>
                    </div>
                </div>
            </header>
            <div className="header_searchSection">
                <div className="searchBar">
                    <SearchIcon />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
            </div>
            <div className="chats">

                {chatsSnapshot?.docs.map(chat => (<OpenChat key={chat.id} id={chat.id} persons={chat.data().users} />))}

                {/* <OpenChat 
                    persons={"Mariel Miranda"} 
                    time={"2:46 PM"} 
                    message={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius iure nobis, saepe possimus illum eveniet corrupti officiis deleniti id enim est at, qui iste aliquid eos assumenda a tempora veniam."}
                    qty={3}
                    /> */}
            </div>
        </div>
    );
}

export default Sidebar;