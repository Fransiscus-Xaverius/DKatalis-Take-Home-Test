import { useState } from 'react';
import './App.css';

function User(username, balance, history, debts) {
  this.username = username;
  this.balance = balance;
  this.history = history;
  this.debts = debts;
}

function Debt(username, amount){
  this.username = username;
  this.amount = amount;
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
        newEntry = commandsList.help; // List of available commands
        break;
      case 'clear': //Handle clear console command
        setCliHistory([]);
        return; // forcing to return to stop from the clear command from being registered by the setCliHistory function down below
      case 'login': //Handle login command
        //assuming that the system doesn't allow a user to login more than once
        if(currentUser==null) { //checks if a user is logged in
          if (commands[1]) { //checks for the username argument in the CLI input 
            if (userDoesNotExist(users, commands[1])) { //check if a user with said username exists. if not, create a new user
              const newUser = new User(commands[1], 0, [], []); //create a new user object
              const newUsersMap = users 
              newUsersMap.set(commands[1], newUser); //add the new user to the temporary users map
              setUsers(newUsersMap); //update the state of users map with the updated temporary users Map
            }
            setCurrentUser(users.get(commands[1]) || { username: commands[1], balance: 0, history: [], debts: [] }); //set the current user to the user with the specified username
            newEntry = `Welcome, ${commands[1]}`; //User Greeting to send to setCliHistory
          } else { //if no username is specified
            newEntry = 'Please specify your username'; //notify the user to specify their username.
          }
        }
        else{
          newEntry = `You're now logged in as ${currentUser.username} and thus this command is not available` //notify the user that they are already logged in
        }
        break;
      case 'logout': //Handle logout command
        if (currentUser) { //checks if a user is logged in
          newEntry = `Goodbye, ${currentUser.username}`; //new Entry variable to send to setCliHistory
          setCurrentUser(null); //sets current user to null after logging out
        } else { //if no user is currently logged in, tell the user and do nothing but add to the CLI history.
          newEntry = 'No user is currently logged in'; //new Entry variable to send to setCliHistory
        }
        break;
      case 'deposit': // Handle deposit command
        if(currentUser) { //checks if a user is logged in
          if (commands[1]) { //checks for the amount argument in the CLI input
            const amount = parseInt(commands[1]); //convert the amount into an integer. 
            if (!isNaN(amount)) { //check if the amount is a number
              if(amount>0) { //check if the amount is positive
                while(currentUser.debts.length>0 && amount>0) { //check if the user has any debts and if the amount is greater than 0
                  const debt = currentUser.debts[0] //get the oldest debt
                  if(amount>=debt.amount) { //check if the amount is greater than or equal to the debt
                    debt.amount -= amount;
                  }
                  if(debt.amount==0) { //if the debt is paid off, if the debt is paid off then shifts the oldest debt that was paid
                    currentUser.debts.shift();
                  }
                }
              }
              else{
                newEntry = `Please specify an amount greater than 0`;
              }
            }
            else{
              newEntry = `Please specify a valid amount to deposit (positive round numbers only)`;
            }
          }
          else{
            newEntry = `Please specify an amount to deposit`;
          }
        }
        else{
          newEntry = `No user is currently logged in. Please login first before doing any transactions`;
        }
        break;
      case 'withdraw': // Handle withdraw command
        if(currentUser) { //checks if a user is logged in
          if (commands[1]) { //checks for the amount argument in the CLI input
            const amount = parseInt(commands[1]); //convert the amount into an integer. 
            if (!isNaN(amount)) { //check if the amount is a number
              if(amount>0) { //check if the amount is positive
                currentUser.balance -= amount; //subtract the amount from the balance
                currentUser.history.push(`${currentUser.username} withdrew ${amount}`); //add the transaction to the history
                newEntry = `You withdrew ${amount} from your account`; //new Entry variable to send to setCliHistory
              }
              else{
                newEntry = `Please specify an amount greater than 0`;
              }
            }
            else{
              newEntry = `Please specify a valid amount to withdraw (positive round numbers only)`;
            }
          }
          else{
            newEntry = `Please specify an amount to withdraw`;
          }
        }
        break;
      case 'transfer': // Handle transfer command
        if(currentUser) { //checks if a user is logged in
          if (commands[1] && commands[2]) { //checks for the username and amount arguments in the CLI input
            const amount = parseInt(commands[2]); //convert the amount into an integer. 
            if (!isNaN(amount)) { //check if the amount is a number
              if(amount>0) { //check if the amount is positive
                if(currentUser.balance<amount) { //check if the amount is less than or equal to the balance
                  const newDebt = new Debt(commands[1], (amount-currentUser.balance)); //create a new debt object
                }
                else{
                  currentUser.balance -= amount; //subtract the amount from the balance
                  currentUser.history.push(`${currentUser.username} transferred ${amount} to ${commands[1]}`); //add the transaction to the history
                  newEntry = `You transferred ${amount} to ${commands[1]}`; //new Entry variable to send to setCliHistory
                }
              }
              else{
                newEntry = `Please specify an amount greater than 0`;
              }
            }
            else{
              newEntry = `Please specify a valid amount to transfer (positive round numbers only)`;
            }
          }
        }
        else{
          newEntry = `No user is currently logged in. Please login first before doing any transactions`;
        }
        break;
      default:
        newEntry = `Unknown command: ${command}`;
    }

    // Update while using filter to differentiate between history of commands  and history of outputs from a command.
    setCliHistory(prevHistory => [...prevHistory, `> ${command}`, newEntry].filter(Boolean));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setInput('');
      handleCommand(input.trim());
    }
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
