import React from 'react';
import ChatSection from './ChatSection';
import Sidebar from './Sidebar';
import "./MainContainer.css";
import { useSelector } from 'react-redux';
import { selectChatIsOpen, selectOpenChat } from '../features/chatsSlice';
import ChatSectionDefault from './ChatSectionDefault';

const MainContainer = () =>{

    const openChat = useSelector( selectChatIsOpen );
    
    return(
        <div className="mainContainer">
            <Sidebar />
            { openChat ? <ChatSection />: <ChatSectionDefault/> }
        </div>
    );
}

export default MainContainer;