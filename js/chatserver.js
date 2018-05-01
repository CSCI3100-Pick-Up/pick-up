/*
PROGRAM CHATSERVER - Program to run a server for chatrooms
PROGRAMMER: Leung Wing Keung 1155062425@link.cuhk.edu.hk
CALLING SEQUENCE: HTTP://LOCALHOST:8081
VERSION 1: mmukhin, https://github.com/mmukhin/psitsmike_example_2
REVISION 1.1: 3-4-2018 to remove switchRoom, change the name of the chatroom to be the email of a user.
PURPOSE: run a server for users who are confirmed to chat.
DATA STRUCTURE: Variable EMAIL - STRING
  ARRAY usernames - STRING array of users' email
ALGORITHM: If a user connect to the chatroom, and variable 'EMAIL' to the array 'usernames'. If the user disconnects, remove 'EMAIL' from array 'usernames'
*/

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
server.listen(8080);
// routing


// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room','room2','room3'];

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username, room){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = room;
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join(room);
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to room ' + room);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room');
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

  // This is not used in this program
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});


	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});
