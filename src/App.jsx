import { useState } from 'react';
import './App.css';

function User(username, balance, history, debts, loans) {
  this.username = username;
  this.balance = balance;
  this.history = history;
  this.debts = debts;
  this.loans = loans
}

function App() {
  const [input, setInput] = useState('');
  const [cliHistory, setCliHistory] = useState(['Welcome to MyBank ATM CLI!', 'Type "help" for a list of commands.']);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(new Map());

  const commandsList = {
    help: 'Available commands: help, clear, login <username>, logout, deposit <amount>, withdraw <amount>, transfer <amount> <username>',
    clear: 'clear',
  };

  function userDoesNotExist(users, key) {
    return !users.has(key);
  }

  const handleCommand = (command) => {
    if (!command) return; // Safety check
    //NOTE:
    //I am assuming that commands are seperated by a space, is always in the first index and the rest of the words are arguments
    //I am assuming that when a user is logged on, the user may not log in as another user.
    //I am assuming that a username is case sensitive so a user with the name "user" and "User" are 2 separate users.
    //I am assuming that when a user transfers to another user with a balance of 0, that the user's debt will be added in a FIFO order of payment (Oldest debt should be payed for first). 
    const commands = command.split(" ");
    let newEntry;

    switch (commands[0]) {
      case 'help': //Handle help command
        newEntry = commandsList.help; 
        break;
      case 'clear': //Handle clear console command
        setCliHistory([])
        return; // forcing to return to stop from the clear command from being registered by the setCliHistory function down below
      case 'login': //Handle login command
        newEntry = handleLogin(commands)
        break;
      case 'logout': //Handle logout command
        newEntry = handleLogout()
        break;
      case 'deposit': // Handle deposit command
        newEntry = handleDeposit(commands);
        break;
      case 'withdraw': 
        newEntry = handleWithdraw(commands);
        break;
      case 'transfer': // Handle transfer command
        newEntry = handleTransfer(commands);
        break;
      default:
        newEntry = `Unknown command: ${command}`;
    }

    setCliHistory(prevHistory => [...prevHistory, `> ${command}`, newEntry].filter(Boolean));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setInput('');
      handleCommand(input.trim());
    }
  };

  const handleLogin = (commands) => {
    //assuming that the system doesn't allow a user to login more than once
    if(currentUser){
      return `You're now logged in as ${currentUser.username} and thus this command is not available`
    }
   
    if(!commands[1]){
      return 'Please specify your username';
    }

    if (userDoesNotExist(users, commands[1])) { //check if a user with said username exists. if not, create a new user
      const newUser = new User(commands[1], 0, [], new Map(), new Map()); //create a new user object
      const newUsersMap = users 
      newUsersMap.set(commands[1], newUser); //add the new user to the temporary users map
      setUsers(newUsersMap); //update the state of users map with the updated temporary users Map
    }

    setCurrentUser(users.get(commands[1])); //set the current user to the user with the specified username
    return `Welcome, ${commands[1]}`; //User Greeting to send to setCliHistory
  }

  const handleLogout = () => {
    if (currentUser) { 
      setCurrentUser(null); 
      return `Goodbye, ${currentUser.username}`
     
    } 
    return 'No user is currently logged in'
  }

  const handleDeposit = (commands) => {
    if (!currentUser) {
      return 'No user is currently logged in. Please log in first.';
    }
    if (!commands[1]) {
      return 'Please specify an amount to deposit';
    }
    const amount = parseInt(commands[1], 10);
    if (isNaN(amount) || amount <= 0) {
      return 'Please specify a valid amount to deposit (positive round numbers only)';
    }
    let remainingAmount = amount;
  
    currentUser.debts.forEach(d => {
      console.log(d.lender, d.amount);
    })

    currentUser.debts.forEach((amount, lender) => {
      if (remainingAmount > 0) {
        if (remainingAmount >= amount) {
          remainingAmount -= amount;
          currentUser.history.push(`Paid off debt of $${amount} to ${lender}`);
          currentUser.debts.delete(lender); // Remove the debt from the Map
  
          // Update the lender's balance
          const targetUser = users.get(lender);
          targetUser.balance += amount;
          targetUser.loans.delete(currentUser.username);
          targetUser.history.push(`Received $${amount} from ${currentUser.username} as debt payment`);
        } 
        else {
          amount -= remainingAmount;
          currentUser.history.push(`Paid $${remainingAmount} to ${lender} as Partial payment. Remaining debt: $${amount}`);
          remainingAmount = 0;
  
          // Update the lender's balance
          const targetUser = users.get(lender);
          targetUser.balance += remainingAmount;
          targetUser.loans.set(currentUser.username, amount);
          targetUser.history.push(`Received $${remainingAmount} from ${currentUser.username} as partial debt payment`);
  
          currentUser.debts.set(lender, amount);
        }
      }
    });
  
    // Add remaining amount to the user's balance
    currentUser.balance += remainingAmount;
    currentUser.history.push(`Deposited $${remainingAmount}. New balance: $${currentUser.balance}`);
    return `Your balance is : $${currentUser.balance}`;
  };  

  const handleTransfer = (commands) => {
    if (!currentUser) {
      return 'No user is currently logged in. Please log in first.';
    }
  
    const targetUsername = commands[1];
    const amount = parseInt(commands[2]);
  
    if (!targetUsername || isNaN(amount)) {
      return 'Please specify a valid username and amount to transfer.';
    }
  
    if (amount <= 0) {
      return 'Please specify a positive amount to transfer.';
    }
  
    if (!users.has(targetUsername)) {
      return `User ${targetUsername} does not exist.`;
    }
  
    if (currentUser.username === targetUsername) {
      return 'You cannot transfer money to yourself.';
    }
  
    const targetUser = users.get(targetUsername);
  
    if (currentUser.balance < amount) {
      var deficit = amount - currentUser.balance;
      const transferAmount = currentUser.balance;
  
      if(currentUser.debts.get(targetUsername)) { 
        currentUser.debts.get(targetUsername).amount += deficit; 
        targetUser.loans.get(currentUser.username).amount += deficit;
        deficit = currentUser.debts.get(targetUsername).amount; 
      }
      else { 
        currentUser.debts.set(targetUsername,  deficit);
        targetUser.loans.set(currentUser.username, deficit);
      }
  
      currentUser.balance = 0;
      targetUser.balance += transferAmount;
  
      currentUser.history.push(`Transferred $${transferAmount} to ${targetUsername}.\nYour balance is $${currentUser.balance}.\n  ${deficit}`);
      targetUser.history.push(`Received ${transferAmount} from ${currentUser.username}. Owed ${deficit} more`);
      
      return `Transferred $${transferAmount} to ${targetUsername}. \nYour balance is $${currentUser.balance}. \nOwed $${deficit} to ${targetUsername}`;
    } 
    else {
      currentUser.balance -= amount;
      targetUser.balance += amount;
  
      currentUser.history.push(`Transferred $${amount} to ${targetUsername}`);
      targetUser.history.push(`Received $${amount} from ${currentUser.username}`);
  
      return `You transferred $${amount} to ${targetUsername}. Your new balance is $${currentUser.balance}`;
    }
  };

  const handleWithdraw = (commands) => {
    if(!currentUser) { 
      return 'No user is currently logged in. Please log in first.';
    }

    if(!commands[1]){
      return 'Please specify an amount to withdraw';
    }

    const amount = parseInt(commands[1]); 

    if(isNaN(amount) || amount <= 0) {
      return 'Please specify a valid amount to withdraw (positive round numbers only)';
    }
    
    if(currentUser.balance < amount) {
      return `Insufficient funds. Your current balance is $${currentUser.balance}`;
    }

    currentUser.balance -= amount;
    currentUser.history.push(`Withdrew $${amount}. New balance: $${currentUser.balance}`);
    return `Withdrew $${amount}\n. New balance: $${currentUser.balance}`;

  }

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
