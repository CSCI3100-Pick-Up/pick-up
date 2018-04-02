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
                data: { content: String(saveEvent.getContentNode().val()), endDate: String(saveEvent.changed.endDate), startDate: String(saveEvent.changed.startDate)},
                success: function(result) {
                  alert('The new schedule ' + ' --- ' + text +' is saved!');
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
                    NewendDate: String(editEvent.getUpdatedSchedulerEvent().changed.endDate),
                    NewstartDate: String(editEvent.getUpdatedSchedulerEvent().changed.startDate),
                    OldendDate: String(editEvent.getUpdatedSchedulerEvent()._state.data.endDate.initValue),
                    OldstartDate: String(editEvent.getUpdatedSchedulerEvent()._state.data.startDate.initValue)
                  },
                  success: function(result) {
                    alert('The schedule is updated!');
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
                 endDate: String(deleteEvent.getUpdatedSchedulerEvent().changed.endDate),
                 startDate: String(deleteEvent.getUpdatedSchedulerEvent().changed.startDate),
               },
               success: function(result) {
                 alert('The schedule' + ' --- ' + text +' is deleted!');
                 location.reload();
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
