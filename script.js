'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2024-02-13T14:43:26.374Z',
    '2024-02-19T18:49:59.371Z',
    '2024-02-20T12:10:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function calDaysPassed(date1, date2) {
  return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

function calDate(date) {
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth()}`.padStart(2, 0);
  // const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, 0);
  const min = `${date.getMinutes()}`.padStart(2, 0);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const local = navigator.language;

  const dateDiff = calDaysPassed(new Date(), date);
  console.log();
  if (dateDiff === 0) return `Today ${hour}:${min}`;
  if (dateDiff === 1) return `Yesterday ${hour}:${min}`;
  if (dateDiff <= 7 && dateDiff > 1)
    return `${dateDiff} days ago ${hour}:${min}`;
  else {
    // return `${day}/${month}/${year}, ${hour}:${min}`;
    return new Intl.DateTimeFormat(local, options).format(date);
  }
}

function formatcur(mov) {
  return new Intl.NumberFormat(currentAcccount.locale, {
    style: 'currency',
    currency: currentAcccount.currency,
  }).format(mov);
}

function displayMove(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; //ternary operator
    //displaying the date of transaction
    const date = new Date(acc.movementsDates[i]);

    const displyDate = calDate(date);
    const formatt = formatcur(mov);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displyDate}</div>
      <div class="movements__value">${formatt}</div>
    </div>
    `; // template literal
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

/*-----USING THE REDUCE METHOD TO SHOW BALANCE-----*/
function calcDisplayBalance(account) {
  const balance = account.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  account.balance = balance;

  labelBalance.textContent = formatcur(balance);
}

function calDisplaySummary(account) {
  /*------CALCULATE INCOME----------*/
  const income = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    });
  labelSumIn.textContent = formatcur(income);

  /*----- CALCULATING THE OUTGOING TRANSACTION -----------*/
  const output = account.movements
    .filter(move => move < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatcur(Math.abs(output));

  /*----- CALCULATING THE INTREST -----------*/
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = formatcur(interest);
}

/*-----USING THE MAP METHOD TO CREATE USERNAME-----*/
function createUsername(accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner // creating a new username property for each account in the account array
      .toLowerCase() //convert string to lowercase
      .split(' ') //turn string to array
      .map(function (value) {
        return value[0];
      }) //loop over the array and return the first letter using the map method
      .join(''); //use join method to make the array a string
  });
}
createUsername(accounts);

/* ------UPDATING THE INTERFACE ----------*/
function updateUI(curaccount) {
  // Display Movements
  displayMove(curaccount);
  // Display Balance
  calcDisplayBalance(curaccount);
  // Display Summary
  calDisplaySummary(curaccount);
}

/*----------LOGOUT TIMER ----------------*/
function startLogOutTimer() {
  // set the time to 5 minutes
  let time = 120;

  const timer = setInterval(function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${Math.trunc(time % 60)}`.padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    // Stop the timer by using clearInterval
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decress the timer
    time--;
  }, 1000);

  return timer;
}

/*EVENT HANDLERS*/
let currentAcccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAcccount = account1;
// updateUI(currentAcccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  /*--------- IMPLEMENTING LOGIN --------*/
  currentAcccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAcccount);

  // displaying current date upon login

  const now = new Date();
  /*----------- USING INTERNATIONAL FORMATTER API ------------*/

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
  };

  // getting their local language from thier browser
  const local = navigator.language;
  console.log(local);

  // labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);

  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth()}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const min = `${now.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  if (currentAcccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAcccount.owner.split(' ')[0]
    }`;

    // Display UI
    containerApp.style.opacity = 100;

    updateUI(currentAcccount);

    // Clear input field
    inputLoginPin.value = inputLoginUsername.value = '';

    // losing the focus of the input
    inputLoginPin.blur();
    inputLoginUsername.blur();
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

/*-------- USING THE SOME METHOD TO IMPLEMENT LOAN FEATURE----------*/
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.trunc(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAcccount.movements.some(function (mov) {
      return mov >= amount / 10;
    })
  ) {
    setTimeout(function () {
      // Add movement
      currentAcccount.movements.push(amount);
      // Adding the transaction date
      currentAcccount.movementsDates.push(new Date());

      // updating the UI
      updateUI(currentAcccount);
      inputLoanAmount.value = '';
    }, 3000);

    // Reset logout timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    // validating the transfer
    amount > 0 &&
    recieverAcc &&
    currentAcccount.balance >= amount &&
    recieverAcc.username !== currentAcccount.username
  ) {
    // Doing the transfer
    currentAcccount.movements.push(-amount);
    // pushing the date of transafer into the transfer array of the sending
    currentAcccount.movementsDates.push(new Date());

    // pushing the transaction into the transaction array
    recieverAcc.movements.push(amount);
    // pushing the date of transafer into the transfer array of the reciever
    recieverAcc.movementsDates.push(new Date());

    // updating the UI
    updateUI(currentAcccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // making the input field empty
  if (
    currentAcccount.username === inputCloseUsername.value &&
    currentAcccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAcccount.username;
    });
    console.log(accounts[index]);

    // Delete account
    accounts.splice(index, 1);

    // hide interface
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMove(currentAcccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

/*---------------- SLICE ------------*/
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2, 4), arr); // the ending parameter is not included in the output
console.log(arr.slice(-2)); //this starts from the back
console.log(arr.slice(1, -2)); //this removes the first item on the array and also the last two items

/*-----SPLICE------*/
// this cuts out part of the oriinal array and leave the remaining one in the original array, note this changes the original array
console.log(arr.splice(-1), arr);
// console.log(arr.splice(2), arr);

/*-----REVERSE------*/
// this mutates the original array
arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse(), arr2);

/*-----Concat------*/
// this joins two array, but this dose not mutate the original array
const letters = arr.concat(arr2);
console.log(letters);
// another to do this
console.log([...arr, ...arr2]);

// we can also use the join method

/*-----AT------*/
console.log(arr[0]);
// we can do the below instead
console.log(arr.at(0));

console.log(arr[arr.length - 1]);
// we can do the below instead
let sam = arr.slice(-1)[0];
console.log(sam);
// even better the below
console.log(arr.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*----FOR EACH LOOP---*/

for (const trans of movements) {
  if (trans > 0) {
    console.log(`Deposit of ${trans} was Successful`);
  } else {
    console.log(`Withdraw of ${Math.abs(trans)} was Successful`);
  }
}

console.log('----FOREACH----');
// it dosent nesseciarily need to have an index parameter
movements.forEach(function (trans, index) {
  if (trans > 0) {
    console.log(`${index + 1}: Deposit of ${trans} was Successful`);
  } else {
    console.log(`${index + 1}: Withdraw of ${Math.abs(trans)} was Successful`);
  }
});

/* ------ FOREACH IN MAP AND SET ------ */
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// MAP
currencies.forEach(function (value, key, map) {
  console.log(`this is the key ${key}: while this is the value ${value}`);
});

// SET
// it wont make sense because set dosent have a key or an index
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`);
});

// Coding Challenge
function checkdogs(arr1, arr2) {
  const juliacorrected = arr1.slice();
  juliacorrected.splice(0, 1);
  juliacorrected.splice(-2);
  console.log(juliacorrected);

  // array with both dogs
  const completedDogs = juliacorrected.concat(arr2);
  // console.log(completedDogs);

  // printing out the string based on the age of the dog
  completedDogs.forEach(function (age, i) {
    const str =
      age > 3
        ? `Dog ${i + 1} is an adult, and is ${age} years old`
        : `Dog ${i + 1} is still a puppy 🐶`;
    console.log(str);
  });
}

// Test data
const julia = [3, 5, 2, 12, 7];
const kate = [9, 16, 6, 8, 3];
checkdogs(julia, kate);
checkdogs([9, 16, 6, 8, 3], [10, 5, 6, 1]);

/* ---ARRAY MAP METHOD-----*/
const eurTOUsd = 1.1;
const movementss = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const movementsUsd = movementss.map(function (mov) {
//   return mov * 1.1;
// });

// arrow call back function
const movementsUsd = movements.map(move => move * eurTOUsd);
console.log(movementss, movementsUsd);

// THE ABOVE IS SAME AS THIS
// const movementUsd = [];
// for (const i of movementss) {
//   movementUsd.push(i * eurTOUsd);
// }
// console.log(movementUsd);

const movementsDescription = movementss.map(function (move, i, arr) {
  // if (move > 0) {
  //   return `${i + 1}: Deposit of ${move} was Successful`;
  // } else {
  //   return `${i + 1}: Withdraw of ${Math.abs(move)} was Successful`;
  // }
  return `Movement ${
    i + 1
  }: ${move > 0 ? 'Deposite' : 'Withdraw'} of ${Math.abs(move)} was Successful`;
});
console.log(movementsDescription);

/* --------USING THE FILTER METHOD--------*/
const Deposits = movements.filter(function (value) {
  return value > 0;
});
console.log(Deposits);

const withdrawals = movements.filter(function (value) {
  return value < 0;
});
// using arrow function
const withdrawalsArr = movements.filter(value => value < 0);

console.log(withdrawals, withdrawalsArr);

/* --------USING THE REDUCE METHOD--------*/
const balance = movements.reduce(function (
  accumulator,
  currentValue,
  index,
  entireArray
) {
  console.log(`iteration number ${index} : ${accumulator}`);
  return accumulator + currentValue;
},
100);

// using an arrow function
const balanceArr = movements.reduce(
  (accumulator, currenValue, index) => accumulator + currenValue,
  100
);

console.log(balance);
console.log(balanceArr);

// get highest value in the array
const max = movements.reduce(function (acc, mov) {
  return (acc = acc > mov ? acc : mov);
}, movements[0]);
console.log(max);

// coding challenge 2
function calcAverageHumanAges(dogages) {
  const humanAges = dogages.map(function (value) {
    if (value < 3) {
      return value * 2;
    } else {
      return 16 + value * 4;
    }
  });

  // const humanAges = dogages.map(value =>
  //   value <= 2 ? value * 2 : value + 16 * 4
  // );
  const adult = humanAges.filter(function (age) {
    return age >= 18;
  });

  console.log(humanAges, adult);
  const average =
    adult.reduce(function (acc, cur) {
      return acc + cur;
    }, 0) / adult.length;
  return average;
}

console.log(calcAverageHumanAges([5, 2, 4, 1, 15, 8, 3]));

// Coding challenge 3
const calcAverageHumanAges2 = dogages => {
  const humanAges = dogages
    .map(age => (age < 2 ? age * 2 : age + 16 * 4))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  return humanAges;
};
console.log(calcAverageHumanAges2([5, 2, 4, 1, 15, 8, 3]));

const depositInUsd = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * 1.1;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  });
console.log(depositInUsd);

// the above in arrow function
const DepositInUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * 1.1)
  .reduce((acc, cur) => acc + cur);
console.log(DepositInUsd, typeof DepositInUsd);

/*-------FIND METHOD --------*/
const firstWithdrawal = movements.find(function (mov) {
  return mov < 0;
});
console.log(typeof firstWithdrawal, firstWithdrawal, movements);

// finding an object in an array with its property as a condition

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

/* ---------- SOME AND EVERY METHODS --------------*/
// unlike the includes method, the some method can check for conditions

const anyDeposits = movements.some(function (mov) {
  return mov > 0;
});

console.log(anyDeposits);

const DepositeAbove5000 = movements.some(mov => mov > 5000);
console.log(DepositeAbove5000, movements);

// The every method returns true if all the elements satisfied the condition
const allDeposits = movements.every(function (mov) {
  return mov > 0;
});
console.log(allDeposits);

const allWithdraws = movements.every(mov => mov < 0);
console.log(allWithdraws);

// Seperate callback function
const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));

/*-------FLAT AND FLATMAP METHODS-------*/
const arr1 = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr1.flat());

const arrDeep = [
  [1, [2, 3]],
  [4, 5, 6],
  [7, [5, [8]]],
];
console.log(arrDeep.flat());

// the flat method take as a parameter how many step deep, it should flatten
console.log(arrDeep.flat(5));

// making an array of all the movements array in all the individual account
const allAccountMovements = accounts.map(acc => acc.movements);
// and flatting it into a single array
const allAccountMovementsSingle = allAccountMovements.flat();
console.log(allAccountMovementsSingle);
// using the reduce method to get the total
const overAllTotal = allAccountMovementsSingle.reduce(
  (acc, cur) => acc + cur,
  0
);

// Chaining all the above methods
const overAllTotal2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);

console.log(overAllTotal2, overAllTotal);

// FlatMAp combines a flat and a map method into one method, but the flatMap method only go one step deeper

const overAllTotal3 = accounts.flatMap(acc => acc.movements);
console.log(overAllTotal3);

/* ------SORT METHOD ---------*/
const owners = ['Jonas', 'Smith', 'jack', 'Martha'];
console.log(owners.sort(), owners);

// sorting numbers
//in an ascending order
console.log(movements);
movements.sort((a, b) => {
  if (a > b) return 1;
  else return -1;
});
// OR
movements.sort((a, b) => a - b);
console.log(movements);

//in a decending order
movements.sort((a, b) => {
  if (a > b) return -1;
  else return 1;
});
// OR
movements.sort((a, b) => b - a);
console.log(movements);

/* -------- creating and filling arrays ---------*/
// this create an array with 7 empty space
const x = new Array(7);
const arrays = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(x);

//fill
x.fill(1, 3); // this fills the array starting from the no 3 index to the end with 1
x.fill(2, 3, 5); // this fills the array starting from the no 3 index to the number 5 index with 2
arrays.fill(16, 4, 8); //this replace the value in index 4 to 8 with 16
console.log(arrays);

//array.from
console.log(Array.from({ length: 7 }, () => 1)); //this will create an array filled with 1 as the value with the lenght of 7
console.log(Array.from({ length: 7 }, (cur, i) => i + 1)); // this creates an array of 1 to 6 by using it index

// assignment
// generating array with 100 dice rows
const randomDice = Array.from({ length: 100 }, (_, i) =>
  Math.trunc(Math.random(100) * i)
);
console.log(randomDice);

// Creating an array out of the querySelectorAll items, which is a node list
labelBalance.addEventListener('click', function () {
  const movementsUIs = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUIs.map(el => Number(el.textContent.replace('€', ''))));

  // Better way
  const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI2);
});

// practing array methods
// the sum of all the money deposited
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(tra => tra > 0)
  .reduce((acc, cur) => acc + cur, 0);

console.log(bankDepositSum);

// 2. how many deposite there have been with atleast 1000 dollars
const minDeposit = accounts
  .flatMap(acc => acc.movements)
  .filter(tra => tra >= 1000).length;

// OR
const minDeposit1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => (cur >= 1000 ? acc + 1 : acc), 0);

console.log(minDeposit, minDeposit1);

// 3.
// calculating the deposits and the withdrawals on a go using reduce to return an object
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (acc, cur) => {
      cur > 0 ? (acc.deposit += cur) : (acc.withdrawals += cur);
      return acc;
    },
    { deposit: 0, withdrawals: 0 }
  );
console.log(sums);

// 4.
// create a function that convert any string to a title case
function convertTitleCase(title) {
  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)));
  return capitalize(titleCase.join(' '));
}

console.log(
  convertTitleCase(
    'i am YouR Own forEver in earth i am an instrument for you to use'
  )
);
console.log(
  convertTitleCase(
    'and am YouR Own forEver in earth i am an instrument for you to use'
  )
);

// CODING CHALLENGE
// 1. calculate the recommended food for each dogs and attach it to each object
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Maltida'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Micheal'] },
];
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// 2.find Sarah's dog and check if its eating too much or too little
const sarahDogs = dogs.find(function (dog) {
  return dog.owners.includes('Sarah');
});
console.log(sarahDogs);
console.log(
  ` Sarah's dog is eating ${
    sarahDogs.curFood > sarahDogs.recFood ? 'too much' : 'just okay'
  }`
);

// 3.
const ownersEatTomuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTomuch);

const ownersEatToLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatToLittle);

// 4. create a string writing the names of the owners of dogs that eat too little, and too much
// 'Maltida and Alice and Bob\'s dogs eat too much!
// 'Sarah and John and Micheal\'s dogs eat too much!'

console.log(`${ownersEatTomuch.join(' and ')} dogs eat too much!`);
console.log(`${ownersEatToLittle.join(' and ')} dogs eat too little!`);

// 5.
const exactamount = dogs.some(dogs => dogs.curFood === dogs.recFood);
console.log(exactamount, dogs);

// 6 anyone eating an okay amount of food
function checkEating(dog) {
  return dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
}
const okayAmount = dogs.some(checkEating);
console.log(okayAmount);

// 7. filter out all the dogs who is eating an okay amount of food
const dogEatingOkay = dogs.filter(checkEating);
console.log(dogEatingOkay);

// 8. create a shallow array and sort it by the recommended food portion in an ascending order
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
