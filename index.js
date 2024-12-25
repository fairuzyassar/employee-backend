require('dotenv').config()
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');

const app = express();

app.use(express.json());
app.use(cors())
app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);

app.listen(4000, () => {
    console.log(`Running on port 4000`);
})