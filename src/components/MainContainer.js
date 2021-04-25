import React from 'react';
import ChatSection from './ChatSection';
import Sidebar from './Sidebar';
import "./MainContainer.css";

const MainContainer = () =>{
    return(
        <div className="mainContainer">
            <Sidebar />
            <ChatSection />
        </div>
    );
}

export default MainContainer;