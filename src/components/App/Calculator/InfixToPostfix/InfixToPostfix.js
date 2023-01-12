//keep in mind that the bottom of the stack has operators with the least precedence
//and the top of the stack has operators with the most precedence
//if the top of the stack has less precedence that an operator from the string
//then we will keep popping the top of the stack until the top of the stack has less precedence than
//the operator from the string

function infixToPostfix(s) {
    let stack = []; 
    let result = "";

    const precedence = (c) => {
        if(c == '×')
            return 4;
        else if(c == '÷')
            return 3;
        else if(c == '+')
            return 2;
        else if(c == '-')
            return 1;
        else
            return -1;
    }

    for(let i = 0; i < s.length; i++) {
        let c = s[i];

        if((c >= '0' && c <= '9') || c == "." || c == "!")                      // If the scanned character is a operand, add it to output string. (remember that ! means a negative number)
            result += c;
        else {                                                                  // If an operator is scanned, we push it on top of the stack
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
        
    while(stack.length != 0) {                                      // Pop all the remaining elements from the stack
        result += stack[stack.length - 1];
        stack.pop();
    }

    return result;
}

export default infixToPostfix