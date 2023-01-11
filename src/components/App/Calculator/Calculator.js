import React, {useState, useEffect, useRef} from 'react';
import infixToPostfix from './InfixToPostfix';
import evaluatePostFix from './EvaluatePostfix';
import "./styles.css";


function Calculator() {
    const [calculation, setCalculation] = useState("0");
    const unary = useRef("0");                    //this ref is used to differentiate between the negative sign and the minus sign
    let allOperators = ["+" ,"-", "*", "/"];
    const negativeOrPositive = useRef(1);
    const indexOfNegatives = useRef([]);


    const handleButtonClick = (e) => {
        
        if(e.target && e.target.matches(".numbers")){
            let temp;
            setCalculation((prevState) => {
                if(prevState[0] == "0"){
                    temp = prevState.substring(1, prevState.length);
                    unary.current = temp + e.target.innerHTML;
                    return temp + e.target.innerHTML;
                }
                else  {
                    unary.current = prevState + e.target.innerHTML;
                    return prevState + e.target.innerHTML
                }      
            });
        }

        else if(e.target && e.target.matches(".modify")){
            let buttonChoosen = e.target.innerHTML;

            if(buttonChoosen == "AC"){
                unary.current = "0";
                setCalculation("0");
            }
            else if (buttonChoosen == "+/-"){                
                setCalculation((prevState) => {                     
                    let prev = Array.from(prevState);          
                    let lastWholeNumberBinary = [];                                 //array that doesnt differentiate between negative signs and minus signs       
                    let lastWholeNumberUnary = [];                                  //array that differentiates between negative signs and minus signs 

                    for(let c = prev.length - 1; c >= 0; c--){                      //extracting last whole number from state variable
                        if((prev[c] >= "0" && prev[c] <= "9") || prev[c] == "."){
                            lastWholeNumberBinary.unshift(prev[c]);
                            lastWholeNumberUnary.unshift(prev[c])
                            prev.pop();                           
                        }
                        else{
                            lastWholeNumberBinary.unshift(prev[c]);
                            lastWholeNumberUnary.unshift(prev[c])
                            prev.pop(); 
                            break;
                        }  
                    }

                    let wholeNumberBinary = lastWholeNumberBinary.join("");
                    let wholeNumberUnary = lastWholeNumberUnary.join("");

                    if(prev.length == 0){                                                   //this is where i left off
                        wholeNumberBinary = wholeNumberBinary[0] ==  "-" ? wholeNumberBinary.replace("-", "") : "-" + wholeNumberBinary;
                        wholeNumberUnary = wholeNumberUnary[0] ==  "!" ? wholeNumberUnary.replace("!", "") : "!" + wholeNumberUnary;
                        if(wholeNumberUnary.includes("!-")) {
                            wholeNumberUnary = wholeNumberUnary.replace("-", "");
                            console.log("hello");
                        }
                        unary.current = wholeNumberUnary;
                        return wholeNumberBinary;
                    }
                    else{
                        let sign = wholeNumberBinary.join("")[0];

                        if(sign == "+"){
                            lastWholeNumberBinary.shift();
                            lastWholeNumberBinary.unshift("-");
                            lastWholeNumberUnary.shift();
                            lastWholeNumberUnary.unshift("!");
                        }
                        else if(sign == "-"){
                            lastWholeNumberBinary.shift();
                            lastWholeNumberUnary.shift();
                            if(prev[prev.length - 1] != "*" && prev[prev.length - 1] != "/"){
                                lastWholeNumberBinary.unshift("+"); 
                                lastWholeNumberUnary.unshift("+");
                            } 
                            else if(prev[prev.length - 1] == "*" && prev[prev.length - 1] == "/"){
                                lastWholeNumberUnary.unshift("!");
                            }                  
                        }
                        else if(sign == "*" || sign == "/"){
                            lastWholeNumberBinary.splice(1, 0, "-");
                            lastWholeNumberUnary.splice(1, 0, "!");
                        }
                    }
                    unary.current = prev.join("") +  lastWholeNumberUnary.join("");  
                    return prev.join("") + lastWholeNumberBinary.join("");
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
                    unary.current = prev.join("") + lastWholeNumber;
                    return prev.join("") + lastWholeNumber;
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
                    unary.current = temp;
                    return temp;                    
                }
                else{
                    unary.current = prevState + operatorChoosen;
                    return prevState + operatorChoosen;
                }
                    
            })
        }

        else if(e.target && e.target.matches("#calculate")){
            console.log(unary.current);
            return;
            if(!Number(calculation[calculation.length - 1])) {
                alert("Please complete the expression by entering another number");
                return;
            }
            let calc = "";
            for(let i = 0; i < calculation.length; i++){                                            
                if(!indexOfNegatives.current.includes(i))
                    calc += calculation[i];
            }
            let postfix = infixToPostfix(calc);   
            let result = evaluatePostFix(postfix);
            result = (Number(result) * negativeOrPositive.current) + "";
            if(result.includes("."))
                setCalculation(Number(result).toFixed(3));
            else    
                setCalculation(result)

            indexOfNegatives.current = [];
            negativeOrPositive.current = 1;
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