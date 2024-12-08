const fs = require("fs");

function calculateCalibrationSum(equations) {
    
    let totalCalibrationSum = 0;

    // Helper function to evaluate the expression left-to-right
    function evaluateExpression(numbers, operators) {

        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === "+") {
            result += numbers[i + 1];
            } else if (operators[i] === "*") {
            result *= numbers[i + 1];
            }
        }
        return result;
    }
  
    // Generate all possible operator combinations for a given number of slots
    function generateOperatorCombinations(n) {

        // Operator values
        const ops = ["+", "*"];

        // Provide possible operators and possible slots to helper function
        return product(ops, n);
    }
  
    // Cartesian product for generating operator combinations
    // e.g. [["+", "+"], ["+", "*"], ["*", "+"], ["*", "*"]]
    function product(items, length) {

        // Base Case
        if (length === 0) return [[]];

        // Recursive step
        const smaller = product(items, length - 1);

        return smaller.flatMap((s) => items.map((item) => [...s, item]));
    }
  
    // Process each equation
    for (const equation of equations) {
        
        // Split from colon
        const [target, numbersString] = equation.split(": ");

        // Convert string to int
        const targetValue = parseInt(target, 10);

        // Split all other numbers not the test value
        const numbers = numbersString.split(" ").map(Number);
        
        // How many slots for operators
        const operatorSlots = numbers.length - 1;

        // Generate combinations with helper function
        const operatorCombinations = generateOperatorCombinations(operatorSlots);
    
        // Check if any operator combination matches the target
        let isValid = false;
        for (const operators of operatorCombinations) {

            // Evaluate generated expression 
            if (evaluateExpression(numbers, operators) === targetValue) {
                
                // If target value found, generated expression valid
                isValid = true;
                break;
            }
        }
    
        // If valid, add to the total calibration sum
        if (isValid) {
            totalCalibrationSum += targetValue;
        }
    }

    return totalCalibrationSum;
}

// Main function to read input and process
function main() {
    
    // Read input data from a file
    const filePath = "Day_7/input.txt";
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Split content into lines and filter out empty lines
    const equations = fileContent.split("\n").filter((line) => line.trim() !== "");
    //console.log("Input Translation: ", equations);

    // Calculate the total calibration sum
    const result = calculateCalibrationSum(equations);
    console.log("Total Calibration Result:", result);

}

main();
