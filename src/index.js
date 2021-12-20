const createCsvWriter = require('csv-writer').createObjectCsvWriter;
import Account from './models/account';
import Transaction from './models/Transaction';

function rand(maxLimit = 100) {
  return  Math.floor(Math.random() * maxLimit);
}   

function writeToCSV(filename, headers, data) {
  return new Promise((resolve, reject) => {
    // Setup CSV Writer
    const csvWriter = createCsvWriter({
      path: filename,
      header: headers
    });
    
    // Write to CSV
    csvWriter
    .writeRecords(data)
    .then(() => {
      console.log(`The CSV file ${filename} was written successfully`);
      resolve(true);
    });
  });
}

function generateTransaction(senderAccount, receiverAccount, amountMax) {
  return new Transaction(senderAccount.name, receiverAccount.name, rand(amountMax));
}

function generateTransactions(accounts, numTransactions, amountMax) {
  const transactions = [];
  // Generate Transactions
  for(var i = 0; i < numTransactions; i++){
    var senderId = 3; 
    var receiverId = 3; 
    // run this loop until numberOne is different than numberThree
    do {
        senderId = rand(accounts.length);
        receiverId = rand(accounts.length);
    } while((senderId === receiverId));
    
    // Generate Transaction
    const tx = generateTransaction(accounts[senderId], accounts[receiverId], amountMax);
    
    // Update the Account Balances
    accounts[senderId].balance -= tx.amount;
    accounts[receiverId].balance += tx.amount;

    // Add Transaction to the array
    transactions.push(tx);
  } 

  return transactions;
}

async function main() {
  
  const numAccounts = 1000;
  const numTransactions = 1000
  const initialBalance = 1000;
  const transctionMaxAmount = 10;
  const accounts = [];
  const transactionBatches = [];
  const batches = [1000, 5000, 10000];

  const accountHeaders = [
    {id: 'id', title: 'id'},
    {id: 'name', title: 'name'},
    {id: 'balance', title: 'balance'},
  ];
  const transactionHeaders = [
    {id: 'sender', title: 'sender'},
    {id: 'receiver', title: 'receiver'},
    {id: 'amount', title: 'amount'},
  ];

  // Generate number of accounts
  for(var i = 0; i < numAccounts; i++){
    // accounts.push(initialBalance);
    accounts.push(new Account(i, i.toString(), initialBalance));
  }

  // Write to CSV
  await writeToCSV('./data/accounts.csv', accountHeaders, accounts);

  // Generate transactions for each batch
  for (const numTransactions of batches) {
    const transactions = generateTransactions(accounts, numTransactions, transctionMaxAmount)

    // Write to file
    await writeToCSV(`./data/transactions_${numTransactions}.csv`, transactionHeaders, transactions);
    transactionBatches.push(transactions);
  }

  // Repeat for additional Run 
  transactionBatches.forEach((transactions) => {
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    })
  })

  // Repeat for additional Run 
  transactionBatches.forEach((transactions) => {
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    })
  }) 
 
  // Write Ending Account Balances to CSV
  await writeToCSV('./data/accounts_end.csv', accountHeaders, accounts);

}

// main();
(async () => {
  try {
      var text = await main();
      console.log("Finished Generating Transactions");
  } catch (e) {
      // Deal with the fact the chain failed
  }
})();