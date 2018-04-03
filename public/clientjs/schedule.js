YUI().use('aui-scheduler',function(Y) {
    $.ajax({
      url: '/schedule/getschedule',
      type: 'GET',
      success: function(result) {
        var events = [];
        for (var i=0; i<result.length; i++) {
          var temp = {content: result[i].content,
                      endDate: new Date(result[i].endDate),
                      startDate: new Date(result[i].startDate) };
          events.push(temp);
        };
        var agendaView = new Y.SchedulerAgendaView();
        var dayView = new Y.SchedulerDayView();
        var weekView = new Y.SchedulerWeekView();
        var monthView = new Y.SchedulerMonthView();

        var eventRecorder = new Y.SchedulerEventRecorder({
          on: {
            save: function(event) {
              var saveEvent = this;
              var text = String(saveEvent.getContentNode().val());
              $.ajax({
                url: '/schedule/newschedule',
                type: 'GET',
                data: { content: String(saveEvent.getContentNode().val()), endDate: saveEvent.changed.endDate.getTime(), startDate: saveEvent.changed.startDate.getTime()},
                success: function(result) {
                  if (result) {
                    alert('The new schedule ' + ' --- ' + text +' is saved!');
                  }
                  else {
                    alert('Something goes wrong! Please try again.');
                  }
                  location.reload();
                }
              });
            },
            edit: function(event) {
              var editEvent = this;
                $.ajax({
                  url: '/schedule/updateschedule',
                  type: 'GET',
                  data: { content: String(editEvent.getContentNode().val()),
                    NewendDate: editEvent.getUpdatedSchedulerEvent().changed.endDate.getTime(),
                    NewstartDate: editEvent.getUpdatedSchedulerEvent().changed.startDate.getTime(),
                    OldendDate: editEvent.getUpdatedSchedulerEvent()._state.data.endDate.initValue.getTime(),
                    OldstartDate: editEvent.getUpdatedSchedulerEvent()._state.data.startDate.initValue.getTime()
                  },
                  success: function(result) {
                    if (result) {
                      alert('The schedule is updated!');
                    }
                    else {
                      alert('Something goes wrong! Please try again.');
                      location.reload;
                    }
                  }
                });
            },
           delete: function(event) {
             var deleteEvent = this;
             var text = String(deleteEvent.getContentNode().val());
             $.ajax({
               url: '/schedule/deleteschedule',
               type: 'GET',
               data: { content: String(deleteEvent.getContentNode().val()),
                 endDate: deleteEvent.getUpdatedSchedulerEvent().changed.endDate.getTime(),
                 startDate: deleteEvent.getUpdatedSchedulerEvent().changed.startDate.getTime(),
               },
               success: function(result) {
                 if (result) {
                   alert('The schedule' + ' --- ' + text +' is deleted!');
                 }
                 else {
                   alert('Something goes wrong! Please try again.');
                 }
                 location.reload();
               }
             });
            },
        }
        });

        new Y.Scheduler(
          {
            activeView: weekView,
            boundingBox: '#myScheduler',
            eventRecorder: eventRecorder,
            items: events,
            render: true,
            views: [dayView, weekView, monthView, agendaView]
          }
        );
      }
    });
  }
);
