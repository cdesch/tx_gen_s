const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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


  // // Write to CSV
  // const transactionsWriter = createCsvWriter({
  //   path: `./data/transactions_${numTransactions}.csv`,
  //   header: [
  //     {id: 'sender', title: 'sender'},
  //     {id: 'receiver', title: 'receiver'},
  //     {id: 'amount', title: 'amount'},
  //   ]
  // });

  // // Write to CSV
  // transactionsWriter
  // .writeRecords(transactions)
  // .then(()=> console.log('The CSV file was written successfully'));

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
  // const accountsWriter = createCsvWriter({
  //   path: './data/accounts.csv',
  //   header: [
  //     {id: 'id', title: 'id'},
  //     {id: 'name', title: 'name'},
  //     {id: 'balance', title: 'balance'},
  //   ]
  // });
  // accountsWriter
  // .writeRecords(accounts)
  // .then(()=> console.log('The CSV file was written successfully'));
  await writeToCSV('./data/accounts.csv', accountHeaders, accounts);

  console.log(batches);
  // Generate for each batch
  for (const numTransactions of batches) {
    const transactions = generateTransactions(accounts, numTransactions, transctionMaxAmount)

    // Write to file
    await writeToCSV(`./data/transactions_${numTransactions}.csv`, transactionHeaders, transactions);
    transactionBatches.push(transactions);
  }

  // batches.forEach(element => {
  //   const transactions = generateTransactions(accounts, element, transctionMaxAmount)
  
  //   const result = await writeToCSV(`./data/transactions_${numTransactions}.csv`,transactionHeaders, transactions);
  //   console.log(result);
  //   transactionBatches.push(transactions);
  // });

  // Repeat
  transactionBatches.forEach((transactions) => {
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    })
  })

  // Repeat
  transactionBatches.forEach((transactions) => {
    transactions.forEach((tx) => {
      accounts[tx.sender].balance -= tx.amount;
      accounts[tx.receiver].balance += tx.amount;
    })
  }) 
 
  // Write to CSV
  // const accountsEndWriter = createCsvWriter({
  //   path: './data/accounts_end.csv',
  //   header: [
  //     {id: 'id', title: 'id'},
  //     {id: 'name', title: 'name'},
  //     {id: 'balance', title: 'balance'},
  //   ]
  // });

  // accountsEndWriter
  // .writeRecords(accounts)
  // .then(()=> console.log('The CSV file was written successfully'));
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