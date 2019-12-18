const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const validation = require('./utils/validation');
var { generateMessage, generateLocationMessage } = require('./utils/message');
const { Users } = require('./utils/user');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// 50-socket-io-setup__videoroxo
io.on('connection', (socket) => {
    console.log('New user connection');

    // 52-message-and-broadcating-event__videoroxo

    // socket.emit('newMessage', {
    //     from: "Mohammad",
    //     text: "hello, good moorning",
    //     createdAt: new Date().getTime()
    // });

    socket.on('join', (params, callback) => {
        if (!validation.isRealString(params.name) || !validation.isRealString(params.room)) {
            callback('نام و اتاق مورد نظر را وارد کنید');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('admin', 'welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined`));
        callback();
    })

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && validation.isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(message.from, message.text));
            // io.emit('newMessage', generateMessage(message.from, message.text));
        }
        callback();

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage('admin', coords.latitude, coords.longitude));
            // io.emit('newLocationMessage', generateLocationMessage('admin', coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('admin', `${user.name} has leave`));
        }
    });

});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});