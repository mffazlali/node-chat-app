const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
var { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// 50-socket-io-setup__videoroxo
io.on('connection', (socket) => {
    console.log('New user connection');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    // 52-message-and-broadcating-event__videoroxo

    // socket.emit('newMessage', {
    //     from: "Mohammad",
    //     text: "hello, good moorning",
    //     createdAt: new Date().getTime()
    // });
    socket.emit('newMessage', generateMessage('admin', 'welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('admin', 'new user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log(message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('admin', coords.latitude, coords.longitude));
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});