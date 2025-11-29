// Mock data for demonstration purposes
// This will be replaced with actual API calls to Strapi backend

import { Account, Category, Expense } from '@/types';

export const mockCategories: Category[] = [
    { id: '1', name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', isDefault: true },
    { id: '2', name: 'Transportation', icon: '🚗', color: '#4ECDC4', isDefault: true },
    { id: '3', name: 'Entertainment', icon: '🎬', color: '#95E1D3', isDefault: true },
    { id: '4', name: 'Shopping', icon: '🛍️', color: '#F38181', isDefault: true },
    { id: '5', name: 'Bills & Utilities', icon: '💡', color: '#AA96DA', isDefault: true },
    { id: '6', name: 'Healthcare', icon: '⚕️', color: '#FCBAD3', isDefault: true },
    { id: '7', name: 'Education', icon: '📚', color: '#A8D8EA', isDefault: true },
    { id: '8', name: 'Other', icon: '📌', color: '#C7CEEA', isDefault: true },
];

export const mockAccounts: Account[] = [
    {
        id: '1',
        userId: 'user1',
        name: 'Main Checking',
        type: 'checking',
        balance: 4250.75,
        currency: 'USD',
        createdAt: new Date('2024-01-15'),
    },
    {
        id: '2',
        userId: 'user1',
        name: 'Savings Account',
        type: 'savings',
        balance: 12500.00,
        currency: 'USD',
        createdAt: new Date('2024-01-15'),
    },
    {
        id: '3',
        userId: 'user1',
        name: 'Credit Card',
        type: 'credit_card',
        balance: -850.50,
        currency: 'USD',
        createdAt: new Date('2024-02-01'),
    },
    {
        id: '4',
        userId: 'user1',
        name: 'Cash Wallet',
        type: 'cash',
        balance: 320.00,
        currency: 'USD',
        createdAt: new Date('2024-01-15'),
    },
];

export const mockExpenses: Expense[] = [
    {
        id: '1',
        userId: 'user1',
        accountId: '1',
        amount: 45.50,
        category: 'Food & Dining',
        date: new Date('2024-11-29'),
        notes: 'Lunch at Italian restaurant',
        createdAt: new Date('2024-11-29'),
    },
    {
        id: '2',
        userId: 'user1',
        accountId: '1',
        amount: 120.00,
        category: 'Shopping',
        date: new Date('2024-11-28'),
        notes: 'New shoes',
        createdAt: new Date('2024-11-28'),
    },
    {
        id: '3',
        userId: 'user1',
        accountId: '3',
        amount: 85.00,
        category: 'Bills & Utilities',
        date: new Date('2024-11-27'),
        notes: 'Internet bill',
        createdAt: new Date('2024-11-27'),
    },
    {
        id: '4',
        userId: 'user1',
        accountId: '1',
        amount: 32.75,
        category: 'Transportation',
        date: new Date('2024-11-27'),
        notes: 'Gas station',
        createdAt: new Date('2024-11-27'),
    },
    {
        id: '5',
        userId: 'user1',
        accountId: '4',
        amount: 15.00,
        category: 'Food & Dining',
        date: new Date('2024-11-26'),
        notes: 'Coffee shop',
        createdAt: new Date('2024-11-26'),
    },
    {
        id: '6',
        userId: 'user1',
        accountId: '1',
        amount: 250.00,
        category: 'Healthcare',
        date: new Date('2024-11-25'),
        notes: 'Doctor visit',
        createdAt: new Date('2024-11-25'),
    },
    {
        id: '7',
        userId: 'user1',
        accountId: '1',
        amount: 65.00,
        category: 'Entertainment',
        date: new Date('2024-11-24'),
        notes: 'Movie tickets and snacks',
        createdAt: new Date('2024-11-24'),
    },
    {
        id: '8',
        userId: 'user1',
        accountId: '1',
        amount: 180.00,
        category: 'Food & Dining',
        date: new Date('2024-11-23'),
        notes: 'Grocery shopping',
        createdAt: new Date('2024-11-23'),
    },
    {
        id: '9',
        userId: 'user1',
        accountId: '3',
        amount: 45.00,
        category: 'Transportation',
        date: new Date('2024-11-22'),
        notes: 'Uber rides',
        createdAt: new Date('2024-11-22'),
    },
    {
        id: '10',
        userId: 'user1',
        accountId: '1',
        amount: 95.00,
        category: 'Shopping',
        date: new Date('2024-11-21'),
        notes: 'Clothing',
        createdAt: new Date('2024-11-21'),
    },
];

// Helper function to calculate total balance
export const getTotalBalance = (): number => {
    return mockAccounts.reduce((total, account) => total + account.balance, 0);
};

// Helper function to get recent expenses
export const getRecentExpenses = (limit: number = 5): Expense[] => {
    return [...mockExpenses]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit);
};

// Helper function to get category spending for current month
export const getCategorySpending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter expenses for current month
    const monthExpenses = mockExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Group by category
    const categoryTotals = monthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    // Calculate total for percentages
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    // Map to CategorySpending with colors from mockCategories
    return Object.entries(categoryTotals).map(([category, amount]) => {
        const categoryData = mockCategories.find(c => c.name === category);
        return {
            category,
            amount,
            color: categoryData?.color || '#999999',
            percentage: total > 0 ? (amount / total) * 100 : 0,
        };
    });
};
