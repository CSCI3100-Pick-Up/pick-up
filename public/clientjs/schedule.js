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
              $.ajax({
                url: '/schedule/newschedule',
                type: 'GET',
                data: { content: String(saveEvent.getContentNode().val()), endDate: String(saveEvent.changed.endDate), startDate: String(saveEvent.changed.startDate)},
                success: function(result) {
                  alert('The new schedule ' + ' --- ' + this.getContentNode().val() +'is saved!');
                }
              });
            },
            edit: function(event) {
              var editEvent = this;
              console.log(editEvent);
              console.log(editEvent.getUpdatedSchedulerEvent());
              $.ajax({
                url: '/schedule/updateschedule',
                type: 'GET',
                data: { content: String(editEvent.getContentNode().val()),
                  NewendDate: String(editEvent.getUpdatedSchedulerEvent().changed.endDate),
                  NewstartDate: String(editEvent.getUpdatedSchedulerEvent().changed.startDate),
                  OldendDate: String(editEvent.changed.endDate),
                  OldstartDate: String(editEvent.changed.startDate)
                },

                success: function(result) {}
              });
            },
           delete: function(event) {
             var deleteEvent = this;
             console.log(deleteEvent);
             console.log(deleteEvent.getUpdatedSchedulerEvent());
             $.ajax({
               url: '/schedule/deleteschedule',
               type: 'GET',
               data: { content: String(deleteEvent.getContentNode().val()),
                 endDate: String(deleteEvent.getUpdatedSchedulerEvent().changed.endDate),
                 startDate: String(deleteEvent.getUpdatedSchedulerEvent().changed.startDate),
               },
               success: function(result){
                 alert('The schedule' + ' --- ' + this.getContentNode().val() +'is deleted!');
               }
             });
            },
          //cancel: function(event) {
              //alert('Cancel Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
           //}
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
