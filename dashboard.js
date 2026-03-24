// Dashboard logic for Customer features (US004/US005)
document.addEventListener('DOMContentLoaded', function() {
    // Load auth
    if (typeof auth === 'undefined') {
        const script = document.createElement('script');
        script.src = 'auth.js';
        document.head.appendChild(script);
        script.onload = initDashboard;
    } else {
        initDashboard();
    }
});

function initDashboard() {
    auth.updateNavbar();
    const user = auth.getCurrentUser();
    
    if (!auth.isLoggedIn() || user.role !== 'customer') {
        alert('Customer login required');
        window.location.href = 'index.html';
        return;
    }
    
    renderDashboard(user);
    setupEventListeners();
}

function renderDashboard(user) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <h2>Welcome back, ${user.name} 🎉</h2>
        
        <div class="account-info card">
            <h3>Account Information</h3>
            <p><strong>Account No:</strong> ${user.accountNumber}</p>
            <p><strong>Balance:</strong> ₹${user.balance.toLocaleString()}</p>
            <p><strong>IFSC:</strong> ${user.accountNumber.slice(0,4)}0${user.accountNumber.slice(-6)}</p>
            <button onclick="checkBalance()" class="btn-secondary">Refresh Balance</button>
        </div>
        
        <div class="operations">
            <div class="card">
                <h3>💸 Withdraw Money</h3>
                <p style="color: #666; font-size: 14px;">Minimum ₹1,000 | Maximum ₹100,000 | Minimum balance ₹500 after withdrawal</p>
                <div id="withdrawError" class="error" style="display: none;"></div>
                <form id="withdrawForm">
                    <input type="number" id="withdrawAmount" placeholder="Enter amount (₹1,000 - ₹100,000)" min="1000" max="100000" step="0.01" required>
                    <button type="submit">Withdraw</button>
                </form>
            </div>
            
            <div class="card">
                <h3>💰 Deposit Money</h3>
                <p><strong>Account Ref:</strong> ${user.accountNumber}</p>
                <p style="color: #666; font-size: 14px;">Minimum ₹100 | Maximum ₹500,000 per transaction</p>
                <div id="depositError" class="error" style="display: none;"></div>
                <form id="depositForm">
                    <input type="number" id="depositAmount" placeholder="Enter deposit amount (₹100 - ₹500,000)" min="100" max="500000" step="0.01" required>
                    <button type="submit">Deposit</button>
                </form>
            </div>
        </div>
        
        <div class="recent-transactions card">
            <h3>Recent Transactions</h3>
            <div id="transactionsList">${renderTransactions(auth.getUserTransactions())}</div>
        </div>
    `;
}

function setupEventListeners() {
    document.getElementById('withdrawForm').addEventListener('submit', handleWithdraw);
    document.getElementById('depositForm').addEventListener('submit', handleDeposit);
}

function handleWithdraw(e) {
    e.preventDefault();
    const amountInput = document.getElementById('withdrawAmount');
    const amount = parseFloat(amountInput.value);
    const errorDiv = document.getElementById('withdrawError');

    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    // Validation
    if (isNaN(amount) || amount <= 0) {
        errorDiv.textContent = 'Please enter a valid withdrawal amount greater than 0';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    if (amount < 1000) {
        errorDiv.textContent = 'Minimum withdrawal amount is ₹1,000';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    if (amount > 100000) {
        errorDiv.textContent = 'Maximum withdrawal amount per transaction is ₹100,000';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    // Check if amount has more than 2 decimal places
    if (!Number.isInteger(amount * 100)) {
        errorDiv.textContent = 'Amount cannot have more than 2 decimal places';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    try {
        const result = auth.withdraw(amount);
        showSuccessNotification(`✓ Withdrawal successful! New balance: ₹${result.newBalance.toLocaleString()}`);
        amountInput.value = ''; // Clear the input
        setTimeout(() => {
            renderDashboard(auth.getCurrentUser());
            setupEventListeners(); // Reattach event listeners after re-rendering
        }, 1500);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

function handleDeposit(e) {
    e.preventDefault();
    const amountInput = document.getElementById('depositAmount');
    const amount = parseFloat(amountInput.value);
    const errorDiv = document.getElementById('depositError');

    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    // Validation
    if (isNaN(amount) || amount <= 0) {
        errorDiv.textContent = 'Please enter a valid deposit amount greater than 0';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    if (amount < 100) {
        errorDiv.textContent = 'Minimum deposit amount is ₹100';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    if (amount > 500000) {
        errorDiv.textContent = 'Maximum deposit amount per transaction is ₹500,000';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    // Check if amount has more than 2 decimal places
    if (!Number.isInteger(amount * 100)) {
        errorDiv.textContent = 'Amount cannot have more than 2 decimal places';
        errorDiv.style.display = 'block';
        amountInput.focus();
        return;
    }

    try {
        const result = auth.deposit(amount);
        showSuccessNotification(`✓ Deposit successful! New balance: ₹${result.newBalance.toLocaleString()}`);
        amountInput.value = ''; // Clear the input
        setTimeout(() => {
            renderDashboard(auth.getCurrentUser());
            setupEventListeners(); // Reattach event listeners after re-rendering
        }, 1500);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

function showSuccessNotification(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.display = 'flex';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #28a745; font-size: 20px;">${message}</h2>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

function checkBalance() {
    renderDashboard(auth.getCurrentUser());
    setupEventListeners(); // Reattach event listeners after re-rendering
}

function renderTransactions(transactions) {
    if (!transactions.length) return '<p>No transactions yet.</p>';
    return transactions.slice(0,5).map(t => 
        `<div class="transaction">
            <span>${t.type.toUpperCase()}: ₹${Math.abs(t.amount).toLocaleString()} | ${new Date(t.date).toLocaleString()} | Balance: ₹${t.balance.toLocaleString()}</span>
        </div>`
    ).join('');
}

