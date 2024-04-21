'use strict';

const Hapi = require('@hapi/hapi');
const booksController = require('./controllers/booksController')

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/books',
        handler: booksController.getAll
    });

    server.route({
        method: 'GET',
        path: '/books/{bookId}',
        handler: booksController.getDetailBook
    });

    server.route({
        method: 'POST',
        path: '/books',
        handler: booksController.save
    });

    server.route({
        method: 'PUT',
        path: '/books/{bookId}',
        handler: booksController.update
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
