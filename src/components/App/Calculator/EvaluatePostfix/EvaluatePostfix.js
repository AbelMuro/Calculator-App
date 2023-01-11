//This algorithm will read a postfix formatted expression 
//and use a stack data structure to evaluate the expression


function evaluatePostFix (s) {
    let stack = [];
    let wholeNumber = "";
    let currentChar;
    for(let i = 0; i < s.length; i++){
        currentChar = s[i];
        if((currentChar >= "0" && currentChar <= "9") || currentChar == ".")
            wholeNumber += currentChar;
        else if(currentChar == "!")
            wholeNumber += "-";
            
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

export default evaluatePostFix;