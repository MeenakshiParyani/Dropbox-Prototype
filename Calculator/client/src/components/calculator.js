import React, { Component } from 'react';

export default class Calculator extends Component {

  state = {
    displayValue : '0'
  }

  inputValue(digit){
    const { displayValue } = this.state;
    this.setState({
      displayValue : displayValue === '0' ? String(digit) : displayValue + digit
    })
  }

  inputDecimal(){
    const { displayValue } = this.state;
      if(displayValue.indexOf('.') === -1){
        this.setState({
          displayValue : displayValue + '.'
        })
      }

  }

  clearDisplay(){
    this.setState({
      displayValue : '0'
    })
  }

  render() {

    const { displayValue } = this.state;
    return (
      <div className="calculator">
        <div className="display">{displayValue}</div>
        <div className="keypad">
          <div className="input-keys">
            <div className ="function-keys">
              <button className="key-clear" onClick={ () => this.clearDisplay()}>AC</button>
            </div>
            <div className ="digit-keys">
              <button className="key key-0" onClick={ () => this.inputValue(0)}>0</button>
              <button className="key key-dot" onClick={ () => this.inputDecimal()}>●</button>
              <button className="key key-1" onClick={ () => this.inputValue(1)}>1</button>
              <button className="key key-2" onClick={ () => this.inputValue(2)}>2</button>
              <button className="key key-3" onClick={ () => this.inputValue(3)}>3</button>
              <button className="key key-4" onClick={ () => this.inputValue(4)}>4</button>
              <button className="key key-5" onClick={ () => this.inputValue(5)}>5</button>
              <button className="key key-6" onClick={ () => this.inputValue(6)}>6</button>
              <button className="key key-7" onClick={ () => this.inputValue(7)}>7</button>
              <button className="key key-8" onClick={ () => this.inputValue(8)}>8</button>
              <button className="key key-9" onClick={ () => this.inputValue(9)}>9</button>
            </div>
          </div>
          <div className="operation-keys">
            <button className="key key-divide">÷</button>
            <button className="key key-multiply">×</button>
            <button className="key key-subtract">-</button>
            <button className="key key-add">+</button>
            <button className="key key-equals">=</button>
          </div>
        </div>
      </div>
    );
  }
}
