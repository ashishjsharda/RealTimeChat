import React, {useEffect, useState} from "react";
import './App.css';
import socket from "websocket/lib/W3CWebSocket";

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

    const sendMessage = () => {
      if (messageInput.trim() !== '') {
        const message = {
          text: messageInput,
          timestamp: new Date().toISOString(),
        };
        socket.send(JSON.stringify(message));
        setMessageInput("");
      }
    };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages([...messages, receivedMessage]);
    };

    return () => {
      socket.close();
    };
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
            {messages.map((message, index) => (
                <div key={index} className="chat-message">
                    {message}
                </div>
            ))}
        </div>

        <div className="chat-input">
          <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
          />
            <button onClick={sendMessage}>Send</button>
        </div>
        </div>
    </div>
    );
}

export default App;


