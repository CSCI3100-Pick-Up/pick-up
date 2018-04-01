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
        $.ajax({
          url: '/loggedIn',
          type: 'GET',
          success: function(result) {
            if (result) {
              var msgtmp = $('#sendText').val();
              var msg =[];
              msg.push(msgtmp);
              msg.push(result.user);
              msg.push(document.getElementById("chatuser").textContent);
              ws.send(JSON.stringify(msg));
            }
          }
        })
      }
    });


});
