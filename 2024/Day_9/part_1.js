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

function compressBlocks(blocks) {
    
    var tail = blocks.length-1;

    // i is Head
    // tail is Tail
    for (let i = 0; i <= blocks.length; i++) {

        // Data already fills Head position
        if (blocks[i] != '.') {
            continue;
        }

        // If no data at Tail, find nearest
        if (blocks[tail] == '.') {
            while (blocks[tail] == '.') {
                tail--;
            }
        }

        // If Tail passed Head to find data, we are finished
        if (i >= tail) {
            break;
        }

        // Move Tail data to Head free space
        blocks[i] = blocks[tail];
        blocks[tail] = '.';
        tail--;
    }

    return blocks;
}

function calculateChecksum(compBlocks) {
    
    var totalChecksum = 0;

    for (let j = 0; j <= compBlocks.length; j++) {

        // Find the start of free space
        if (compBlocks[j] == '.') {
            break;
        }

        totalChecksum += (j * compBlocks[j]);
    }

    return totalChecksum;
}

// Input filepath
const filePath = '2024/Day_9/input.txt';

// Read input from a text file
const diskMap = fs.readFileSync(filePath, 'utf8').trim();

// Parse DiskMap from file
const blocks = parseDiskMap(diskMap);
console.log(`Blocks: ${blocks}`);

// Compress blocks
const compBlocks = compressBlocks(blocks);
console.log(`Compressed Blocks: ${compBlocks}`);

// Calculate Checksum
const checksum = calculateChecksum(compBlocks);
console.log(`Calculated Checksum: ${checksum}`);
