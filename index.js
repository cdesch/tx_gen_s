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

function main() {
  
  const numAccounts = 1000;
  const numTransactions = 1000
  const initialBalance = 1000;
  const transctionMaxAmount = 10;
  const accounts = [];
  const transactions = [];
  // Generate number of accounts
  for(var i = 0; i < numAccounts; i++){

    // accounts.push(initialBalance);
    accounts.push(new Account(i, i.toString(), initialBalance));
  }

  // Write to CSV
  const accountsWriter = createCsvWriter({
    path: 'accounts.csv',
    header: [
      {id: 'id', title: 'id'},
      {id: 'name', title: 'name'},
      {id: 'balance', title: 'balance'},
    ]
  });
  accountsWriter
  .writeRecords(accounts)
  .then(()=> console.log('The CSV file was written successfully'));

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
    // console.log(senderId)
    // console.log(receiverId)
    
    const tx = generateTransaction(accounts[senderId], accounts[receiverId], transctionMaxAmount);
    accounts[senderId].balance -= tx.amount;
    accounts[receiverId].balance += tx.amount;
    // accounts.push(initialBalance);
    transactions.push(tx);
  } 
  
  // Write to CSV
  const transactionsWriter = createCsvWriter({
    path: 'transactions.csv',
    header: [
      {id: 'sender', title: 'sender'},
      {id: 'receiver', title: 'receiver'},
      {id: 'amount', title: 'amount'},
    ]
  });

  transactionsWriter
  .writeRecords(transactions)
  .then(()=> console.log('The CSV file was written successfully'));


  // Write to CSV
  const accountsEndWriter = createCsvWriter({
    path: 'accounts_end.csv',
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