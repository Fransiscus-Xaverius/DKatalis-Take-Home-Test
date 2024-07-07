import User from "../entities/user";
import { userDetails } from "../utils/helperFunctions";

/**
 * Handles the transfer command between two users. This function can also create debts and loans if the user that transferred money doesn't have enough balance.
 * If the user being transferred to has a debt, the transferred amount will automatically be used to pay off their debt first.
 * 
 * @param {Array} commands - A string array containing the command and its arguments split with a space.
 * @param {User} currentUser - The currently logged-in user object.
 * @param {Map} users - The current state of the map of users.
 * @param {Function} setUsers - Function to update the state of the map of users.
 * @param {Function} setCurrentUser - Function to set the current logged-in user.
 * @returns {string} - The result message of the transfer command.
 */
const handleTransfer = (commands, currentUser, users, setUsers, setCurrentUser) => {
  if (!currentUser) {
    return 'No user is currently logged in. Please log in first.';
  }

  const targetUsername = commands[1];
  const amount = parseInt(commands[2], 10);

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
  const updatedCurrentUser = { ...currentUser, balance: currentUser.balance, history: [...currentUser.history], debts: new Map(currentUser.debts) };
  const updatedTargetUser = { ...targetUser, balance: targetUser.balance, history: [...targetUser.history], debts: new Map(targetUser.debts), loans: new Map(targetUser.loans) };

  let remainingAmount = amount;
  let messageEntry = '';

  // Pay off target user's debts first
  for (const [lender, debtAmount] of updatedTargetUser.debts.entries()) {
    if (remainingAmount <= 0) break;

    if (remainingAmount >= debtAmount) {
      remainingAmount -= debtAmount;
      updatedTargetUser.debts.delete(lender);
      updatedTargetUser.history.push(`Paid off debt of $${debtAmount} to ${lender}`);

      const lenderUser = users.get(lender);
      if (lenderUser) {
        const updatedLenderUser = { ...lenderUser, balance: lenderUser.balance + debtAmount, history: [...lenderUser.history], loans: new Map(lenderUser.loans) };
        updatedLenderUser.loans.delete(targetUsername);
        updatedLenderUser.history.push(`Received $${debtAmount} from ${targetUsername} as debt payment`);
        users.set(lender, updatedLenderUser);
      }
    } 
    else {
      updatedTargetUser.debts.set(lender, debtAmount - remainingAmount);
      updatedTargetUser.history.push(`Paid $${remainingAmount} to ${lender} as partial payment. Remaining debt: $${debtAmount - remainingAmount}`);

      const lenderUser = users.get(lender);
      if (lenderUser) {
        const updatedLenderUser = { ...lenderUser, balance: lenderUser.balance + remainingAmount, history: [...lenderUser.history], loans: new Map(lenderUser.loans) };
        updatedLenderUser.loans.set(targetUsername, debtAmount - remainingAmount);
        updatedLenderUser.history.push(`Received $${remainingAmount} from ${targetUsername} as partial debt payment`);
        users.set(lender, updatedLenderUser);
      }

      remainingAmount = 0;
    }
  }

  // Handle transfer when current user does not have enough balance
  if (updatedCurrentUser.balance < remainingAmount) {
    const deficit = remainingAmount - updatedCurrentUser.balance;
    updatedCurrentUser.debts.set(targetUsername, deficit);
    updatedTargetUser.loans.set(currentUser.username, deficit);
    updatedTargetUser.balance += updatedCurrentUser.balance;
    updatedCurrentUser.balance = 0;
    messageEntry = `You transferred $${amount} to ${targetUsername}.`;
  } 
  else {
    updatedCurrentUser.balance -= remainingAmount;
    updatedTargetUser.balance += remainingAmount;
    messageEntry = `You transferred $${amount} to ${targetUsername}.`;
  }

  updatedCurrentUser.history.push(messageEntry);
  updatedTargetUser.history.push(`Received $${amount} from ${currentUser.username}`);

  setUsers(new Map(users.set(targetUsername, updatedTargetUser).set(currentUser.username, updatedCurrentUser)));
  setCurrentUser(updatedCurrentUser);

  const userDetailsMessage = userDetails(updatedCurrentUser, messageEntry);
  return userDetailsMessage;
};

export default handleTransfer;
