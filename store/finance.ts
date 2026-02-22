import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategorySpending, BalanceHistoryItem, Transaction } from '@/types';

interface FinanceState {
  totalBalance: number;
  accountCount: number;
  categorySpending: CategorySpending[];
  balanceHistory: BalanceHistoryItem[];
  transactions: Transaction[];
  categories: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  totalBalance: 0,
  accountCount: 0,
  categorySpending: [],
  balanceHistory: [],
  transactions: [],
  categories: [],
  isLoading: false,
  error: null,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{ totalBalance: number; accountCount: number }>) => {
      state.totalBalance = action.payload.totalBalance;
      state.accountCount = action.payload.accountCount;
    },
    addIncome: (state, action: PayloadAction<number>) => {
      state.totalBalance += action.payload;
    },
    addExpense: (state, action: PayloadAction<number>) => {
      state.totalBalance -= action.payload;
    },
    setCategorySpending: (state, action: PayloadAction<CategorySpending[]>) => {
      state.categorySpending = action.payload;
    },
    setBalanceHistory: (state, action: PayloadAction<BalanceHistoryItem[]>) => {
      state.balanceHistory = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setCategories: (state, action: PayloadAction<any[]>) => {
      state.categories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBalance,
  addIncome,
  addExpense,
  setCategorySpending,
  setBalanceHistory,
  setTransactions,
  setCategories,
  setLoading,
  setError
} = financeSlice.actions;
export default financeSlice.reducer;
