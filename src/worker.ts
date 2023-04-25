import sqlite3InitModule, {type DatabaseApi} from '@sqlite.org/sqlite-wasm';

console.log("start sqlite worker");

const sqlite3 = await sqlite3InitModule({
  print: console.log,
  printErr: console.error,
});


const DB_NAME = 'test.db';

let db: DatabaseApi;
if (sqlite3.opfs) {
  db = new sqlite3.oo1.OpfsDb(DB_NAME) as DatabaseApi;
  console.log('OPFS is available, created persisted database at', db.filename);
} else {
  db = new sqlite3.oo1.DB(DB_NAME, 'ct') as DatabaseApi;
}

db.exec("DROP TABLE IF EXISTS t");
db.exec('CREATE TABLE IF NOT EXISTS t(a,b)');

// insert
for (let i = 20; i < 25; ++i) {
  // debugger;
  db.exec({
    sql: 'INSERT INTO t(a,b) VALUES (?,?)',
    bind: [i, i * 2],
  });
}

// insert with prepared statement
const stmt = db.prepare('INSERT INTO t(a,b) VALUES (?,?)');
console.log(stmt.bind([4, 8]).stepFinalize());
//// same result
// stmt
//   .bind(1, 4)
//   .bind(2, 8)
//   .stepFinalize();

// count result
console.log(
  'count',
  db.exec({
    sql: 'SELECT COUNT(*) FROM t;',
    returnValue: 'resultRows',
  })[0][0]
);

// callback with order by
db.exec({
  sql: 'SELECT a FROM t ORDER BY a LIMIT 2',
  callback: (row, _stmt) => {
    console.log('callback: SELECT a FROM t ORDER BY a LIMIT 2', row, _stmt);
  },
});