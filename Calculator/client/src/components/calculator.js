import React, { Component } from 'react';

export default class Calculator extends Component {
  render() {
    return (
      <div className="calculator">
        <div className="display">0</div>
        <div className="keypad">
          <div className="input-keys">
            <div className ="clear-key">
              <button className="key key-clear">AC</button>
            </div>
            <div className ="digit-keys">
              <button className="key key-0">0</button>
              <button className="key key-dit">●</button>
              <button className="key key-1">1</button>
              <button className="key key-2">2</button>
              <button className="key key-3">3</button>
              <button className="key key-4">4</button>
              <button className="key key-5">5</button>
              <button className="key key-6">6</button>
              <button className="key key-7">7</button>
              <button className="key key-8">8</button>
              <button className="key key-9">9</button>
            </div>
          </div>
          <div className="operation-keys">
            <button className="key key-divide">÷</button>
            <button className="key key-multiply">*</button>
            <button className="key key-subtract">-</button>
            <button className="key key-add">+</button>
            <button className="key key-equals">=</button>
          </div>
        </div>
      </div>
    );
  }
}
