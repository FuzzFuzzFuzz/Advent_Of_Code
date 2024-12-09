const fs = require("fs");

function parseDiskMap(diskMap) {
    const blocks = [];
    let fileID = 0;

    for (let i = 0; i < diskMap.length; i += 2) {

        const fileSize = Number(diskMap[i]);
        const freeSpace = Number(diskMap[i + 1]);

        // Add file blocks with the file ID
        for (let j = 0; j < fileSize; j++) {
            blocks.push(fileID);
        }

        // Add free space blocks
        for (let j = 0; j < freeSpace; j++) {
            blocks.push('.');
        }

        // Increment file ID
        fileID++;
    }

    return blocks;
}

// Input filepath
const filePath = '2024/Day_9/input.txt';

// Read input from a text file
const diskMap = fs.readFileSync(filePath, 'utf8').trim();

// Parse DiskMap from file
const blocks = parseDiskMap(diskMap);
console.log("Blocks: " + blocks);


