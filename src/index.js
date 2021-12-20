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


const chooseRandom = (arr, num = 1) => {
  const res = [];
  for(let i = 0; i < num; ){
     const random = Math.floor(Math.random() * arr.length);
     if(res.indexOf(arr[random]) !== -1){
        continue;
     };
     res.push(arr[random]);
     i++;
  };
  return res;
}; 

function generateTransaction(senderAccount, receiverAccount, amountMax) {
  return new Transaction(senderAccount.name, receiverAccount.name, rand(amountMax));
}

function generateTransactions(accounts, numTransactions, amountMax) {
  const transactions = [];
  // Generate Transactions
  // const accountsForTransaction = chooseRandom(accounts, 2)
  // console.log(accountsForTransaction);
  for(var i = 0; i < numTransactions; i++){
    var senderId = 3; 
    var receiverId = 3; 
    // console.log(accounts.length)
    // run this loop until numberOne is different than numberThree
    do {
        senderId = rand(accounts.length);
        receiverId = rand(accounts.length);
    } while((senderId === receiverId));
    
    const tx = generateTransaction(accounts[senderId], accounts[receiverId], amountMax);
    accounts[senderId].balance -= tx.amount;
    accounts[receiverId].balance += tx.amount;
    transactions.push(tx);
  } 

  // Write to CSV
  const transactionsWriter = createCsvWriter({
    path: `../data/transactions_${numTransactions}.csv`,
    header: [
      {id: 'sender', title: 'sender'},
      {id: 'receiver', title: 'receiver'},
      {id: 'amount', title: 'amount'},
    ]
  });

  // Write to CSV
  transactionsWriter
  .writeRecords(transactions)
  .then(()=> console.log('The CSV file was written successfully'));


  return transactions;
}

function main() {
  
  const numAccounts = 1000;
  const numTransactions = 1000
  const initialBalance = 1000;
  const transctionMaxAmount = 10;
  const accounts = [];
  const transactionBatches = [];
  const batches = [1000, 5000, 10000];

  // Generate number of accounts
  for(var i = 0; i < numAccounts; i++){
    // accounts.push(initialBalance);
    accounts.push(new Account(i, i.toString(), initialBalance));
  }

  // Write to CSV
  const accountsWriter = createCsvWriter({
    path: '../data/accounts.csv',
    header: [
      {id: 'id', title: 'id'},
      {id: 'name', title: 'name'},
      {id: 'balance', title: 'balance'},
    ]
  });
  accountsWriter
  .writeRecords(accounts)
  .then(()=> console.log('The CSV file was written successfully'));


  // Generate for each batch
  batches.forEach(element => {
    const transactions = generateTransactions(accounts, element, transctionMaxAmount)
    transactionBatches.push(transactions);
  });

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
  const accountsEndWriter = createCsvWriter({
    path: '../data/accounts_end.csv',
    header: [
      {id: 'id', title: 'id'},
      {id: 'name', title: 'name'},
      {id: 'balance', title: 'balance'},
    ]
  });
  accountsEndWriter
  .writeRecords(accounts)
  .then(()=> console.log('The CSV file was written successfully'));

}


main();