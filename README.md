# DKATALIS X JAGO INTERNSHIP CHALLENGE PROBLEM 1

This is a ReactJS solution for problem 1 given in the DKatalis x Jago Tech Internship created by Fransiscus-Xaverius. The web app allows users to simulate a Command Line Interface (CLI) of an ATM with a retail bank. Features include logging in, logging out, transfering between users, depositing a certain amount to an account, money withdrawals, and a debt and loan system.

This is made with a ReactJS + Vite template that provides a minimal setup to get React Working with HMR and ESLint Rules. Because it's assumed that I can use any framework to help with this solution I chose to use ReactJS due to my prior experience with ReactJS as well as how ReactJS would create a good solution to simulate a CLI due to its use of JSX.

This project uses:

Node as its Runtime

ReactJS as the main framework 

Jest (and technically babel) for testing 

ESLint for code quality through enforced linting rules

This project is also using the following plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

**Running the App**

1. Open a terminal

2. Install dependencies

    ```bash
    npm i   
    ```

3. Run the app using the already included script

    ```bash
    npm run dev
    ```

**Running Unit Tests**
1. Open a terminal

2. Install dependencies (If you haven't)
    ```bash
    npm i
    ```

3. Run the unit test in the tests folder using the included script. 
    ```bash
    npm run test
    ```

### For DKATALIS Reviewers

## ASSUMPTIONS

A few assumptions I made:
1. Because the app itself is supposed to just be a CLI prototype that mimics an ATM, I assumed that a backend portion is not needed and thus a backend is not created.

2. Because the problem doesn't specify if the user can be indebted to multiple people or not, I assumed that a user can be indebted to multiple users at once, and that the debt payment will be conducted in a FIFO manner automatically when the user in debt deposited any amount of money.

3. Because the problem doesn't specify if the user will have a history of transactions, I've assumed that in real life situations this will be needed and thus created an array that stores histories of transactions.

4. Because the problem doesn't specify what data structure we should use, I used a Map as a temporary variable to store user objects, and used a map in the debts and loans system to make it easier to check if a user had a prior debt to another user.


