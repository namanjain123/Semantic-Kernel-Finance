import React, { useRef } from 'react';
import LeftTab from './components/tabmodule'
import ChatWindow from './components/chatwindow'
import './App.css';

function App() {
  const leftTabRef = useRef();
  const refreshLeftTab = () => {
    // Set the tabRefreshed state to trigger a re-render of the LeftTab component.
    leftTabRef.current.refreshTab();
  };
  return (
    <div className="App">
      <LeftTab/>
      <ChatWindow />
    </div>
  );
}
export default App;
