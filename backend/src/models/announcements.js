
const db = require('../db/database');

const getAllAnnouncements = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM announcements ORDER BY created_at DESC', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const createAnnouncement = (title, content, created_by) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)';
        db.query(sql, [title, content, created_by], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, title, content, created_by });
        });
    });
};

module.exports = {
    getAllAnnouncements,
    createAnnouncement
};
