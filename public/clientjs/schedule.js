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
              alert('Save Event:' + this.isNew() + ' --- ' + this.getContentNode().val()); //Should be communicating with database
            },
            edit: function(event) {
              alert('Edit Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
            },
           delete: function(event) {
               alert('Delete Event:' + this.isNew() + ' --- ' + this.getContentNode().val());
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
