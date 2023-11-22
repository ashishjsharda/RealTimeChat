import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Reference to the WebSocket
  const socketRef = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket('ws://localhost:3001');

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socketRef.current.onmessage = (event) => {
      try {
        // Attempt to parse the message as JSON
        const receivedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (e) {
        // If JSON parsing fails, treat it as plain text
        setMessages((prevMessages) => [...prevMessages, { text: event.data }]);
      }
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      socketRef.current.close();
    };
  }, []); // Empty dependency array to run only on mount

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        text: messageInput,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.send(JSON.stringify(message));
      setMessageInput('');
    }
  };

  return (
      <div className="App">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
                <div key={index} className="chat-message">
                  {message.text} {/* Displaying message text */}
                </div>
            ))}
          </div>
          <div className="chat-input">
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
  );
}

export default App;
