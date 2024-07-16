import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    listExpense: []
}

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        addExpense(state, action) {
            state.listExpense.push(action.payload);
        },
        deleteExpense(state, action) {
            state.listExpense = state.listExpense.filter(row => row.id !== action.payload);
        },
        updateExpense(state, action) {
            const { id, title, description, date, type, money } = action.payload;
            const expense = state.listExpense.find(row => row.id === id);
            if (expense) {
                expense.title = title,
                    expense.description = description,
                    expense.date = date,
                    expense.type = type,
                    expense.money = money;
            }
        }
    }
});

export const { addExpense, deleteExpense, updateExpense } = expenseSlice.actions;
export default expenseSlice.reducer;