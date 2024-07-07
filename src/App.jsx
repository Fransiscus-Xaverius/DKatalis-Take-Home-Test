import React, { useState } from 'react';
import handleLogin from './handlers/handleLogin';
import handleLogout from './handlers/handleLogout';
import handleDeposit from './handlers/handleDeposit';
import handleTransfer from './handlers/handleTransfer';
import handleWithdraw from './handlers/handleWithdraw';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [cliHistory, setCliHistory] = useState(['Welcome to MyBank ATM CLI!', 'Type "help" for a list of commands.']);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(new Map());

  const handleCommand = (command) => {
    if (!command) return;

    const commands = command.split(' ');
    let newEntry;

    switch (commands[0]) {
      case 'help':
        newEntry = 'Available commands: help, clear, login <username>, logout, deposit <amount>, withdraw <amount>, transfer <amount> <username>';
        break;
      case 'clear':
        setCliHistory([]);
        return;
      case 'login':
        newEntry = handleLogin(commands, users, setUsers, setCurrentUser, currentUser);
        break;
      case 'logout':
        newEntry = handleLogout(currentUser, setCurrentUser);
        break;
      case 'deposit':
        newEntry = handleDeposit(commands, currentUser, users, setUsers, setCurrentUser);
        break;
      case 'withdraw':
        newEntry = handleWithdraw(commands, currentUser, users, setUsers, setCurrentUser);
        break;
      case 'transfer':
        newEntry = handleTransfer(commands, currentUser, users, setUsers, setCurrentUser);
        break;
      default:
        newEntry = `Unknown command: ${command}`;
    }

    setCliHistory((prevHistory) => [...prevHistory, `> ${command}`, newEntry].filter(Boolean));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="cli-container">
      <div className="cli-output">
        {cliHistory.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="cli-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          autoFocus
        />
      </form>
    </div>
  );
}

export default App;
