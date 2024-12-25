const UserModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const refreshToken = async (req, res) => {
    try {
        const accessToken = jwt.sign(accessPayload, process.env.TOKEN_SECRET_KEY, {expiresIn: '12h'});

        const refreshPayload = {
            username: userData.user_name
        }
        const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '2d'});
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ accessToken: accessToken });  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
   
}

const authenticateUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ "message": "Password / Username require"});
    }

    const userData = await UserModel.getUserDataByUserName(username);
    if (userData === null) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(400).json({ "message": "User not found"});
    }
    

    const isPasswordValid = await bcrypt.compare(password, userData.hashed_password);
    if (isPasswordValid) {
        const accessPayload = {
            username: userData.user_name,
            role: []
        };
        const accessToken = jwt.sign(accessPayload, process.env.TOKEN_SECRET_KEY, {expiresIn: '12h'});

        const refreshPayload = {
            username: userData.user_name
        }
        const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '2d'});
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken: accessToken });
    } else {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(403).json({ 'message': 'Not Authorize user' })
    }

}
const registerNewEmployee = async (req, res) => {
    const {body} = req;

    try {
        const data = {
            id: uuidv4(),
            ...body
    
        };
        await UserModel.registerNewEmployee(data);
        return res.status(201).json({message: "Success add new user"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

const updatePassword = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ "message": "Password / Username require"});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
            user_name: username,
            hashed_password: hashedPassword
        };
        console.log(data)
        await UserModel.changeUserPassword(data); 
        res.status(201).json({ message: "Password successfully change"});
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message});
    }
}

const getEmployees = async (req, res) => {
    try {
        const result = await UserModel.getAllEmployee();
        res.status(200).json({result: result});
    } catch (error) {
        return res.status(400).json({ message: error.message}); 
    }
}

const updateEmployee = async (req, res) => {
    try {
        const username = req.user.username;
        const body = req.body;
        const userData = await UserModel.getUserDataByUserName(username);
        if (!userData) {
            res.status(400).json({ message: "User not found"});
        }

        const data =  {
            full_name: body.full_name,
            date_of_birth: body.date_of_birth,
            position: body.position,
            department: body.department,
            salary: body.salary
        }

        await UserModel.updateEmployeeData(data, userData.employee_id);
        res.status(201).json({ message: "Employee data successfully change"});
    } catch (error) {
       res.status(500).json({ message: error.message }) 
    }
}

module.exports = {
    refreshToken,
    registerNewEmployee,
    updatePassword,
    authenticateUser,
    getEmployees,
    updateEmployee
}