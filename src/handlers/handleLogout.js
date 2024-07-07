/**
 * Handles the user logout command.
 * 
 * @param {User} currentUser - The currently logged-in user object. 
 * @param {Function} setCurrentUser - The function to set the current logged-in user state.
 * @returns {string} - The result message of the logout attempt.
 */

import User from "../entities/user";

const handleLogout = (currentUser, setCurrentUser) => {
  if (currentUser) {
    const username = currentUser.username;
    setCurrentUser(null);
    return `Goodbye, ${username}`;
  }
  return 'No user is currently logged in';
};
  
export default handleLogout;