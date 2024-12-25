const express = require('express');
const userController = require('../controller/userController');
const authVerify = require('../middleware/auth');

const router = express.Router()

router.post('/register', authVerify.checkAuthorization,  userController.registerNewEmployee);
router.patch('/change-password', userController.updatePassword);
router.post('/login', userController.authenticateUser);
router.post('/refresh-token', authVerify.checkRefreshAuthorization, userController.refreshToken);
router.get('/', authVerify.checkAuthorization, userController.getEmployees);
router.patch('/update-data', authVerify.checkAuthorization, userController.updateEmployee);

module.exports = router;