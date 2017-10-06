import React, { Component } from 'react';

export default class Calculator extends Component {
  render() {
    return (
      <div className="calculator">
        <div className="display">0</div>
        <div className="keypad">
          <div className="input-keys">
            <div className ="clear-key">
              <button className="key-clear">AC</button>
            </div>
            <div className ="digit-keys">
              <button className="key-0">0</button>
              <button className="key-1">1</button>
              <button className="key-2">2</button>
              <button className="key-3">3</button>
              <button className="key-4">4</button>
              <button className="key-5">5</button>
              <button className="key-6">6</button>
              <button className="key-7">7</button>
              <button className="key-8">8</button>
              <button className="key-9">9</button>
            </div>
          </div>
          <div className="operation-keys">
            <button className="key-divide">÷</button>
            <button className="key-multiply">*</button>
            <button className="key-subtract">-</button>
            <button className="key-add">+</button>
            <button className="key-equals">=</button>
          </div>
        </div>
      </div>
    );
  }
}
