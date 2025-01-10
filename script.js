const expenseName = document.querySelector("#expenseText");
const expenseDate = document.querySelector("#expenseDate");
const expenseAmount = document.querySelector("#expenseAmount");
const form = document.querySelector("[data-expense-form]");
const expenseBtn = document.querySelector("[data-add-expense]");
const tbody = document.querySelector("[data-tbody]");
const template = document.querySelector("[data-expense-template]")
const noExpense = document.querySelector("[data-no-expense]")
const errMsg = document.querySelector("#errMsg");
const table = document.querySelector("table");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const expenseText = expenseName.value.replace(/[ \t]{2,}/g, ' ').trim();
  const date = isValidDate(expenseDate.value);
  if(expenseText && date && expenseAmount.value > 0) {
    addExpenseItem(expenseText, expenseDate.value, expenseAmount.value);
    saveExpense();
  } else {
    if(errMsg.classList.contains("none")){
      errMsg.classList.remove("none");
    }     
    return;
  }
  if(!errMsg.classList.contains("none"))
    errMsg.classList.add("none");

  form.reset();
});

function isValidDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  return date instanceof Date && !isNaN(date) && year <= currentYear && year >= 1950; 
}


const addExpenseItem = (eName, date, amount) => {
  if(!noExpense.classList.contains("none")){
    noExpense.classList.add("none");
  }
  const expenseClone = template.content.cloneNode(true);
  expenseClone.querySelector("[data-expense-name]").textContent = eName;
  expenseClone.querySelector("[data-expense-date]").textContent = date;
  expenseClone.querySelector("[data-expense-amount]").textContent = `$${amount}`
  tbody.append(expenseClone);
}

tbody.addEventListener("click", e => {
  if(e.target.matches("i")){
    e.target.parentElement.parentElement.parentElement.remove();
  }
  if(tbody.children.length === 1) {
    if(noExpense.classList.contains("none")){
      noExpense.classList.remove("none");
    }
  }
  saveExpense()
});


const saveExpense = () => {
  const expenseList =  Array.from(tbody.children).filter((_, index) => index !== 0);
  if(expenseList.length > 0) {
      const expenseStore =  expenseList.map((expense) => {
      return {
        name: expense.querySelector("[data-expense-name]").textContent,
        date: expense.querySelector("[data-expense-date]").textContent,
        amount: expense.querySelector("[data-expense-amount]").textContent
      }     
    })
    localStorage.setItem("expenseList", JSON.stringify(expenseStore));
  } else {
    localStorage.setItem("expenseList", JSON.stringify([]));
  }
  
}

const loadExpense = () => {
  let expenseList = localStorage.getItem("expenseList");
  if(expenseList) {
    expenseList = JSON.parse(expenseList);
  }
  expenseList.forEach((expense) => {
    const eName = expense.name;
    const date = expense.date;
    const amount = expense.amount.slice(1);
    addExpenseItem(eName, date, amount);
  });
  
}

loadExpense();



