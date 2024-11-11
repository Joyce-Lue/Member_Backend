var mysql  = require('mysql');

exports.exec = (sql,data,callback) => {
    const connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'member'
    });
    connection.connect();

    connection.query(sql,data,function(error,results,fields){
        if(error) {
            console.log(error)
        };
        callback(results, fields);
    })
    connection.end();
}