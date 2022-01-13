const http = require('http');
const app = require('./app');
//accesez variabilele de mediu cu process.env si respectiv portul
//daca nu este setat portul atunci ramane 3000.
const port = process.env.PORT || 3000

const server = http.createServer(app);

server.listen(port);