import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const ServiceStub = Ember.Object.extend({
  getName() {
    return this.get('name');
  },

  getPrice() {
    return this.get('price');
  },

  getVehicleSize() {
    return this.get('vehicleSize');
  },

  getDuration() {
    return this.get('duration');
  },

  getDescription() {
    return this.get('description');
  },
  getActive() {
    return this.get('active');
  },
  getDisplayable() {
    return this.get('displayable');
  },

});

let service = ServiceStub.create({
  name: 'Clean Car',
  price: '100',
  price_size: 'Small',
  duration: '60',
  description: 'Cleaning the car',
  active: true,
  displayable: false,
});

moduleForComponent('service-editor', 'Integration | Component | service editor', {
  integration: true
});

test('it renders a view with a model', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('model', service);

  assert.expect(14);

  this.render(hbs`{{
    service-editor
    model=model
  }}`);

  // Test in correct inputs bar are present
  assert.equal(this.$('input[id="service-name"]').length, 1, 'should be only 1 input name field - name of service');
  assert.equal(this.$('input[id="service-duration"]').length, 1, 'should be only 1 input number-minutes - Duration');
  assert.equal(this.$('input[id="service-price"]').length, 1, 'should be only 1 input for price of cars');
  assert.deepEqual($($('.ember-power-select-placeholder')).length, 1, 'should be only 1 input for size of vehicle');
  assert.equal(this.$('input[id="service-active"]').length, 1, 'should be only 1 input switch for service active');
  assert.equal(this.$('input[id="service-displayable"]').length, 1, 'should be only 1 input switch for service displayable');
  assert.equal(this.$('textarea').length, 1, 'should be only 1 text area for the description');

  // Test if proper values are placed into form
  assert.equal(this.$('input[id="service-name"]').val(), this.get('model.name'), 'names should match');
  assert.equal(this.$('input[id="service-duration"]').val(), this.get('model.duration'), 'duration should match');
  assert.equal(this.$('input[id="service-price-sm-vehicle"]').val(), this.get('model.price_small'), 'price for small car should watch');
  assert.deepEqual($($('.ember-power-select-placeholder')[0]).text(), 'Size of Vehicle', 'placeholder text to select a vehicle size');
  assert.equal(this.$('input[id="service-active"]').is(":checked"), this.get('model.active'), 'Whether a service is active should match');
  assert.equal(this.$('input[id="service-displayable"]').is("checked"), this.get('model.displayable'), 'Whether a service is displayable should match');
  assert.equal(this.$('textarea').val(), this.get('model.description'), 'the textarea should be filled in with the model description');
});
