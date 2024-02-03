import React, { useState } from 'react';
import { connect } from 'react-redux'; // Removed unused import 'useSelector'
import "./messagingbar.css"

// Define mapStateToProps to access 'selectedId' from the Redux store
const mapStateToProps = (state) => ({
  selectedId: state.selectedId,
});

const MessagingBar = ({ onMessageSend, selectedId }) => {
  const [message, setMessage] = useState('');

  // Function to handle changes in the message input field
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onMessageSend(message,selectedId.id);
      setMessage('');
    }
  };

  // Function to handle Enter key press for sending a message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="messaging-bar">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleMessageChange}
        onKeyPress={handleKeyPress}
      />
       <button className='senbutton' onClick={handleSendMessage}>
    </button>
    </div>
  );
};

// Connect the component to the Redux store and pass 'selectedId' as a prop
export default connect(mapStateToProps)(MessagingBar);
