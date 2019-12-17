var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    // socket.emit('createMessage', {
    //     from: 'ehsan',
    //     text: 'hello, thanks',
    //     createdAt: new Date().getTime()
    // });
});

socket.on('disconnect', function () {
    console.log('Disonnected from server');
});

// 54-adding-chat-form-jquery__videoroxo

socket.on('newMessage', function (message) {
    console.log('New message: ', message);

    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    var message = jQuery('[name=message]');
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'user',
        text: message.val()
    }, function () {
        message.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    console.log('send-location');
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location ...')

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});