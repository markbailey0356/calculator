import {curry} from './fp.js';

const Calculator = {
  // constants
  BUTTON_MAP: new Map([
    ["zero-button", function(){this.digitButton(0)}],
    ["one-button", function(){this.digitButton(1)}],
    ["two-button", function(){this.digitButton(2)}],
    ["three-button", function(){this.digitButton(3)}],
    ["four-button", function(){this.digitButton(4)}],
    ["five-button", function(){this.digitButton(5)}],
    ["six-button", function(){this.digitButton(6)}],
    ["seven-button", function(){this.digitButton(7)}],
    ["eight-button", function(){this.digitButton(8)}],
    ["nine-button", function(){this.digitButton(9)}],
    ["add-button", function(){this.operatorButton(this.add)}],
    ["subtract-button", function(){this.operatorButton(this.subtract)}],
    ["multiply-button", function(){this.operatorButton(this.multiply)}],
    ["divide-button", function(){this.operatorButton(this.divide)}],
    ["equals-button", function(){this.equalsButton()}],
  ]),

  STATES: {
    FIRST: 0,
    OPERATOR: 1,
    SECOND: 2,
    EQUALS: 3, 
  },
  
  // initialize state
  init: function(element) {
    this.element = element;
    this.buttons = element.getElementsByTagName("button");
    this.displayElement = element.getElementsByClassName("display")[0];
    this.wireAllButtons();
    this.state = this.STATES.FIRST;
    this.NUM_STATES = Object.keys(this.STATES).length;
  },

  // output property
  set display(output) {
    this.$display = output;
    this.displayElement.textContent = output;
  },
  get display() {return this.$display},

  // state property
  set state(newState) {
    if (this.$state != newState) {
      // on exit state
      switch(this.$state) {
        case this.STATES.FIRST:
          this.firstArg = this.display;
          break;
        case this.STATES.SECOND:
          this.secondArg = this.display;
          break;
      }

      // on enter state
      switch(newState) {
        case this.STATES.FIRST:
          this.display = this.secondArg = this.firstArg = 0;
          this.operator = this.add;
          break;
        case this.STATES.SECOND:
          this.display = this.secondArg = 0;
          break;
        
      }
    }
    this.$state = newState;
  },
  get state() {return this.$state;},

  // mutators
  operateDisplay: function (operator, y) {
    this.display = +operator(this.display, y);
  },
  appendDisplay: function(y) {
    this.operateDisplay(this.append, y)
  },
  nextState: function() {
    this.state = (this.state + 1) % this.NUM_STATES;
  },
  prevState: function() {
    this.state = (this.state - 1) % this.NUM_STATES;
  },
  operate: function(
    operator = this.operator,
    x = this.firstArg,
    y = this.secondArg
  ) {
    return operator(x, y);
  },

  // button functions
  digitButton: function(y) {
    // state changes
    switch(this.state) {
      case this.STATES.OPERATOR:
      case this.STATES.EQUALS:
        this.nextState();
    }
    // perform operations
    this.appendDisplay(y);
  },
  operatorButton: function(operator) {
    // state changes
    switch(this.state) {
      case this.STATES.SECOND:
        this.equalsButton();
    }
    this.state = this.STATES.OPERATOR
    // perform operations
    this.operator = operator;
  },
  equalsButton: function() {
    switch(this.state) {
      case this.STATES.OPERATOR:
        return;
      case this.STATES.FIRST:
      case this.STATES.SECOND:
        this.state = this.STATES.EQUALS;
        break;
    }
    // perform operations
    this.firstArg = this.display = this.operate();
  },

  // wire event listeners
  wireButton: function(button, callback) {
    button.addEventListener("click", callback);
  },
  wireButtonClass: function(className, callback) {
    let classList = Array.from(document.getElementsByClassName(className));
    classList.forEach((button) => this.wireButton(button, callback.bind(this)));
  },
  wireAllButtons: function(map = this.BUTTON_MAP) {
    map.forEach((callback, className) => this.wireButtonClass(className, callback.bind(this)));
  },
  
  // pure functions
  add: (x,y) => x + y,
  subtract: (x,y) => x - y,
  multiply: (x,y) => x * y,
  divide: (x,y) => x / y,
  append: (x,y) => "" + x + y,
}

const calculator = Object.create(Calculator);
calculator.init(document.querySelector(".calculator"));
