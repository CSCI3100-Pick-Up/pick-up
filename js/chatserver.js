var WebSocketServer = require('websocket').server;
require('./chatpair.js');

module.exports = function(server) {
	// Create an instance of WebSocket server
	var wsserver = new WebSocketServer({
		httpServer: server,
		autoAcceptConnections: false
	});

	// To store all WS connections
	var allWSConnections = [];

	// Send message to all connected clients
	function myBroadcast(msg) {
		for (var i = 0; i < allWSConnections.length; i++) {
			allWSConnections[i].send(msg);
		}
	}
	// The "request" event happens when a client opens
	// a new websocket connection.
	wsserver.on('request', function(req) {
		// (Optionally) Reject connection if
		//	 a) it is not initiated from the same origin
		//	 b) it is not connected as 'ws://localhost:8081/chat
		if (req.origin !== 'http://localhost:8081' ||
				req.resource !== '/chatroom') {
			req.reject();
			return;
		}


		// Accept connection
		var conn = req.accept(null, req.origin);
		// Add the current connection to allWSConnections[]
		allWSConnections.push(conn);
		console.log(conn);


		// Specify what to do when receiving a message on this
		// WS connection
		conn.on('message', function(msg) {
			if (msg.type === 'utf8') {
				myBroadcast(msg.utf8Data);
			}
		});

		// Remove a closed connection
		conn.on('close', function(reasonCode, desc) {
			var idx = allWSConnections.indexOf(conn);
			if (idx != -1) {
				allWSConnections.splice(idx, 1);
			}
		});

	});	// End of wsserver.on('request', ...
} // End of module.export = function(server) ...
