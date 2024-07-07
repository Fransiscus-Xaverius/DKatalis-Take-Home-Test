class User {
    /**
     * Creates a user object.
     * @param {string} username - The username of the user.
     * @param {number} [balance=0] - The balance of the user.
     * @param {Array} [history=[]] - The transaction history of the user.
     * @param {Map} [debts=new Map()] - The debts of the user.
     * @param {Map} [loans=new Map()] - The loans of the user.
     */
    constructor(username, balance = 0, history = [], debts = new Map(), loans = new Map()) {
        this.username = username;
        this.balance = balance;
        this.history = history;
        this.debts = debts;
        this.loans = loans;
    }
}
  
export default User;