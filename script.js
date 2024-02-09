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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

function displayMove(move) {
  containerMovements.innerHTML = '';

  move.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; //ternary operator
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}</div>
    </div>
    `; // template literal
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

/*-----USING THE REDUCE METHOD TO SHOW BALANCE-----*/
function calcDisplayBalance(movements) {
  labelBalance.textContent = `${movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0)}€`;
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
  labelSumIn.textContent = `${income}€`;

  /*----- CALCULATING THE OUTGOING TRANSACTION -----------*/
  const output = account.movements
    .filter(move => move < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(output)}€`;

  /*----- CALCULATING THE INTREST -----------*/
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = `${interest}€`;
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

/*EVENT HANDLERS*/
let currentAcccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  /*---------IMPLEMENTING LOGIN--------*/
  currentAcccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAcccount);
  if (currentAcccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAcccount.owner.split(' ')[0]
    }`;

    // Display UI
    containerApp.style.opacity = 100;

    // Display Movements
    displayMove(currentAcccount.movements);
    // Display Balance
    calcDisplayBalance(currentAcccount.movements);
    // Display Summary
    calDisplaySummary(currentAcccount);

    // Clear input field
    inputLoginPin.value = inputLoginUsername.value = '';

    // losing the focus of the input
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

/*-----SLICE------*/
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
