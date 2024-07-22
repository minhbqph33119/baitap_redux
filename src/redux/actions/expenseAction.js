import { createAsyncThunk } from "@reduxjs/toolkit";
import { addExpense, setTotal } from "../reducers/expenseReducer";


const api_url = 'http://10.0.2.2:3000/expense';

export const fetchExpense = () => {
    return async dispatch => {
        try {
            const response = await fetch(api_url);
            const data = await response.json();
            data.forEach(row => {
                dispatch(addExpense(row));
            });
            dispatch(setTotal())
        } catch (err) {
            console.log(err);
        }
    }
}

export const addExpenseAPI = createAsyncThunk(
    'expense/addExpenseAPI',
    async (obj, thunkAPI) => {
        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await response.json();
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue({ err: err.message });
        }
    }
)

export const deleteExpenseAPI = createAsyncThunk(
    'expense/deleteExpenseAPI',
    async (id, thunkAPI) => {
        try {
            const response = await fetch(`${api_url}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue({ err: err.message });
        }
    }
)

export const editExpenseAPI = createAsyncThunk(
    'expense/editExpenseAPI',
    async (obj, thunkAPI) => {
        try {
            const response = await fetch(`${api_url}/${obj.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await response.json();
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue({ err: err.message });
        }
    }
)