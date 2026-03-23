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
                <h3>💸 Withdraw Money (Min ₹1000)</h3>
                <p style="color: #666; font-size: 14px;">Minimum balance should be 500 after withdrawal</p>
                <div id="withdrawError" class="error" style="display: none;"></div>
                <form id="withdrawForm">
                    <input type="number" id="withdrawAmount" placeholder="Enter amount (min 1000)" min="1000" required>
                    <button type="submit">Withdraw</button>
                </form>
            </div>
            
            <div class="card">
                <h3>💰 Deposit Money</h3>
                <p><strong>Account Ref:</strong> ${user.accountNumber}</p>
                <div id="depositError" class="error" style="display: none;"></div>
                <form id="depositForm">
                    <input type="number" id="depositAmount" placeholder="Enter deposit amount" min="1" required>
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
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const errorDiv = document.getElementById('withdrawError');
    
    try {
        errorDiv.style.display = 'none';
        const result = auth.withdraw(amount);
        showSuccessNotification(`✓ Withdrawal successful! New balance: ₹${result.newBalance.toLocaleString()}`);
        setTimeout(() => {
            renderDashboard(auth.getCurrentUser());
        }, 1500);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

function handleDeposit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const errorDiv = document.getElementById('depositError');
    
    try {
        errorDiv.style.display = 'none';
        const result = auth.deposit(amount);
        showSuccessNotification(`✓ Deposit successful! New balance: ₹${result.newBalance.toLocaleString()}`);
        setTimeout(() => {
            renderDashboard(auth.getCurrentUser());
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
}

function renderTransactions(transactions) {
    if (!transactions.length) return '<p>No transactions yet.</p>';
    return transactions.slice(0,5).map(t => 
        `<div class="transaction">
            <span>${t.type.toUpperCase()}: ₹${Math.abs(t.amount).toLocaleString()} | ${new Date(t.date).toLocaleString()} | Balance: ₹${t.balance.toLocaleString()}</span>
        </div>`
    ).join('');
}

