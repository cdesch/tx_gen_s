const { assert } = require('console');
const csv = require('csv-parser');
const fs = require('fs');

import Account from './models/account';
import Transaction from './models/Transaction';


function readAccounts(filename) {
  return new Promise((resolve, reject) => {
    const accounts = [];
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (row) => {
      const account = new Account(parseInt(row.id), row.name, parseInt(row.balance));
      accounts.push(account);
    })
    .on('end', () => {
      console.log(`CSV file ${filename} successfully processed`);
      resolve(accounts);
    });
  });
}

function readTransactions(filename) {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (row) => {
      const tx = new Transaction(parseInt(row.sender), parseInt(row.receiver), parseInt(row.amount));
      items.push(tx);
    })
    .on('end', () => {
      console.log(`CSV file ${filename} successfully processed`);
      resolve(items);
    });
  });
}

async function main() {
  const accounts_file = './data/accounts.csv';
  const accounts_end_file = './data/accounts_end.csv';
  const batches = [1000, 5000, 10000];
  const transaction_files = batches.map((amount) => `./data/transactions_${amount}.csv`);

  // Read in initial Account Data
  const accounts = await readAccounts(accounts_file);

  // Read in Each Transaction file and run them
  for (const file of transaction_files) {
    const transactions = await readTransactions(file);
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    });
  }

  // Repeat for additional run
  for (const file of transaction_files) {
    const transactions = await readTransactions(file);
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    });
  }

  // Repeat
  for (const file of transaction_files) {
    const transactions = await readTransactions(file);
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    });
  }

  // Compare and Validate
  const accountsEnd = await readAccounts(accounts_end_file);
  for (let i = 0; i < accounts.length; i++) {
    assert(accounts[i].balance === accountsEnd[i].balance);
  }

  console.log("Finished Validation");
}

// Start
main();