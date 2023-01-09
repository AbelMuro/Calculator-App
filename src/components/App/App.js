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

    const inFixToPostFix = (s) => {
        let stack = []; 
        let result = "";
 
        for(let i = 0; i < s.length; i++) {
            let c = s[i];

            if(c >= '0' && c <= '9')                                    // If the scanned character is a operand, add it to output string.
                result += c;
  
            else {                                                      //If an operator is scanned, we push it on top of the stack
                while(stack.length > 0 && precedence(c) <= precedence(stack[stack.length - 1])) {  
                    result += stack[stack.length - 1];
                    stack.pop();
                }
                stack.push(c);
            }
        }
 
        // Pop all the remaining elements from the stack
        while(stack.length != 0) {
            result += stack[stack.length - 1];
            stack.pop();
        }
 
        return result;
    
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

        else if(e.target && e.target.matches(".operator")){
            let operatorChoosen = e.target.innerHTML === "x" ? "*" : e.target.innerHTML;   
            setCalculation((prevState) => {
                let temp;
                if(allOperators.includes(prevState[prevState.length - 1])){         ///this is where i left off
                    temp = prevState.slice(0, prevState.length - 1)
                    temp += operatorChoosen;
                    return temp;                    
                }
                else
                    return prevState + " " + operatorChoosen + " ";

            })
        }

        else if(e.target && e.target.matches("#calculate")){
            let infix = inFixToPostFix(calculation.replaceAll(" ", ""));      
            console.log(infix);

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