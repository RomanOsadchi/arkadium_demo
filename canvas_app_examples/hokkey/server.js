const connect = require('connect');
const serveStatic = require('serve-static');

connect()
    .use(serveStatic(__dirname))
    .listen(3000, () => console.log('Server running on 3000...'));
