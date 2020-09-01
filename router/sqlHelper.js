/**
 * Created by Administrator on 2020/8/25 0025.
 */
const mysql = require("mysql");
function dbHelper(sql,param,callback){
    const conn = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        post:3306,
        database:"shop"
    });
    conn.connect();
    conn.query(sql,param,callback);
    conn.end();
}

module .exports = {
    query:dbHelper
};