import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(['Welcome to the React CLI!', 'Type "help" for a list of commands.']);
  const [output, setOutput] = useState([]);

  const commands = {
    help: 'Available commands: help, clear, greet',
    clear: 'clear',
  };

  const handleCommand = (command) => {
    if (!command) return; // this is impossible to reach but its there for safety reasons
    var commands = command.split(" "); //split commands into individual words
    switch (command[0]) {
      case 'help':
        setOutput([...output, commands.help]);
        break;
      case 'clear':
        setHistory([]);
        setOutput([]);
        break;
      case 'login':
        break;
      case 'logout':
        break;
      case 'deposit':
        break;
      case 'withdraw':
        break;
      default:
        setOutput([...output, `Unknown command: ${command}`]);
    }
  };

  //handles form/command submissions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) { //check if input is not empty, if input is not empty we can proceed into adding the input into the history state and call the handleCommand function
      setHistory([...history, `> ${input}`]);
      handleCommand(input.trim());
      setInput('');
    }
  };

  //returns CLI container
  return (
    <div className="cli-container">
      <div className="cli-output">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {output.map((line, index) => (
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