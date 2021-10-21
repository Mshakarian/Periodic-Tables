const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

const server = app.listen(PORT,listener);
let connections = [];

server.on("connection", (connection) =>{
  connections.push(connection);
  connection.on("close", ()=> (connections = connections.filter((curr)=>curr !== connection)))
});

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    console.log("used", knex.client.pool.numUsed());
    console.log("free", knex.client.pool.numFree());
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}

function shutdown(){
  server.close(()=>{
    console.log("shutting down, closing connections");
    console.log("connections:");
    console.log(connections);
    knex.destroy();
    process.exit(0);
  });
  connections.forEach(curr => curr.end());
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
