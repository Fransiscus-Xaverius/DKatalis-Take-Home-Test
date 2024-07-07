import User from "../entities/user";

/**
 * Handles the deposit command. This function can also pay off debts if the user has any. The debts are paid off in a FIFO basis.
 * 
 * @param {Array} commands - A string array containing the command and its arguments split with a space.
 * @param {User} currentUser - The currently logged-in user object.
 * @param {Map} users - The current state of the map of users.
 * @param {Function} setUsers - Function to update the state of the map of users.
 * @param {Function} setCurrentUser - Function to set the current logged-in user.
 * @returns {string} - The result message of the deposit command attempt.
 */
const handleDeposit = (commands, currentUser, users, setUsers, setCurrentUser) => {
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
  let newEntry = ``;

  // Create a copy of the current user
  const updatedCurrentUser = { ...currentUser, balance: currentUser.balance, history: [...currentUser.history], debts: new Map(currentUser.debts) };

  // Create a new map for users to reflect changes
  const updatedUsers = new Map(users);

  for (const [lender, debtAmount] of updatedCurrentUser.debts.entries()) {
    if (remainingAmount > 0) {
      const targetUser = updatedUsers.get(lender);
      const updatedTargetUser = { ...targetUser, balance: targetUser.balance, history: [...targetUser.history], loans: new Map(targetUser.loans) };

      if (remainingAmount >= debtAmount) {
        remainingAmount -= debtAmount;
        updatedCurrentUser.history.push(`Paid off debt of $${debtAmount} to ${lender}`);
        newEntry += `Transferred $${debtAmount} to ${lender}.\n`;
        updatedCurrentUser.debts.delete(lender);

        updatedTargetUser.balance += debtAmount;
        updatedTargetUser.loans.delete(currentUser.username);
        updatedTargetUser.history.push(`Received $${debtAmount} from ${currentUser.username} as debt payment`);
      } 
      else {
        updatedCurrentUser.debts.set(lender, debtAmount - remainingAmount);
        updatedCurrentUser.history.push(`Paid $${remainingAmount} to ${lender} as partial payment. Remaining debt: $${debtAmount - remainingAmount}`);
        newEntry += `Transferred $${remainingAmount} to ${lender}.\n`;

        updatedTargetUser.balance += remainingAmount;
        updatedTargetUser.loans.set(currentUser.username, debtAmount - remainingAmount);
        updatedTargetUser.history.push(`Received $${remainingAmount} from ${currentUser.username} as partial debt payment`);

        remainingAmount = 0;
      }

      updatedUsers.set(lender, updatedTargetUser);
    }
  }

  updatedCurrentUser.balance += remainingAmount;

  updatedCurrentUser.history.push(`Deposited $${remainingAmount}. New balance: $${updatedCurrentUser.balance}`);

  // Update state
  setUsers(new Map(updatedUsers.set(currentUser.username, updatedCurrentUser)));
  setCurrentUser(updatedCurrentUser);
  newEntry += `Your balance is $${updatedCurrentUser.balance}.\n`;
  return newEntry;
};

export default handleDeposit;
