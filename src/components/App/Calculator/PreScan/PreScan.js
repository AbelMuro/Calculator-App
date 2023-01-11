
//this function will scan the state variable and replace any negative values with !
//keep in mind that the minus sign is only a negative IF its next to the * or / operators
//OR if its next to the FIRST number in the string
function preScan (s) {
    let sArray = Array.from(s);

    if(s.includes("*-") || s.includes("\-/") || s[0] === "-"){
        if(sArray[0] === "-")
            sArray[0] = "!";

        for(let i = 0; i < sArray.length; i++){
            if(sArray[i] === "*" && sArray[i + 1] === "-")
                sArray[i + 1] = "!"
            else if(sArray[i] === "/" && sArray[i + 1] === "-")
                sArray[i + 1] = "!";
        }

        return sArray.join("");
    }
    else
        return s;



}


export default preScan;