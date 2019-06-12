var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'thnews_admin',
        password: '123456',
        database: 'th_news'
    });
}

module.exports = {
    load: sql => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, result, fields) => {
                if (error)
                    reject(error);
                else {
                    resolve(result);
                }
                connection.end();
            });
        });
    }
};
