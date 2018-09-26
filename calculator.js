import {curry} from './fp.js';

const Calculator = {
  // constants
  BUTTON_MAP: new Map([
    ["one-button", function(){this.appendDisplay(1)}],
    ["two-button", function(){this.appendDisplay(2)}],
    ["three-button", function(){this.appendDisplay(3)}],
    ["four-button", function(){this.appendDisplay(4)}],
    ["five-button", function(){this.appendDisplay(5)}],
    ["six-button", function(){this.appendDisplay(6)}],
    ["seven-button", function(){this.appendDisplay(7)}],
    ["eight-button", function(){this.appendDisplay(8)}],
    ["nine-button", function(){this.appendDisplay(9)}],
  ]),
  
  // initialize state
  init: function(element) {
    this.element = element;
    this.buttons = element.getElementsByTagName("button");
    this.displayElement = element.getElementsByClassName("display")[0];
    this.wireAllButtons();
    this.display = 0;
    this.acc = 0;
  },

  // output property
  set display(output) {
    this.$display = output;
    this.displayElement.textContent = output;
  },
  get display() {return this.$display},

  // mutators
  operateDisplay: function (operator, y) {
    this.display = +operator(this.display, y);
  },
  appendDisplay: function(y) {
    this.operateDisplay(this.append, y)
  },

  // wire event listeners
  wireButton: function(button, callback) {
    button.addEventListener("click", callback);
  },
  wireButtonClass: function(className, callback) {
    let classList = Array.from(document.getElementsByClassName(className));
    classList.forEach((button) => this.wireButton(button, callback));
  },
  wireAllButtons: function(map = this.BUTTON_MAP) {
    map.forEach((callback, className) => this.wireButtonClass(className, callback.bind(this)));
  },
  
  // pure functions
  add: curry((x,y) => x + y),
  subtract: curry((x,y) => x - y),
  multiply: curry((x,y) => x * y),
  divide: curry((x,y) => x / y),
  append: curry((x,y) => "" + x + y),
}

const calculator = Object.create(Calculator);
calculator.init(document.querySelector(".calculator"));
