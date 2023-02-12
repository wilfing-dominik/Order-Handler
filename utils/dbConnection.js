import SQLite from 'react-native-sqlite-storage';

let openDatabase = dbName => {
  var db = SQLite.openDatabase(
    {name: dbName, createFromLocation: 1},
    () => {
      console.log(dbName + ' opened succesfully!');
    },
    err => {
      console.log('Database Error: ' + err);
    },
  );

  return db;
};

export const sqlQuery = (query, setter, ...data) => {
  let db = openDatabase('order-handler-db.db');

  db.transaction(tx => {
    tx.executeSql(query, [...data], (tx, results) => {
      if (setter) {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setter(temp);
      } else {
        if (results.rowsAffected > 0) {
          return 1;
        } else return -1;
      }
    });
  });
};
