import SQLite from 'react-native-sqlite-storage';

let openDB = dbName => {
  var db = SQLite.openDatabase(
    {name: dbName, createFromLocation: 1},
    () => {
      // console.log(dbName + ' opened succesfully!');
    },
    err => {
      console.log('Database Error: ' + err);
    },
  );

  return db;
};

let db = openDB('order-handler-db.db');

export async function sqlQuery(query, setter, ...data) {
  await db.transaction(async tx => {
    tx.executeSql(query, [...data], (tx, results) => {
      if (setter) {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setter(temp);
      } else {
        // if (results.rowsAffected > 0) alert('Sikeres művelet');
        // else {
        //   alert('Hiba a művelet elvégzésekor');
        // }
      }
    });
  });
}
