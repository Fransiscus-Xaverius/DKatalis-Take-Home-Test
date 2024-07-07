
/**
 * Checks if a user exists in the map of users.
 * 
 * @param {Map} users - The current state of the map of users.
 * @param {string} key - The username of the user.
 * @returns {boolean} - True if the user exists, false otherwise.
 */
function userDoesNotExist(users, key) {
    return !users.has(key);
}

function userDetails(user, newEntry) {
    if (!user) {
      return newEntry;
    }
  
    let details = `Your balance is $${user.balance}`;
  
    if (user.debts.size > 0) {
        user.debts.forEach((amount, lender) => {
            details += `\nOwed $${amount} to ${lender}`;
        });
    } 

    if (user.loans.size > 0) {
        user.loans.forEach((amount, borrower) => {
            details += `\nOwed $${amount} from ${borrower}`;
        });
    }
    return `${newEntry}\n${details}`;
}

export { userDoesNotExist, userDetails };
