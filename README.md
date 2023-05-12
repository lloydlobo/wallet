<h1>paisa</h1>

## Table Of Contents

<!--toc:start-->
- [Table Of Contents](#table-of-contents)
- [**Ideas for designing an expense tracking app**](#ideas-for-designing-an-expense-tracking-app)
  - [**Additional features**](#additional-features)
- [**Data structures**](#data-structures)
  - [**Considerations**](#considerations)
- [Usage](#usage)
  - [Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)](#learn-more-on-the-solid-websitehttpssolidjscom-and-come-chat-with-us-on-our-discordhttpsdiscordcominvitesolidjs)
- [Available Scripts](#available-scripts)
  - [`npm dev` or `npm start`](#npm-dev-or-npm-start)
  - [`npm run build`](#npm-run-build)
- [Deployment](#deployment)
<!--toc:end-->

## **Ideas for designing an expense tracking app**

* **Design a simple and intuitive interface.**
* **Offer a variety of features to track expenses, such as by category, location, and date.**
* **Make it easy to add expenses, on both mobile and desktop.**
* **Provide insights into spending habits, so users can identify areas to save money.**
* **Allow users to share their data with others, such as a spouse or financial advisor.**

### **Additional features**

* **Automatic expense tracking.**
* **Bill reminders.**
* **In-app budgeting tools.**
* **Goal setting and tracking.**
* **Investment tracking.**
* **Tax planning tools.**

## **Data structures**

* **Expense:** Date, amount, category, location.
* **User:** Name, email address, password.
* **Budget:** Name, start date, end date, amount.
* **Transaction:** Date, amount, category, location.
* **TransactionHistory:** List of all transactions for a given user.

### **Considerations**

* **Performance:** The data structures should be efficient and perform well, even with large amounts
  of data.
* **Scalability:** The data structures should be scalable so that they can handle increasing amounts
  of data.
* **Security:** The data structures should be secure to protect user data.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This
file can be safely be removed once you clone a template.
```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
