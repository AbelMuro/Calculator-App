import React, {useState, useEffect, useRef} from 'react';
import "./styles.css";


function App() {
    const [currentOperation, setCurrentOperation] = useState("");
    const [calculation, setCalculation] = useState("");
    let disable = false;
    let allOperators = ["+" ,"-", "x", "/"]


    const calculate = () => {
        if(operator === "+")
            setCalculation(Number(firstNumber) + Number(secondNumber)); 
        if(operator === "x")
            setCalculation(Number(firstNumber) * Number(secondNumber));
        if(operator === "-")
            setCalculation(Number(firstNumber) - Number(secondNumber));
        if(operator === "/")
            setCalculation(Number(firstNumber) / Number(secondNumber));
    }

    const handleButtonClick = (e) => {
        if(e.target && e.target.matches(".numbers")){
            disable = false;
            setCurrentOperation((prevState) => {
                return prevState + e.target.innerHTML
            });
        }

        else if(e.target && e.target.matches(".operator")){
            setCurrentOperation((prevState) => {
                let temp;
                if(allOperators.includes(prevState[prevState.length - 1])){
                    temp = prevState.slice(0, prevState.length - 1)
                    temp += e.target.innerHTML;
                    return temp;                    
                }
                else
                    return prevState + e.target.innerHTML;

            })
        }

        else if(e.target && e.target.matches("#calculate")){
            let stack = [];
            const operationArray = currentOperation.split("");

            console.log(operationArray);

            if(!Number(operationArray[operationArray.length - 1])){
                alert("You must input another number to complete the operation");
                return;
            }

            operationArray.map((val, i) => {
                if(Number(val))
                    stack.push(Number(val));
                else if(!Number(val))
                    stack.push()
            })

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
                        {currentOperation}
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
                <button className="operator" disabled={disable}>
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
                <button className="operator" disabled={disable}>
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
                <button className="operator" disabled={disable}>
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
                <button className="operator" disabled={disable}>
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