const { assert } = require('console');
const csv = require('csv-parser');
const fs = require('fs');
// const accounts = [];

class Account {
  constructor(id, name, balance) {
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
}

class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
  }
 
}

// fs.createReadStream('data.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });

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
      console.log('CSV file successfully processed');
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
      console.log('CSV file successfully processed');
      resolve(items);
    });
  });
}

async function main() {
  const accounts_file = 'accounts.csv';
  const accounts_end_file = 'accounts_end.csv';
  const batches = [1000, 5000, 10000];
  const transaction_files = batches.map((amount) => `transactions_${amount}.csv`);
  // console.log(transaction_files);

  const accounts = await readAccounts(accounts_file);

  for (const file of transaction_files) {
    const transactions = await readTransactions(file);
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    });
  }

  // Compare
  const accountsEnd = await readAccounts(accounts_end_file);
  for (let i = 0; i < accounts.length; i++){
    assert(accounts[i].balance === accountsEnd[i].balance);
  }

  console.log("done");
}


main();