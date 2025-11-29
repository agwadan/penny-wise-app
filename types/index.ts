// Type definitions for Pennywise Expense Tracker
// Matches the database schema from the development plan

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit_card';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'KES';

export interface Account {
    id: string;
    userId: string;
    name: string;
    type: AccountType;
    balance: number;
    currency: Currency;
    createdAt: Date;
}

export interface Category {
    id: string;
    userId?: string;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
}

export interface Expense {
    id: string;
    userId: string;
    accountId: string;
    amount: number;
    category: string;
    date: Date;
    notes?: string;
    createdAt: Date;
}

export interface CategorySpending {
    category: string;
    amount: number;
    color: string;
    percentage: number;
}
