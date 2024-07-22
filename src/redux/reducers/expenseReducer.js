import { createSlice } from "@reduxjs/toolkit"
import { addExpenseAPI, deleteExpenseAPI, editExpenseAPI } from "../actions/expenseAction";


const initialState = {
    listExpense: [],
    totalThu: 0,
    totalChi: 0
}

const total = (state) => {
    state.totalThu = 0;
    state.totalChi = 0;
    const total = state.listExpense;
    total.forEach(expense => {
        if (expense.type === "thu") {
            state.totalThu += expense.money;
        } else {
            state.totalChi += expense.money;
        }
    });

}

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        addExpense(state, action) {
            state.listExpense.push(action.payload);
        },
        setTotal(state, action) {
            if (state.totalThu == 0 && state.totalChi == 0) {
                const total = state.listExpense;
                total.forEach(expense => {
                    if (expense.type === "thu") {
                        state.totalThu += expense.money;
                    } else {
                        state.totalChi += expense.money;
                    }
                });
            } else {

            }
        }
    },
    extraReducers: builder => {
        builder.addCase(addExpenseAPI.fulfilled, (state, action) => {
            state.listExpense.push(action.payload);
            total(state);
        });
        builder.addCase(addExpenseAPI.rejected, (state, action) => {
            console.log(action.payload);
        });
        builder.addCase(deleteExpenseAPI.fulfilled, (state, action) => {
            state.listExpense = state.listExpense.filter(expense => expense.id != action.payload.id);
            total(state);
        });
        builder.addCase(deleteExpenseAPI.rejected, (state, action) => {
            console.log(action.payload);
        });
        builder.addCase(editExpenseAPI.fulfilled, (state, action) => {
            state.listExpense = state.listExpense.map(expense => expense.id === action.payload.id ? action.payload : expense);
            total(state);
        });
        builder.addCase(editExpenseAPI.rejected, (state, action) => {
            console.log(action.payload);
        })

    }
});

export const { addExpense, setTotal } = expenseSlice.actions;
export default expenseSlice.reducer;