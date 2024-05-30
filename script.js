document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const expenseList = document.getElementById('expense-list');
    const expenseIdInput = document.getElementById('expense-id');
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const renderExpenses = () => {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.description}: $${expense.amount}</span>
                <button class="edit" data-id="${expense.id}">Edit</button>
                <button class="delete" data-id="${expense.id}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    };

    const addExpense = (description, amount) => {
        const expense = {
            id: Date.now().toString(),
            description,
            amount
        };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    };

    const editExpense = (id, newDescription, newAmount) => {
        expenses = expenses.map(expense => 
            expense.id === id ? { ...expense, description: newDescription, amount: newAmount } : expense
        );
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    };

    const deleteExpense = (id) => {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    };

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const id = expenseIdInput.value.trim();
        
        if (id) {
            editExpense(id, description, amount);
            expenseIdInput.value = '';
        } else {
            addExpense(description, amount);
        }
        
        descriptionInput.value = '';
        amountInput.value = '';
    });

    expenseList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const id = e.target.dataset.id;
            const expense = expenses.find(expense => expense.id === id);
            if (expense) {
                descriptionInput.value = expense.description;
                amountInput.value = expense.amount;
                expenseIdInput.value = expense.id;
            }
        }

        if (e.target.classList.contains('delete')) {
            const id = e.target.dataset.id;
            deleteExpense(id);
        }
    });

    renderExpenses();
});
