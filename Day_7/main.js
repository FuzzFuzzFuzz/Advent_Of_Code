const fs = require("fs");

// Main function to read input and process
function main() {
    
    // Read input data from a file
    const filePath = "Day_7/input.txt";
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Split content into lines and filter out empty lines
    const equations = fileContent.split("\n").filter((line) => line.trim() !== "");
    console.log("Input Translation: ", equations);

}

main();
