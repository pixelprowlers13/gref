const Firmata = require('firmata');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Replace with your Arduino port
const board = new Firmata('COM3');

board.on('ready', () => {
    console.log('Arduino is ready!');

    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('digitalWrite', ({ pin, value }) => {
            board.digitalWrite(pin, value);
        });

        socket.on('analogRead', (pin) => {
            board.analogRead(pin, (value) => {
                socket.emit('analogReadResponse', { pin, value });
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
