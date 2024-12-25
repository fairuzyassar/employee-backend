const dbPool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const submitAttendance = async (data) => {
    const connection = await dbPool.getConnection(); 
    try {
        connection.beginTransaction();

        const attendance_id = uuidv4();
        console.log(attendance_id)
        const SUBMIT_TIME_CHECKIN = `INSERT Attendances (id, employee_id, check_in_timestamp) VALUES (?, ?, ?)`;
        await connection.execute(SUBMIT_TIME_CHECKIN, [
           attendance_id,
           data.employee_id,
           data.check_in_timestamp 
        ]);

        const SUBMIT_PROOF = `INSERT AttendanceProofs (id, attendace_id, file_path) VALUES (?, ?, ?)`
        await connection.execute(SUBMIT_PROOF, [
            uuidv4(),
            attendance_id,
            data.file_path
        ]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release()
    }
}

module.exports = {
    submitAttendance
}