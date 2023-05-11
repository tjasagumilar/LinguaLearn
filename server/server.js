const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:'',
    database: 'lingualearn'
})

app.get('/test', (req,res) => {
    const sql = "SELECT * from TEST";
    db.query(sql, (err, data) => {
        if(err) return json(err);
        return res.json(data);
    })
})

app.get('/', (req, res) => {
    return res.json("Backend")
})

app.listen(5000, () => {console.log("Listening on port 5000") })