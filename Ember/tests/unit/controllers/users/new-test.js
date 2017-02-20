import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import RSVP from 'rsvp';

const flashMessagesStub = Ember.Service.extend({
  success(message) {
    this.set('calledWithMessage', message);
  },

  danger(message) {
    this.set('calledWithMessage', message);
  }
});

moduleFor('controller:users/new', 'Unit | Controller | users/new', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});


test('#createUser transitions to employees', function(assert) {
  var done = assert.async();

  let userStub = Ember.Object.create({
    save() {
      return RSVP.resolve();
    }
  });
  let controller = this.subject({
      model: userStub,
      transitionToRoute(route) {
        assert.equal(route, 'employees');
        done();
      }
  });

  controller.send('createUser');

  assert.ok(controller);
});

test('#createUser throws an error following a failed creation (passwords match)', function(assert) {
  this.register('service:flash-messages', flashMessagesStub);
  this.inject.service('flash-messages', { as: 'flashMessages' });

  let done = assert.async();

  let userStub = Ember.Object.create({
    confirm: 'password',
    password: 'password',
    save() {
      let errorMsg = { error: 'could not create a record' };
      return RSVP.reject(errorMsg);
    }
  });

  let ctrl = this.subject({
      model: userStub
  });

  ctrl.send('createUser');
  setTimeout(function() {
    assert.ok(ctrl);
    assert.deepEqual(ctrl.get('flashMessages.calledWithMessage'), 'Account was not created', 'danger flashMessages fired');
    done();
  }, 500);
});

test('#createUser throws an error following a failed creation (passwords do not match)', function(assert) {
  this.register('service:flash-messages', flashMessagesStub);
  this.inject.service('flash-messages', { as: 'flashMessages' });

  let userStub = Ember.Object.create({
    confirm: 'password1',
    password: 'password',
    save() {
      let errorMsg = { error: 'could not create a record' };
      return RSVP.reject(errorMsg);
    }
  });

  let ctrl = this.subject({
      model: userStub
  });

  ctrl.send('createUser');
  assert.ok(ctrl);
  assert.deepEqual(ctrl.get('flashMessages.calledWithMessage'), 'Passwords do not match!', 'danger flashMessages fired');
});

