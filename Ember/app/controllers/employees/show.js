import Ember from 'ember';

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  actions: {
    updateEmployee() {
      var self = this;

      var flashMessages = self.get('flashMessages');
      function onSuccessful() {
        self.transitionToRoute('employees');
      }

      function onError() {
        window.scrollTo(0,0);
        var message = "";
        var errors = self.get('model').get('errors.content');
        for (var i=0; i<errors.length; ++i){
            message +=(errors[i].attribute+" "+ errors[i].message+"! ");}
        flashMessages.danger('Error: '+ message);
      }

      this.get('model').save().then(onSuccessful).catch(onError);
    }
  }
});
