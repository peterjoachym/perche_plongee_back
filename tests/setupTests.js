const { closeConnection } = require("../db-connection");
const server = require("../src");

// const deleteAllData = async () => {
//   await deleteAllDBData();
// };
const closeApp = () =>
  new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// beforeAll(async () => {
//   await deleteAllData();
// });
afterAll(async () => {
  await closeConnection();
  await closeApp();
});
