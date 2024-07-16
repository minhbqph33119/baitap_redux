import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, deleteExpense, updateExpense } from '../redux/reducers/expenseReducer';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ExpenseScreen = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("");
    const [money, setMoney] = useState("");

    const [idEdit, setIdEdit] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editType, setEditType] = useState("");
    const [editMoney, setEditMoney] = useState("");

    const [error, setError] = useState("");
    const [dateError, setDateError] = useState("");

    const [totalThu, setTotalThu] = useState(0);
    const [totalChi, setTotalChi] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");

    const listExpense = useSelector(state => state.expense.listExpense);
    const dispatch = useDispatch();

    useEffect(() => {
        TotalMoney();
    }, [listExpense]);

    const TotalMoney = () => {
        let totalThuAmount = 0;
        let totalChiAmount = 0;

        listExpense.forEach(expense => {
            if (expense.type === "thu") {
                totalThuAmount += parseFloat(expense.money);
            } else if (expense.type === "chi") {
                totalChiAmount += parseFloat(expense.money);
            }
        });

        setTotalThu(totalThuAmount);
        setTotalChi(totalChiAmount);
    };

    const isValidDate = (dateString) => {
        const pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!pattern.test(dateString)) return false;

        const [day, month, year] = dateString.split('/');
        const dateObject = new Date(year, month - 1, day);

        return (
            dateObject.getFullYear() === parseInt(year) &&
            dateObject.getMonth() === parseInt(month) - 1 &&
            dateObject.getDate() === parseInt(day)
        );
    };

    const isNumeric = (value) => {
        return /^-?\d+\.?\d*$/.test(value);
    };


    const handleAdd = () => {
        if (!title.trim() || !description.trim() || !date.trim() || !type.trim() || !money.trim()) {
            setError("Không được để trống");
            return;
        }

        if (type !== "thu" && type !== "chi") {
            setError('Loại chỉ được nhập "thu" hoặc "chi"');
            return;
        }

        if (!isValidDate(date)) {
            setDateError("Ngày không hợp lệ");
            return;
        }

        if (!isNumeric(money)) {
            setError("Số tiền phải là số");
            return;
        }

        let newExpense = {
            id: Math.random().toString(),
            title: title,
            description: description,
            date: date,
            type: type,
            money: money
        };
        dispatch(addExpense(newExpense));
        setTitle('');
        setDescription('');
        setDate('');
        setType('');
        setMoney('');
        setError('');
        setDateError('');
    };


    const handleDelete = (id) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa không ?",
            [
                {
                    text: 'Hủy',
                    onPress: () => { }
                },
                {
                    text: 'Xác nhận',
                    onPress: () => { dispatch(deleteExpense(id)); }
                }
            ]
        )

    };

    const handleEdit = (id, title, description, date, type, money) => {
        setIdEdit(id);
        setEditTitle(title);
        setEditDescription(description);
        setEditDate(date);
        setEditType(type);
        setEditMoney(money);
    };

    const handleUpdate = () => {
        if (editTitle.trim() !== '' && editDescription.trim() !== '' && editDate.trim() !== '' && editType.trim() !== '' && editMoney.trim() !== '') {
            if (editType !== "thu" && editType !== "chi") {
                setError('Loại chỉ được nhập "thu" hoặc "chi"');
                return;
            }

            if (!isValidDate(editDate)) {
                setDateError("Ngày không hợp lệ");
                return;
            }

            if (!isNumeric(editMoney)) {
                setError("Số tiền phải là số");
                return;
            }

            dispatch(updateExpense({ id: idEdit, title: editTitle, description: editDescription, date: editDate, type: editType, money: editMoney }));
            setIdEdit(null);
            setEditTitle('');
            setEditDescription('');
            setEditDate('');
            setEditType('');
            setEditMoney('');
            setError('');
            setDateError('');
        } else {
            setError("Không được để trống");
        }
    };


    const filteredExpenses = listExpense.filter(expense =>
        expense.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView style={{ flex: 1 }}>
            <Text style={styles.title}>Quản lý chi tiêu</Text>
            <TextInput style={styles.input} placeholder='Tiêu đề' value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder='Mô tả' value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder='Ngày' value={date} onChangeText={setDate} />
            <TextInput style={styles.input} placeholder='Loại' value={type} onChangeText={setType} />
            <TextInput style={styles.input} placeholder='Số tiền' value={money} onChangeText={setMoney} />
            {dateError ? <Text style={styles.error}>{dateError}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={handleAdd} style={styles.button}>
                <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={styles.totalText}>Tổng số tiền thu: {totalThu}</Text>
                <Text style={styles.totalText}> | </Text>
                <Text style={styles.totalText}>Tổng số tiền chi: {totalChi}</Text>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm theo tiêu đề"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {filteredExpenses.map(row => (
                <View key={row.id} style={styles.expenseContainer}>
                    {
                        (idEdit === row.id) ?
                            (<>
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Text style={styles.textt}>Tiêu đề: </Text>
                                        <TextInput
                                            style={styles.edittinput}
                                            value={editTitle}
                                            onChangeText={setEditTitle}
                                            placeholder='Tiêu đề'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Text style={styles.textt}>Mô tả: </Text>
                                        <TextInput
                                            style={styles.edittinput}
                                            value={editDescription}
                                            onChangeText={setEditDescription}
                                            placeholder='Mô tả'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Text style={styles.textt}>Ngày: </Text>
                                        <TextInput
                                            style={styles.edittinput}
                                            value={editDate}
                                            onChangeText={setEditDate}
                                            placeholder='Ngày'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Text style={styles.textt}>Loại: </Text>
                                        <TextInput
                                            style={styles.edittinput}
                                            value={editType}
                                            onChangeText={setEditType}
                                            placeholder='Loại'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Text style={styles.textt}>Số tiền: </Text>
                                        <TextInput
                                            style={styles.edittinput}
                                            value={editMoney}
                                            onChangeText={setEditMoney}
                                            placeholder='Số tiền'
                                        />
                                    </View>
                                    <Button title="Update" onPress={handleUpdate} />
                                </View>
                            </>) :
                            (<>
                                <Text style={{ fontSize: 30, color: '#ffffff', fontWeight: 'bold', alignSelf: 'center' }}>{row.title}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>Mô tả: {row.description}</Text>
                                        <Text style={styles.text}>Ngày: {row.date}</Text>
                                        <Text style={styles.text}>Loại: {row.type}</Text>
                                        <Text style={styles.text}>Số tiền: {row.money}</Text>
                                    </View>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => handleDelete(row.id)}>
                                            <AntDesign name="delete" size={30} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleEdit(row.id, row.title, row.description, row.date, row.type, row.money)}>
                                            <AntDesign name="edit" size={30} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>)
                    }

                </View>
            ))}
        </ScrollView>
    );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
    title: {
        padding: 20,
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#00C8FF',
    },
    input: {
        marginVertical: 5,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 20,
    },
    button: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 20,
        width: '40%',
        alignSelf: 'center',
        backgroundColor: '#00C8FF',
    },
    buttonText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    expenseContainer: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: '#0BC7F1',
        padding: 20,
        borderRadius: 20,
        margin: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    text: {
        alignSelf: 'start',
        marginBottom: 5,
        fontSize: 15,
        fontWeight: 'bold'
    },
    iconContainer: {
        flexDirection: 'column',
    },
    totalText: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    searchInput: {
        marginVertical: 5,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 20,
    },
    edittinput: {
        padding: 10,
        width: 250,
        height: 40,
        borderRadius: 20,
        borderWidth: 1
    },
    textt: {
        width: 80,
        alignSelf: 'center',
        marginBottom: 5,
        fontSize: 15,
        fontWeight: 'bold'
    }
});
