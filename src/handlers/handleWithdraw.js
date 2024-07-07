import User from "../entities/user";
import { userDetails } from "../utils/helperFunctions";

/**
 * Handles the user withdraw command.
 * 
 * @param {Array} commands - A string array containing the command and its arguments split with a space.
 * @param {User} currentUser - The currently logged-in user.
 * @param {Map} users - The current state of the map of users.
 * @param {Function} setUsers - Function to update the state of the map of users.
 * @param {Function} setCurrentUser - Function to set the current logged-in user.
 * @returns {string} - The result message of the withdraw command.
 */
const handleWithdraw = (commands, currentUser, users, setUsers, setCurrentUser) => {
  if (!currentUser) {
    return 'No user is currently logged in. Please log in first.';
  }

  if (!commands[1]) {
    return 'Please specify an amount to withdraw';
  }

  const amount = parseInt(commands[1], 10);

  if (isNaN(amount) || amount <= 0) {
    return 'Please specify a valid amount to withdraw (positive round numbers only)';
  }

  if (currentUser.balance < amount) {
    return `Insufficient funds. Your current balance is $${currentUser.balance}`;
  }

  //Create a copy of the current user
  const updatedCurrentUser = { ...currentUser, balance: currentUser.balance - amount, history: [...currentUser.history] };
  
  //Add the withdrawal to the user's history
  updatedCurrentUser.history.push(`Withdrew $${amount}. New balance: $${updatedCurrentUser.balance}`);

  //Update state
  const updatedUsers = new Map(users);
  updatedUsers.set(currentUser.username, updatedCurrentUser);
  setUsers(updatedUsers);
  setCurrentUser(updatedCurrentUser);

  //Generate the user details message
  const userDetailsMessage = userDetails(updatedCurrentUser, `Withdrew $${amount}.`);

  return userDetailsMessage;
};

export default handleWithdraw;
