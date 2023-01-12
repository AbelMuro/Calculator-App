import React, {useState, useEffect, useRef} from 'react';
import infixToPostfix from './InfixToPostfix';
import evaluatePostFix from './EvaluatePostfix';
import preScan from './PreScan';
import "./styles.css";


//TODO: find out why there are so many spaces in the state variable

function Calculator() {
    const [calculation, setCalculation] = useState("0");
    let allOperators = ["+" ,"-", "×", "÷"];
    const resetCalculation = useRef(false);
    const changeOperation = useRef(false);
    //console.log(calculation);

    const handleButtonClick = (e) => {
        
        if(e.target && !e.target.matches(".operator"))              //this is only used when the user clicks on an operator button but then clicks on a non-operator button,
            changeOperation.current = false


        if(e.target && e.target.matches(".numbers")){
            setCalculation((prevState) => {
                let temp; 
                if(resetCalculation.current) {
                    resetCalculation.current = false;
                    return e.target.innerHTML;
                }
                if(prevState[0] == "0"){
                    temp = prevState.substring(1, prevState.length);
                    return temp + e.target.innerHTML;
                }
                else  
                    return prevState + e.target.innerHTML;               
            });
        }

        else if(e.target && e.target.matches(".modify")){
            resetCalculation.current = false;
            let buttonChoosen = e.target.innerHTML;

            if(buttonChoosen == "AC"){
                setCalculation("0");
            }
            else if (buttonChoosen == "+/-"){   
                if(!Number(calculation[calculation.length - 1])) return;         
                setCalculation((prevState) => {                     
                    let prev = Array.from(prevState);          
                    let lastWholeNumber = []; 
                    let isSpace;                                  

                    for(let c = prev.length - 1; c >= 0; c--){                      //the whole point of this for loop is to extract the last whole number from the state.
                        if((prev[c] >= "0" && prev[c] <= "9") || prev[c] == "."){   //everything before the last whole number will be stored in prev
                            lastWholeNumber.unshift(prev[c]);                       // EX: 8 + 3 - 5       ->  prev = 8 + 3 -          lastWholeNumber = 5
                            prev.pop();                                             //             (we later extract the minus sign in prev ) 
                        }
                        else {
                            isSpace = prev.pop();                                   //we also remove the extra space here between prev and lastwholenumber, but we don't include it in lastWholeNumber
                            break;
                        }
                            
                    }
                    let wholeNumber = lastWholeNumber.join("");              
                    if(prev.length == 0){  
                        wholeNumber = isSpace === "-" ?  wholeNumber :  "-" + wholeNumber                             
                        return wholeNumber;
                    }
                    else{
                        let sign = prev[prev.length - 1];
                        if(sign == "+"){
                            prev.pop();
                            lastWholeNumber.unshift("- ");
                        }
                        else if(sign == "-"){
                            prev.pop();
                            if(prev[prev.length - 1] != "×" && prev[prev.length - 1] != "÷")
                                lastWholeNumber.unshift("+ ");
                        }
                        else if(sign == "×" || sign == "÷")
                            lastWholeNumber.unshift(" -");
                        
                    } 
                    return prev.join("") + lastWholeNumber.join("");
                })
            }
            else if (buttonChoosen == "%"){
                setCalculation((prevState) =>{
                    let prev = Array.from(prevState);
                    let lastWholeNumber = [];

                    for(let i = prev.length - 1; i >= 0; i--){               //extracting the last whole number from the state variable string
                        if((prev[i] >= "0" && prev[i] <= "9") || prev[i] == "."){
                            lastWholeNumber.unshift(prev[i]);
                            prev.pop();
                        }                           
                        else {
                            break;
                        }
                            
                    }   
                    if(!Number(lastWholeNumber.join(""))) return prevState;
                    else if(lastWholeNumber.includes("e")) return prevState;
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
                    else if(!Number(lastWholeNumber.join(""))) return prevState;
                    else if(lastWholeNumber.includes(".")) return prevState;
                    return prev.join("") + " " + lastWholeNumber.join("") + ".";
                })
            }

        }

        else if(e.target && e.target.matches(".operator")){
            resetCalculation.current = false;
            if(calculation[calculation.length - 1] == ".") 
                return; 

            //need to refactor this bit of code
            setCalculation((prevState) => {           
                let operatorChoosen = e.target.innerHTML;
                let temp;
                if(changeOperation.current){                                     //                 BEFORE SLICE                           AFTER SLICE
                    temp = prevState.slice(0, prevState.length - 2);             //EX:      prevState = "45 x 56 + "    ->   temp = "45 x 56 "     and     operatorChoosen = "-"
                    temp += operatorChoosen;                                     //         newState = 45 x 56 -
                    return " " + temp + " ";                    
                }
                else{
                    changeOperation.current = true;
                    return prevState + " " + operatorChoosen + " ";
                }
                    
            })
        }

        else if(e.target && e.target.matches("#calculate")){
            if(!Number(calculation[calculation.length - 1])) {
                alert("Please complete the expression by entering another number");
                return;
            }
            resetCalculation.current = true;
            let calc = preScan(calculation.replaceAll(" ", ""));
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
                    &divide;
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
                    &times;
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