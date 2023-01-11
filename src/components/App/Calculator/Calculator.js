import React, {useState, useEffect} from 'react';
import infixToPostfix from './InfixToPostfix';
import evaluatePostFix from './EvaluatePostfix';
import preScan from './PreScan';
import "./styles.css";


function Calculator() {
    const [calculation, setCalculation] = useState("0");
    let allOperators = ["+" ,"-", "*", "/"];

    const handleButtonClick = (e) => {
        
        if(e.target && e.target.matches(".numbers")){
            let temp;
            setCalculation((prevState) => {
                if(prevState[0] == "0"){
                    temp = prevState.substring(1, prevState.length);
                    return temp + e.target.innerHTML;
                }
                else  {
                    return prevState + e.target.innerHTML
                }      
            });
        }

        else if(e.target && e.target.matches(".modify")){
            let buttonChoosen = e.target.innerHTML;

            if(buttonChoosen == "AC"){
                setCalculation("0");
            }
            else if (buttonChoosen == "+/-"){                
                setCalculation((prevState) => {                     
                    let prev = Array.from(prevState);          
                    let lastWholeNumber = [];                                   

                    for(let c = prev.length - 1; c >= 0; c--){                      //extracting last whole number from state variable
                        if((prev[c] >= "0" && prev[c] <= "9") || prev[c] == "."){
                            lastWholeNumber.unshift(prev[c]);
                            prev.pop();                           
                        }
                        else{
                            lastWholeNumber.unshift(prev[c]);
                            prev.pop(); 
                            break;
                        }  
                    }

                    let wholeNumber = lastWholeNumber.join("");                 //converting the array to a string

                    if(prev.length == 0){                                                   
                        wholeNumber = wholeNumber[0] ==  "-" ? wholeNumber.replace("-", "") : "-" + wholeNumber;
                        return wholeNumber;
                    }
                    else{
                        let sign = lastWholeNumber.join("")[0];

                        if(sign == "+"){
                            lastWholeNumber.shift();
                            lastWholeNumber.unshift("-");
                        }
                        else if(sign == "-"){
                            lastWholeNumber.shift();
                            if(prev[prev.length - 1] != "*" && prev[prev.length - 1] != "/"){
                                lastWholeNumber.unshift("+"); 
                            }               
                        }
                        else if(sign == "*" || sign == "/")
                            lastWholeNumber.splice(1, 0, "-");
                        
                    } 
                    return prev.join("") + lastWholeNumber.join("");
                })
            }

            else if (buttonChoosen == "%"){
                setCalculation((prevState) =>{
                    let prev = Array.from(prevState);
                    let lastWholeNumber = [];

                    for(let i = prev.length - 1; i >= 0; i--){               //extracting the last whole number from the state variable
                        if(!allOperators.includes(prev[i])){
                            lastWholeNumber.unshift(prev[i]);
                            prev.pop();
                        }                           
                        else 
                            break;
                    }   
                    lastWholeNumber = Number(lastWholeNumber.join("")) / 100;
                    return prev.join("") + lastWholeNumber;
                })
            }

            else if(buttonChoosen == "."){
                setCalculation((prevState) => {
                    let prev = Array.from(prevState);
                    let lastWholeNumber = [];

                    for(let i = prev.length - 1; i >= 0; i--){
                        if(!allOperators.includes(prev[i])){
                            lastWholeNumber.unshift(prev[i])
                            prev.pop();
                        }                        
                        else 
                            break;
                    }
                    if(lastWholeNumber.length == 0) return prevState;
                    else if(lastWholeNumber.includes(".")) return prevState;
                    return prev.join("") + lastWholeNumber.join("") + "."
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
            let calc = preScan(calculation);
            let postfix = infixToPostfix(calc);   
            let result = evaluatePostFix(postfix);
            if(result.includes("."))
                setCalculation(Number(result).toFixed(3));
            else    
                setCalculation(result)
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

export default Calculator;