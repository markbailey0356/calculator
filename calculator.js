"use strict";

const Calculator = {
  // constants
  ZERO: function(){this.digitButton(0)},
  ONE: function(){this.digitButton(1)},
  TWO: function(){this.digitButton(2)},
  THREE: function(){this.digitButton(3)},
  FOUR: function(){this.digitButton(4)},
  FIVE: function(){this.digitButton(5)},
  SIX: function(){this.digitButton(6)},
  SEVEN: function(){this.digitButton(7)},
  EIGHT: function(){this.digitButton(8)},
  NINE: function(){this.digitButton(9)},
  DECIMAL: function(){this.digitButton(".")},
  ADD: function(){this.operatorButton(this.add)},
  SUBTRACT: function(){this.operatorButton(this.subtract)},
  MULTIPLY: function(){this.operatorButton(this.multiply)},
  DIVIDE: function(){this.operatorButton(this.divide)},
  EQUALS: function(){this.equalsButton()},
  CLEAR: function(){this.clearButton()},
  CLEAR_ENTRY: function(){this.clearEntryButton()},

  get FUNCTION_MAP() {
    return this.$FUNCTION_MAP || 
      (this.$FUNCTION_MAP = [
        {callback: this.ZERO, class: "zero-button", key: "0"},
        {callback: this.ONE, class: "one-button", key: "1"},
        {callback: this.TWO, class: "two-button", key: "2"},
        {callback: this.THREE, class: "three-button", key: "3"},
        {callback: this.FOUR, class: "four-button", key: "4"},
        {callback: this.FIVE, class: "five-button", key: "5"},
        {callback: this.SIX, class: "six-button", key: "6"},
        {callback: this.SEVEN, class: "seven-button", key: "7"},
        {callback: this.EIGHT, class: "eight-button", key: "8"},
        {callback: this.NINE, class: "nine-button", key: "9"},
        {callback: this.DECIMAL, class: "decimal-button", key: "."},
        {callback: this.ADD, class: "add-button", key: "+"},
        {callback: this.SUBTRACT, class: "subtract-button", key: "-"},
        {callback: this.MULTIPLY, class: "multiply-button", key: "*"},
        {callback: this.DIVIDE, class: "divide-button", key: "/"},
        {callback: this.EQUALS, class: "equals-button", key: "Enter"},
        {callback: this.CLEAR, class: "clear-button", key: "Delete"},
        {callback: this.CLEAR_ENTRY, class: "clear-entry-button", key: "Backspace"},
      ]);
  },

  STATES: {
    FIRST: 0,
    OPERATOR: 1,
    SECOND: 2,
    EQUALS: 3,
    ERROR: 4,
  },

  MAX_DISPLAY_LENGTH: 15,
  VALID_NUMBER_REGEX: /-?(0($|\.\d*)|[1-9]\d*(\.\d*)?)/,

  // calculated properties
  get maxDisplayNumber() {
    return Math.pow(10, this.MAX_DISPLAY_LENGTH)-1;
  },
  
  // initialize state
  init: function(element) {
    this.element = element;
    this.buttons = element.getElementsByTagName("button");
    this.displayElement = element.getElementsByClassName("display")[0];
    this.wireAllButtons();
    this.wireKeyboard();
    this.state = this.STATES.FIRST;
  },

  // output property
  set display(output) {
    output += '';
    output = output.match(this.VALID_NUMBER_REGEX)[0];
    output = output.slice(0, this.MAX_DISPLAY_LENGTH + (output.slice(0,1) == '-'));
    this.$display = output;
    if (this.state != this.STATES.ERROR) {
      this.displayElement.textContent = this.$display;
    }
  },
  get display() {return this.$display},

  set error(output) {
    this.state = this.STATES.ERROR;
    this.displayElement.textContent = output;
  },

  // state property
  set state(newState) {
    if (this.$state != newState) {
      // on exit state
      switch(this.$state) {
        case this.STATES.FIRST:
          this.firstArg = +this.display;
          break;
        case this.STATES.SECOND:
          this.secondArg = +this.display;
          break;
      }

      // on enter state
      switch(newState) {
        case this.STATES.FIRST:
          this.clearAll();
          break;
        case this.STATES.SECOND:
          this.display = this.secondArg = 0;
          this.decimal = false;
          break;
        
      }
    }
    this.$state = newState;
  },
  get state() {return this.$state;},

  // mutators
  operateDisplay: function (operator, y) {
    this.display = operator(this.display, y);
  },
  appendDisplay: function(y) {
    this.operateDisplay(this.append, y)
  },
  operate: function(
    operator = this.operator,
    x = this.firstArg,
    y = this.secondArg
  ) {
    return operator(x, y);
  },
  clearAll: function() {
    this.display = this.secondArg = this.firstArg = 0;
    this.operator = this.add;
    this.decimal = false;
  },
  clearDisplay: function() {
    this.display = 0;
  },

  // button functions
  digitButton: function(y) {
    // state changes
    switch(this.state) {
      case this.STATES.OPERATOR:
        this.state = this.STATES.SECOND;
        break;
      case this.STATES.ERROR:
      case this.STATES.EQUALS:
        this.state = this.STATES.FIRST;
        break;
    }
    // perform operations
    if (y == '.') {
      if (this.decimal) return;
      else this.decimal = true;
    }
    this.appendDisplay(y);
  },
  operatorButton: function(operator) {
    // state changes
    switch(this.state) {
      case this.STATES.FIRST:
      case this.STATES.EQUALS:
        this.state = this.STATES.OPERATOR;
        break;
      case this.STATES.SECOND:
        this.equalsButton();
        this.state = this.STATES.OPERATOR;
        break;
    }
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
    this.firstArg = this.operate();
    if (this.firstArg == Infinity || this.firstArg == -Infinity) {
      this.error = "YOU BROKE IT!"
    } else if (Math.abs(this.firstArg) > this.maxDisplayNumber) {
      this.error = "OVERFLOW";
    } else {
      this.display = this.firstArg;
    }
  },
  clearButton: function() {
    this.state = this.STATES.FIRST;
    this.clearAll();
  },
  clearEntryButton: function() {
    switch(this.state) {
      case this.STATES.FIRST:
      case this.STATES.SECOND:
        this.clearDisplay();
    }
  },

  // wire event listeners
  wireButton: function(button, callback) {
    button.addEventListener("click", callback);
  },
  wireButtonClass: function(className, callback) {
    let classList = Array.from(document.getElementsByClassName(className));
    classList.forEach((button) => this.wireButton(button, callback.bind(this)));
  },
  wireAllButtons: function(map = this.FUNCTION_MAP) {
    map.forEach((entry) => this.wireButtonClass(entry.class, entry.callback.bind(this)));
  },
  wireKeyboard: function(map = this.FUNCTION_MAP) {
    window.addEventListener("keydown", (event) => {
      map.find(entry => entry.key == event.key).callback.bind(this)();
    });
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
