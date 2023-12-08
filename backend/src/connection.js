import mysql from 'mysql2';

export default {
  connect: () => {
  const connection = mysql.createConnection({
    host: 'localhost', // 資料庫主機名稱
    port: 3308,
    user: 'root', // 資料庫使用者名稱
    password: '', // 資料庫密碼
    database: 'avm_little_knife', // 資料庫名稱
    // database:"AVM"
  });

// 測試連線
connection.connect((error) => {
    if (error) {
        console.error('Cannot connet to MySQL', error);
    } else {
        console.log('Connected to MySQL');
    }
});

}
}
