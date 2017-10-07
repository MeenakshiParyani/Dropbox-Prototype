import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default class Calculator extends Component {

  state = {
    op1: null,
    displayValue : '0',
    waitingForOperand : false,
    operator: null
  }

  operations = {
    '+' : 'add',
    '-' : 'sub',
    '/' : 'div',
    '*' : 'mul'
  }

  inputValue(digit){
    const { displayValue, waitingForOperand } = this.state;
    if(waitingForOperand){
      this.setState({
        displayValue :  String(digit),
        waitingForOperand :false
      })
    }else{
      this.setState({
        displayValue : displayValue === '0' ? String(digit) : displayValue + digit
      })
    }
  }

  inputDecimal(){
    const { displayValue, waitingForOperand } = this.state;
    if(waitingForOperand){
      this.setState({
          displayValue : '.',
          waitingForOperand: false
      });
    }else if(displayValue.indexOf('.') === -1){
      this.setState({
        displayValue : displayValue + '.',
        waitingForOperand : false
      })
    }



  }

  clearDisplay(){
    this.setState({
      displayValue : '0',
      op1 : null,
      waitingForOperand : false,
      operator : null
    })
  }

  performOperation(operation){
    const { displayValue, operator , op1} = this.state;
    const value = parseFloat(displayValue);
    if(op1 == null){
      this.setState({
        op1 : value,
        waitingForOperand: true,
        operator : operation
      })
    }
  }

  performEquals(){
    const {displayValue, operator, op1} = this.state;
    const value = parseFloat(displayValue);
    if(op1 && operator){
      console.log('operand 1 ' + op1 + ' operand 2 ' + value);
      this.getComputedValue(op1,operator,value);
    }

  }

  getComputedValue(op1,operator,op2){
    var self = this;
    operator = this.operations[operator];
    axios.get('http://localhost:3000/api/operate/'+op1+'/'+op2+'/'+operator)
    .then(function (response) {
      console.log(response.data.result);
      self.setState({
        displayValue : response.data.result,
        op1: parseFloat(response.data.result),
        waitingForOperand : true
      });
    });
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
            <button className="key key-divide" onClick={ () => this.performOperation('/')}>÷</button>
            <button className="key key-multiply" onClick={ () => this.performOperation('*')}>×</button>
            <button className="key key-subtract" onClick={ () => this.performOperation('-')}>-</button>
            <button className="key key-add" onClick={ () => this.performOperation('+')}>+</button>
            <button className="key key-equals" onClick={ () => this.performEquals()}>=</button>
          </div>
        </div>
      </div>
    );
  }
}
