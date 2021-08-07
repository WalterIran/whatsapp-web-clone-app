import { createSlice } from '@reduxjs/toolkit';

export const chatsSlice = createSlice({
  name:'chat',
  initialState:{
    selectedChat: null,
    chatIsOpened: false
  },
  reducers:{
    selectChat: (state, action) =>{
        state.selectedChat = action.payload;
    },
    openChat: state =>{
        state.chatIsOpened = true;
    },
    closeChat: state =>{
        state.chatIsOpened = false;
    }
  }
});

export const {selectChat, openChat, closeChat} = chatsSlice.actions;

export const selectOpenChat = (state) => state.chat.selectedChat;
export const selectChatIsOpen = (state) => state.chat.chatIsOpened;

export default chatsSlice.reducer;

