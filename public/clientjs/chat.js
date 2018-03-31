$(document).ready(function() {
    var ws = new WebSocket('ws://localhost:8081/chatroom');

    ws.onmessage = function(evt) {
      var $ul = $('#chatHistory');
      var $li = $('<li class="list-group-item list-group-item-success" style="text-align: right">' + evt.data + '</li>');
      $ul.append($li);
    };

    $('#send').on('click', function(evt) {
      // If connection is open and ready
      if (ws.readyState === WebSocket.OPEN) {
        var msg = $('#sendText').val();
        ws.send(msg);
      }
    });
  });
