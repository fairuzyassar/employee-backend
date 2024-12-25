const firebase = require('../middleware/firebase');
const AttendancesModel = require('../models/atttendance');
const UsersModel = require('../models/users');

const submitAttendance = async (req, res) => {
    try {
        const { checkInTimestamp } = req.body;
        const user = await UsersModel.getUserDataByUserName(req.user.username);
        if (user === null) {
            res.status(500).send({ error: "User not found", details: error.message });  
        }
  
        const bucket = firebase.storage().bucket();
        const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        await new Promise((resolve, reject) => {
            const stream = file.createWriteStream();
            stream.on('error', reject);
            stream.on('finish', resolve);
            stream.end(req.file.buffer);
          });

        const [metadata] = await file.getMetadata();

        const data = {
            employee_id: user.employee_id,
            file_path: `${metadata.bucket}/${metadata.name}`,
            check_in_timestamp: checkInTimestamp
        }

        await AttendancesModel.submitAttendance(data);

        res.send({
            message: "File uploaded successfully!",
            path: metadata.name,
            bucket: metadata.bucket,
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to upload file", details: error.message });
    }
}

module.exports = {
    submitAttendance
}