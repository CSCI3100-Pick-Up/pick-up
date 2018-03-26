YUI().use(
'aui-scheduler',
function(Y) {
var events = [
  {
    content: 'Partial Lunar Eclipse',
    endDate: new Date(2018, 2, 22, 5),  //0 represents January
    startDate: new Date(2018, 2, 22, 1)
  },
  {
    color: "#8d8",
    content: 'Earth Day Lunch',
    disabled: true,
    endDate: new Date(2018, 2, 15, 13),
    meeting: true,
    reminder: true,
    startDate: new Date(2018, 2, 15, 12)
  },
  {
    content: "Weeklong",
    endDate: new Date(2018, 2, 13),
    startDate: new Date(2018, 2, 20)
  }
];

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
);
