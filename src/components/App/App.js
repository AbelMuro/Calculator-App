import React, {useState, useEffect} from 'react';
import "./styles.css";


function App() {
    const [calculation, setCalculation] = useState("0");
    let allOperators = ["+" ,"-", "*", "/"]

    const precedence = (c) => {
        if(c == '^')
            return 3;
        else if(c == '/' || c=='*')
            return 2;
        else if(c == '+' || c == '-')
            return 1;
        else
            return -1;
    }


    //now what im trying to do is figure out two caveats
    //the first one is what to do if the first number in the string has a negative sign
    //the second one is what to do if the string has "*-", this denotes that we are multiplying something by a negative number
    const inFixToPostFix = (s) => {
        let stack = []; 
        let result = "";
 
        for(let i = 0; i < s.length; i++) {
            let c = s[i];

            if((c >= '0' && c <= '9') || c == ".")                      // If the scanned character is a operand, add it to output string.
                result += c;
            else {                                                      // If an operator is scanned, we push it on top of the stack
                result += " ";
                while(stack.length > 0 && precedence(c) <= precedence(stack[stack.length - 1])) {  
                    result += stack[stack.length - 1];
                    stack.pop();
                }
                stack.push(c);
            }
            if(i == s.length - 1)
                result += " ";
        }
        
        while(stack.length != 0) {// Pop all the remaining elements from the stack
            result += stack[stack.length - 1];
            stack.pop();
        }
        console.log(result)
        return result;
    }

    const evaluatePostFix = (s) => {
        let stack = [];
        let wholeNumber = "";
        let currentChar;
        for(let i = 0; i < s.length; i++){
            currentChar = s[i];
            if((currentChar >= "0" && currentChar <= "9") || currentChar == ".")
                wholeNumber += currentChar;
            
            else if(currentChar == " "){
                stack.push(wholeNumber);
                wholeNumber = "";
            }  
            else{
                let operandOne = Number(stack.pop());
                let operandTwo = Number(stack.pop());
            
                if(currentChar === "+")
                    stack.push(operandOne + operandTwo);
                if(currentChar === "-")
                    stack.push(operandTwo - operandOne);
                if(currentChar === "*")
                    stack.push(operandOne * operandTwo);
                if(currentChar === "/")
                    stack.push(operandTwo / operandOne);
            }
        }
        return stack[0] + "";
    }

    const handleButtonClick = (e) => {
        if(e.target && e.target.matches(".numbers")){
            let temp;
            setCalculation((prevState) => {
                if(prevState[0] == "0"){
                    temp = prevState.substring(1, prevState.length);
                    return temp + e.target.innerHTML;
                }
                else     
                    return prevState + e.target.innerHTML
            });
        }

        else if(e.target && e.target.matches(".modify")){
            let buttonChoosen = e.target.innerHTML;

            if(buttonChoosen == "AC")
                setCalculation("0");

            else if (buttonChoosen == "+/-"){
                setCalculation((prevState) => {

                    let prev = Array.from(prevState);    
                    let currentNumber = [];
                    for(let c = prev.length - 1; c >= 0; c--){
                        if((prev[c] >= "0" && prev[c] <= "9") || prev[c] == "."){
                            currentNumber.unshift(prev[c]);
                            prev.pop();
                        }
                        else
                            break;
                    }
                    if(prev.length == 0){
                        return "-" + prevState;
                    }
                    else{
                        if(prev[prev.length - 1] == "+"){
                            prev.pop();
                            prev.push("-");
                        }
                        else if(prev[prev.length - 1] == "-"){
                            prev.pop();
                            if(prev[prev.length - 1] != "*" && prev[prev.length - 1] != "/"){
                                console.log(prev[prev.length - 3]);
                                prev.push("+");
                            }          
                        }
                        else if(prev[prev.length - 1] == "*" || prev[prev.length - 1] == "/"){
                            prev.push("-");
                        }
                    }
                    return prev.join("") + currentNumber.join("");
                })
            }
        }

        else if(e.target && e.target.matches(".operator")){
            let operatorChoosen = e.target.innerHTML === "x" ? "*" : e.target.innerHTML;   
            setCalculation((prevState) => {
                let temp;
                if(allOperators.includes(prevState[prevState.length - 1])){   
                    temp = prevState.slice(0, prevState.length - 1)
                    temp += operatorChoosen;
                    return temp;                    
                }
                else
                    return prevState + operatorChoosen;
            })
        }
        else if(e.target && e.target.matches("#calculate")){
            if(!Number(calculation[calculation.length - 1])) {
                alert("Please complete the expression by entering another number");
                return;
            }
            let postfix = inFixToPostFix(calculation);   
            let result = evaluatePostFix(postfix);
            if(result.includes("."))
                setCalculation(Number(result).toFixed(3));
            else    
                setCalculation(Number(result))
        }   
    }

    useEffect(() => {
        const allButtons = document.querySelector(".buttons");
        allButtons.addEventListener("click", handleButtonClick);

        return () => {
            allButtons.removeEventListener("click", handleButtonClick);
        }
    })


    return (
        <main className="calculator">
            <section className="screen">
                <div className="currentOperation">
                </div>
                <div className="calculation"> 
                        {calculation}
                </div>
            </section>

            <section className="buttons">
                <button className="modify">
                    AC
                </button>
                <button className="modify">
                    +/-
                </button>
                <button className="modify">
                    %    
                </button>                
                <button className="operator">
                    /
                </button>     
                <button className="numbers">
                    7
                </button>
                <button className="numbers">
                    8
                </button>   
                <button className="numbers">
                    9
                </button>    
                <button className="operator">
                    x
                </button>
                <button className="numbers">
                    4
                </button>
                <button className="numbers">
                    5
                </button>
                <button className="numbers">
                    6
                </button>
                <button className="operator">
                    -
                </button>     
                <button className="numbers">
                    1
                </button>     
                <button className="numbers">
                    2
                </button>
                <button className="numbers">
                    3
                </button>  
                <button className="operator">
                    +
                </button>       
                <button className="numbers">
                    0
                </button>     
                <button className="modify">
                    .
                </button>            
                <button id="calculate">
                    =
                </button>       
            </section>
        </main>

    )

}

export default App;