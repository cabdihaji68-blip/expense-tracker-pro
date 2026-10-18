const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const netBalanceEl = document.getElementById('net-balance');
const transactionList = document.getElementById('transaction-list');

const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const clearAllBtn = document.getElementById('clear-all');

// Kaydinta xogta Local Storage
let transactions = JSON.parse(localStorage.getItem('expense_tracker_elite')) || [];

dateInput.valueAsDate = new Date();

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);

    // Xeerka xisaabinta: Kana diid lacag eber ah ama tiro taban (Validation)
    if (amount <= 0 || isNaN(amount)) {
        alert('Fadlan geli lacag sax ah oo ka weyn 0!');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        description: descriptionInput.value.trim(),
        amount: amount,
        type: typeInput.value,
        category: categoryInput.value.trim(),
        date: dateInput.value
    };

    transactions.push(newTransaction);
    updateLocalStorage();
    init();
    
    descriptionInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
    dateInput.valueAsDate = new Date();
});

function removeTransaction(id) {
    transactions = transactions.filter(txn => txn.id !== id);
    updateLocalStorage();
    init();
}

clearAllBtn.addEventListener('click', function() {
    if (confirm('Ma hubtaa inaad tirtirto dhammaan diiwaannada?')) {
        transactions = [];
        updateLocalStorage();
        init();
    }
});

function updateValues() {
    const incomes = transactions
        .filter(txn => txn.type === 'income')
        .reduce((acc, txn) => acc + txn.amount, 0);

    const expenses = transactions
        .filter(txn => txn.type === 'expense')
        .reduce((acc, txn) => acc + txn.amount, 0);

    // Xeerka xisaabinta: Balance = Total Income - Total Expenses
    const balance = incomes - expenses;

    totalIncomeEl.innerText = `$${incomes.toFixed(2)}`;
    totalExpenseEl.innerText = `$${expenses.toFixed(2)}`;
    netBalanceEl.innerText = `$${balance.toFixed(2)}`;
}

function renderTransactions() {
    transactionList.innerHTML = '';

    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterType.value;

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.description.toLowerCase().includes(searchTerm) || txn.category.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' || txn.type === filterValue;
        return matchesSearch && matchesFilter;
    });

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `<p style="text-align:center; color:#94a3b8; padding:20px; font-size:13px;">Ma jiraan diiwaanno la helay.</p>`;
        return;
    }

    filteredTransactions.forEach(txn => {
        const li = document.createElement('li');
        li.classList.add(txn.type);

        const sign = txn.type === 'income' ? '+' : '-';
        const textClass = txn.type === 'income' ? 'income-text' : 'expense-text';

        li.innerHTML = `
            <div class="item-details">
                <strong>${txn.description}</strong>
                <small><i class="fa-solid fa-tag"></i> ${txn.category} &bull; <i class="fa-regular fa-calendar"></i> ${txn.date}</small>
            </div>
            <div class="item-right">
                <span class="${textClass}">${sign}$${txn.amount.toFixed(2)}</span>
                <button class="btn-delete" onclick="removeTransaction(${txn.id})" title="Tirtir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        transactionList.appendChild(li);
    });
}

function updateLocalStorage() {
    localStorage.setItem('expense_tracker_elite', JSON.stringify(transactions));
}

function init() {
    renderTransactions();
    updateValues();
}

searchInput.addEventListener('input', renderTransactions);
filterType.addEventListener('change', renderTransactions);

init();