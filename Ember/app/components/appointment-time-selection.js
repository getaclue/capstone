import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({

  availableTimes: null,

  aSelectedEmployee: Ember.computed('appointment.employee', function(){
    return this.get('appointment.employee');
  }),

 didInsertElement() {
    this._super(...arguments);
    Ember.$('#appointment-time-selection').modal('show');
  },

  willDestroyElement() {

    Ember.$('#appointment-time-selection').modal('hide');
  },

  actions: {

    cancelSelection() {
      this.set('selectEmployee', false);
      this.set('selectTime', false);
    },

    confirmSelection(time) {
      this.set('selectedTime', time);
      this.set('selectTime', false);
      this.set('selectEmployee', false);
      Ember.$('#move-to-information-input').removeAttr('disabled');
    },

    selectEmployee(employee) {
      if(!Ember.isEmpty(employee)){
        var self = this;
        self.get('appointment').set('employee', employee);
        var dayOfTheWeek = moment(self.get('selectedDate')).format('dddd');
        self.get('store').query('company-preference', {
          filter: {
            employee_id: self.get('appointment.employee.id')
          }
        }).then(function(result) {

          var arrayTime = [];
          var employeeStart = result.get('firstObject').get(dayOfTheWeek.toLowerCase() + "Open");
          var employeeEnd = result.get('firstObject').get(dayOfTheWeek.toLowerCase() + "Close");
          var employeeWorking = result.get('firstObject').get("work" + dayOfTheWeek);
          var timeDiff = moment(employeeEnd,"h:mma").diff(moment(employeeStart,"h:mma"));
          var time = employeeStart;
          self.get('store').query('appointment', {
            filter: {
              date:        moment(self.get('selectedDate'),'MMMM D, YYYY').format('YYYY-MM-DD'),
              employee_id: self.get('appointment.employee.id')
            }
          }).then(function(results) {
            if(employeeWorking) {
              var apptCounter=0;
              for(var i = 0 ; i < timeDiff; i+=1800000){
                if(results.objectAt(apptCounter)){
                  var apptStart = moment(results.objectAt(apptCounter).get('start')).format("h:mma");
                  if(apptStart === time) {
                    var apptEnd = moment(results.objectAt(apptCounter).get('end')).format("h:mma");
                    var apptDiff = moment(apptEnd,"h:mma").diff(moment(apptStart,"h:mma"));
                    time = moment(apptEnd,"h:mma");
                    i+= apptDiff;
                    apptCounter++;
                  } else {
                    arrayTime.push(moment(time, "h:mma").format("h:mma"));
                    time = moment(time, "h:mma").add(30, 'minutes').format("h:mma");
                  }
                } else {
                  arrayTime.push(moment(time, "h:mma").format("h:mma"));
                  time = moment(time, "h:mma").add(30, 'minutes').format("h:mma");
                }
              }
            }
            self.set('availableTimes', arrayTime);
            self.set('selectEmployee', true);
          });
        });
      }
    },
  }
});
