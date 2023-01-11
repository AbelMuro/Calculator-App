
function infixToPostfix(s) {
    let stack = []; 
    let result = "";

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
        
    while(stack.length != 0) {              // Pop all the remaining elements from the stack
        result += stack[stack.length - 1];
        stack.pop();
    }

    return result;
    
}

export default infixToPostfix