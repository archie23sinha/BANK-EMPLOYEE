// Authentication System for ASP Bank
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check for existing session
        const session = localStorage.getItem('asp_bank_session');
        if (session) {
            try {
                this.currentUser = JSON.parse(session);
                this.updateNavbar();
            } catch (e) {
                localStorage.removeItem('asp_bank_session');
            }
        }
    }

    // Simple hash function for basic security
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Register a new customer
    registerCustomer(customerData) {
        const customers = this.getCustomers();
        const existingCustomer = customers.find(c => c.email === customerData.email);

        if (existingCustomer) {
            throw new Error('Email already registered');
        }

        const newCustomer = {
            id: Date.now().toString(),
            ...customerData,
            password: this.hashPassword(customerData.password),
            accountNumber: this.generateAccountNumber(),
            balance: 0,
            role: 'customer',
            createdAt: new Date().toISOString(),
            transactions: []
        };

        customers.push(newCustomer);
        localStorage.setItem('asp_bank_customers', JSON.stringify(customers));

        return newCustomer;
    }



    // Register a new employee
    registerEmployee(employeeData) {
        const employees = this.getEmployees();
        const existingEmployee = employees.find(e => e.email === employeeData.email);

        if (existingEmployee) {
            throw new Error('Email already registered');
        }

        const newEmployee = {
            id: Date.now().toString(),
            ...employeeData,
            password: this.hashPassword(employeeData.password),
            employeeId: this.generateEmployeeId(),
            role: 'employee',
            createdAt: new Date().toISOString()
        };

        employees.push(newEmployee);
        localStorage.setItem('asp_bank_employees', JSON.stringify(employees));

        return newEmployee;
    }

    // Login user (customer or employee)
    login(email, password, userType = 'customer') {
        const hashedPassword = this.hashPassword(password);

        if (userType === 'customer') {
            const customers = this.getCustomers();
            const customer = customers.find(c => c.email === email && c.password === hashedPassword);

            if (customer) {
                this.currentUser = { ...customer, role: 'customer' };
                localStorage.setItem('asp_bank_session', JSON.stringify(this.currentUser));
                this.updateNavbar();
                return { success: true, user: this.currentUser };
            }
        } else if (userType === 'employee') {
            const employees = this.getEmployees();
            const employee = employees.find(e => e.email === email && e.password === hashedPassword);

            if (employee) {
                this.currentUser = { ...employee, role: 'employee' };
                localStorage.setItem('asp_bank_session', JSON.stringify(this.currentUser));
                this.updateNavbar();
                return { success: true, user: this.currentUser };
            }
        }

        throw new Error('Invalid email or password');
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('asp_bank_session');
        this.updateNavbar();
        window.location.href = 'index.html';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Update navbar based on auth status
    updateNavbar() {
        const navbars = document.querySelectorAll('.navbar');
        navbars.forEach(navbar => {
            const navLinks = navbar.querySelector('.nav-links');
            if (!navLinks) return;

            // Clear existing dynamic links
            const existingLogout = navbar.querySelector('.logout-btn');

            if (existingLogout) existingLogout.remove();

            if (this.currentUser) {
                // Add logout button only
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'logout-btn';
                logoutBtn.innerHTML = 'Logout';
                logoutBtn.onclick = () => this.logout();

                navLinks.appendChild(logoutBtn);
            }
        });
    }

    // Get all customers
    getCustomers() {
        const customers = localStorage.getItem('asp_bank_customers');
        return customers ? JSON.parse(customers) : [];
    }

    // Get all employees
    getEmployees() {
        const employees = localStorage.getItem('asp_bank_employees');
        return employees ? JSON.parse(employees) : [];
    }



    // Generate account number
    generateAccountNumber() {
        return 'ASP' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    }

    // Generate employee ID
    generateEmployeeId() {
        return 'EMP' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    }



    // Transfer money between accounts
    transferMoney(fromAccount, toAccount, amount, description = '') {
        if (!this.currentUser || this.currentUser.accountNumber !== fromAccount) {
            throw new Error('Unauthorized transfer');
        }

        if (this.currentUser.balance < amount) {
            throw new Error('Insufficient balance');
        }

        const customers = this.getCustomers();
        const fromUser = customers.find(c => c.accountNumber === fromAccount);
        const toUser = customers.find(c => c.accountNumber === toAccount);

        if (!fromUser || !toUser) {
            throw new Error('Invalid account number');
        }

        // Update balances
        fromUser.balance -= amount;
        toUser.balance += amount;

        // Add transactions
        const transaction = {
            id: Date.now().toString(),
            type: 'transfer',
            amount: -amount,
            description: `Transfer to ${toUser.name} (${toAccount})`,
            date: new Date().toISOString(),
            balance: fromUser.balance
        };

        const recipientTransaction = {
            id: Date.now().toString() + 'r',
            type: 'transfer',
            amount: amount,
            description: `Transfer from ${fromUser.name} (${fromAccount})`,
            date: new Date().toISOString(),
            balance: toUser.balance
        };

        fromUser.transactions.unshift(transaction);
        toUser.transactions.unshift(recipientTransaction);

        // Update current user session
        if (this.currentUser.id === fromUser.id) {
            this.currentUser = fromUser;
            localStorage.setItem('asp_bank_session', JSON.stringify(this.currentUser));
        }

        localStorage.setItem('asp_bank_customers', JSON.stringify(customers));

        return transaction;
    }

    // Withdraw money from own account
    withdraw(amount) {
        if (!this.currentUser) {
            throw new Error('Not logged in');
        }
        if (!Number.isFinite(amount) || amount < 1000) {
            throw new Error('Minimum withdrawal amount is 1000');
        }
        const newBalance = this.currentUser.balance - amount;
        if (newBalance < 500) {
            throw new Error('Minimum balance should be 500');
        }
        
        const customers = this.getCustomers();
        const userIndex = customers.findIndex(c => c.id === this.currentUser.id);
        if (userIndex === -1) throw new Error('User not found');
        
        customers[userIndex].balance = newBalance;
        const transaction = {
            id: Date.now().toString(),
            type: 'withdraw',
            amount: -amount,
            description: 'Cash withdrawal',
            date: new Date().toISOString(),
            balance: newBalance
        };
        customers[userIndex].transactions.unshift(transaction);
        
        localStorage.setItem('asp_bank_customers', JSON.stringify(customers));
        this.currentUser = customers[userIndex];
        localStorage.setItem('asp_bank_session', JSON.stringify(this.currentUser));
        
        return { success: true, newBalance, transaction };
    }
    
    // Deposit money to own account
    deposit(amount) {
        if (!this.currentUser) {
            throw new Error('Not logged in');
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }
        
        const customers = this.getCustomers();
        const userIndex = customers.findIndex(c => c.id === this.currentUser.id);
        if (userIndex === -1) throw new Error('User not found');
        
        customers[userIndex].balance += amount;
        const newBalance = customers[userIndex].balance;
        const transaction = {
            id: Date.now().toString(),
            type: 'deposit',
            amount: amount,
            description: `Cash deposit (Ref: ${this.currentUser.accountNumber})`,
            date: new Date().toISOString(),
            balance: newBalance
        };
        customers[userIndex].transactions.unshift(transaction);
        
        localStorage.setItem('asp_bank_customers', JSON.stringify(customers));
        this.currentUser = customers[userIndex];
        localStorage.setItem('asp_bank_session', JSON.stringify(this.currentUser));
        
        return { success: true, newBalance, transaction };
    }

    // Get user transactions
    getUserTransactions() {
        if (!this.currentUser) return [];
        return this.currentUser.transactions || [];
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) throw new Error('Not logged in');

        const customers = this.getCustomers();
        const userIndex = customers.findIndex(c => c.id === this.currentUser.id);

        if (userIndex === -1) throw new Error('User not found');

        customers[userIndex] = { ...customers[userIndex], ...updates };
        this.currentUser = customers[userIndex];

        localStorage.setItem('asp_bank_customers', JSON.stringify(customers));
        localStorage.setItem('asp_bank_session', JSON.stringify(this.currentUser));

        return this.currentUser;
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(message) {
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    alert(message);
}

// Export for use in other files
window.AuthSystem = AuthSystem;
window.auth = auth;