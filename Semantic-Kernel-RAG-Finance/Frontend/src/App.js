import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import FileUpload from './components/filewindow';
import ChatWindow from './components/chatwindow';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<FileUpload/>} />
            <Route path="/chat" element={<ChatWindow></ChatWindow>} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
  );
}
export default App;
