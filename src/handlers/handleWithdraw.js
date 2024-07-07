import User from "../entities/user";
import { userDetails } from "../utils/helperFunctions";

/**
 * Handles the user withdraw command.
 * 
 * @param {Array} commands - A string array containing the command and its arguments split with a space
 * @param {User} currentUser - The currently logged-in user
 * @param {Function} setCurrentUser - Function to set the current logged-in user
 * @returns {string} - The result message of the withdraw command
 */
const handleWithdraw = (commands, currentUser, setCurrentUser) => {
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

  // Create a copy of the current user and update the balance and history
  const updatedUser = { ...currentUser };
  updatedUser.balance -= amount;
  updatedUser.history.push(`Withdrew $${amount}. New balance: $${updatedUser.balance}`);

  setCurrentUser(updatedUser); // Update the state with the new user object

  // Generate the user details
  const userDetailsMessage = userDetails(updatedUser, `Withdrew $${amount}.`);

  return userDetailsMessage;
};

export default handleWithdraw;
