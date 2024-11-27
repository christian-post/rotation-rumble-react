import { MongoClient } from "mongodb";


let dbConnection;

export async function connectToDb(callback) {
  const url = `mongodb+srv://${process.env.DBUSER}:${process.env.PASSWORD}@cluster0.59u2j.mongodb.net/test`;
    MongoClient.connect(url)
      .then(client => {
        console.log("connected to database");

        dbConnection = client.db(process.env.DBNAME);
        return callback();
      })
      .catch(err => {
        console.log(err);
        dbConnection = null;
        return callback(err);
      });
}


export function getDb() {
  return dbConnection;
}
