import React, { useEffect } from 'react';
import './App.css';
import MainContainer from './components/MainContainer';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from "./firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './Login';
import firebase from 'firebase';

const App = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if(user){
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL
        },
        {
          merger: true
        }
      );
    }
  }, [user]);

  return (
    <Router>
      {!user ? (<Login />):(
        <div className="App">
          <Switch>
            <Route path="/">
              <div className="upperBackgroundBar"></div>
              <MainContainer />
            </Route>
          </Switch>
        </div>
      )}
    </Router>
  );
}

export default App;
