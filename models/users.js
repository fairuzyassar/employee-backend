const dbPool = require('../config/database');

const getUserDataByUserName = async (username) => {
    try {
        const GET_USER_QUERY = `SELECT * FROM Users WHERE user_name = ?`;
        const[result] = await dbPool.execute(GET_USER_QUERY, [username]);
        return result.length == 0 ? null : result[0];
    } catch(error) {
        throw error;
    }
}

const changeUserPassword = async (data) => {
    try {
        const UPDATE_PASSWORD_QUERY = `UPDATE Users SET hashed_password = ? WHERE user_name = ?`;
        const[result] = await dbPool.execute(UPDATE_PASSWORD_QUERY, [data.hashed_password, data.user_name]);
        if (result.affectedRows == 0) {
            throw Error("user name not exist"); 
        }
    } catch (error) {
        throw error
    }
}

const registerNewEmployee = async (data) => {
    const connection = await dbPool.getConnection(); 
    try {
        console.log(data);
        await connection.beginTransaction();
        const INSERT_EMPLOYEE_QUERY = `INSERT INTO Employees (id, full_name, date_of_birth, position, department, salary) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    
        await connection.execute(INSERT_EMPLOYEE_QUERY, [
            data.id,
            data.full_name,
            data.date_of_birth,
            data.position,
            data.department,
            data.salary
        ]);
    
        const INSERT_USER_QUERY = `INSERT INTO Users (user_name, employee_id) VALUES (?, ?)`;
    
        await connection.execute(INSERT_USER_QUERY, [
            data.user_name,
            data.id
        ]);
    
        await connection.commit();  
    } catch (error) {
        await connection.rollback(); 
        throw error;
    } finally {
        connection.release();
    }
   
}

const getAllEmployee = async () => {
    try {
        const ALL_EMPLOYEE_QUERY = 'SELECT * FROM Employees';
        const[result] = await dbPool.execute(ALL_EMPLOYEE_QUERY);
        return result;  
    } catch (error) {
        throw error; 
    }  
}

const updateEmployeeData = async (data, employee_id) => {
    try {
        console.log(data.position)
        console.log(employee_id)
        const UPDATE_EMPLOYEE_QUERY = `UPDATE Employees 
        SET full_name = ?, date_of_birth = ?, position = ?, department = ?, salary = ? WHERE id = ?`;
        const[result] = await dbPool.execute(UPDATE_EMPLOYEE_QUERY, [
           data.full_name,
           data.date_of_birth,
           data.position,
           data.department,
           data.salary,
           employee_id
        ]);
        if (result.affectedRows == 0) {
            throw Error("user name not exist"); 
        }
    } catch (error) {
       throw error; 
    }
}


module.exports = {
    registerNewEmployee,
    changeUserPassword,
    getUserDataByUserName,
    getAllEmployee,
    updateEmployeeData
}