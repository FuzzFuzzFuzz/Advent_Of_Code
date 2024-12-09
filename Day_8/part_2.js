//const { Console } = require('console');
const fs = require('fs');

// Find antennas and their positions
function findAntennas(map) {

    const antennas = [];
    // Iterate through whole map to ignore "."s
    for (let y = 0; y < map.length; y++) {

        for (let x = 0; x < map[y].length; x++) {

            if (map[y][x] !== '.') {

                // Any antennas pushed into array with this format
                // Reminder that freq is unique letter or digit
                antennas.push({ x, y, freq: map[y][x] });
            }
        }
    }
    return antennas;
}

// Compute antinodes for antennas with the same frequency
function computeAntinodes(antennas, mapWidth, mapHeight) {

    const antinodes = new Set();
    var antennaAntinodes = 0;

    const freqMap = {};
    // Group antennas by frequency  
    for (const antenna of antennas) {

        if (!freqMap[antenna.freq]) freqMap[antenna.freq] = [];

        freqMap[antenna.freq].push(antenna);

    }
    // DEBUG
    console.log(JSON.stringify(freqMap));

    // For each frequency group, calculate antinodes
    for (const freq in freqMap) {

        const group = freqMap[freq];

        // Part 2 Adjustment
        // Treat each antenna as an antinode to add to total later
        if (group.length > 1) {
            antennaAntinodes += group.length;
        }

        // Check every pair of antennas in the group
        for (let i = 0; i < group.length; i++) {

            for (let j = 0; j < group.length; j++) {
                
                if (i === j) continue;

                const a1 = group[i];
                const a2 = group[j];

                // Calculate differences
                const dx = a2.x - a1.x;
                const dy = a2.y - a1.y;

                // DEBUG
                console.log(`Checking Pair: (${a1.x}, ${a1.y}) <-> (${a2.x}, ${a2.y})`);

                const totalDistance = Math.abs(dx) + Math.abs(dy);

                // Ensure the distance is valid and search map top to bottom
                if (totalDistance >= 2 && (a1.y < a2.y)) {

                    var firstOuterX = 0;
                    var firstOuterY = 0;
                    var secondOuterX = 0;
                    var secondOuterY = 0;

                    // Prepare coord adjustment values to find antinodes
                    ddx = Math.abs(dx);
                    ddy = Math.abs(dy);

                    // Up-Left -> Down-Right
                    if (a1.x < a2.x) {

                        firstOuterX = a1.x - ddx;
                        firstOuterY = a1.y - ddy;
                        secondOuterX = a2.x + ddx;
                        secondOuterY = a2.y + ddy;
                    }
                    // Up-Right -> Down-Left
                    else if (a1.x > a2.x) {

                        firstOuterX = a1.x + ddx;
                        firstOuterY = a1.y - ddy;
                        secondOuterX = a2.x - ddx;
                        secondOuterY = a2.y + ddy;
                    }
                    // Level on X
                    else {

                        firstOuterX = a1.x;
                        firstOuterY = a1.y - ddy;
                        secondOuterX = a2.x;
                        secondOuterY = a2.y + ddy;
                    }

                    // DEBUG
                    console.log(`Valid Pair. Antinode Locations: (${firstOuterX}, ${firstOuterY}), (${secondOuterX}, ${secondOuterY})`);

                    var firstEdgeFound = false;
                    var secondEdgeFound = false;

                    // Check bounds for the antinodes
                    if (firstOuterX >= 0 && firstOuterX < mapWidth && firstOuterY >= 0 && firstOuterY < mapHeight) {
                        antinodes.add(`${firstOuterX},${firstOuterY}`);
                        // DEBUG
                        console.log(`Added First Outer Antinode: (${firstOuterX}, ${firstOuterY})`);
                    }
                    else {
                        var firstEdgeFound = true;
                    }
                    if (secondOuterX >= 0 && secondOuterX < mapWidth && secondOuterY >= 0 && secondOuterY < mapHeight) {
                        antinodes.add(`${secondOuterX},${secondOuterY}`);
                        // DEBUG
                        console.log(`Added Second Outer Antinode: (${secondOuterX}, ${secondOuterY})`);
                    }
                    else {
                        var secondEdgeFound = true;
                    }

                    // Part 2 Main Adjustment
                    // Keep finding antinodes until edge of map reached
                    while (firstEdgeFound == false || secondEdgeFound == false) {
                        
                        if (firstEdgeFound == false) {

                            // Up-Left -> Down-Right
                            if (a1.x < a2.x) {
                                firstOuterX -= ddx;
                                firstOuterY -= ddy;
                            }
                            // Up-Right -> Down-Left
                            else if (a1.x > a2.x) {
                                firstOuterX += ddx;
                                firstOuterY -= ddy;
                            }
                            // Level on X
                            else {
                                firstOuterX = a1.x;
                                firstOuterY -= ddy;
                            }

                            // Check bounds for the antinodes
                            if (firstOuterX >= 0 && firstOuterX < mapWidth && firstOuterY >= 0 && firstOuterY < mapHeight) {
                                antinodes.add(`${firstOuterX},${firstOuterY}`);
                                // DEBUG
                                console.log(`Added First Outer Antinode: (${firstOuterX}, ${firstOuterY})`);
                            }
                            else {
                                var firstEdgeFound = true;
                            }
                        }
                        else if (secondEdgeFound == false) {

                            // Up-Left -> Down-Right
                            if (a1.x < a2.x) {
                                secondOuterX += ddx;
                                secondOuterY += ddy;
                            }
                            // Up-Right -> Down-Left
                            else if (a1.x > a2.x) {
                                secondOuterX -= ddx;
                                secondOuterY += ddy;
                            }
                            // Level on X
                            else {
                                secondOuterX = a2.x;
                                secondOuterY += ddy;
                            }

                            // Check bounds for the antinodes
                            if (secondOuterX >= 0 && secondOuterX < mapWidth && secondOuterY >= 0 && secondOuterY < mapHeight) {
                                antinodes.add(`${secondOuterX},${secondOuterY}`);
                                // DEBUG
                                console.log(`Added Second Outer Antinode: (${secondOuterX}, ${secondOuterY})`);
                            }
                            else {
                                var secondEdgeFound = true;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
    }

    // Part 2 Adjustment
    // Remove duplicate antenna antinodes from antinode set
    for (const freqQ in freqMap) {
        const groupQ = freqMap[freqQ];
        for (let k = 0; k < groupQ.length; k++) {
            const b1 = groupQ[k];
            antinodes.delete(`${b1.x},${b1.y}`);
        }
    }

    
    // ANSWER SECTION
    // Array of Antinodes
    console.log("Final Antinodes Set:", [...antinodes]);
    // Count of Antenna Antinodes
    console.log("Antenna Antinodes: " + antennaAntinodes);
    // Count of Actual Antinodes
    console.log("Number of unique Antinodes: " + antinodes.size);
    // Total Antinodes
    console.log("Total Antinodes: " + (antinodes.size + antennaAntinodes));

    return antinodes;
}

// Main
function main() {

    // Input filepath
    const filePath = 'Day_8/input.txt';

    // Trim into usable map
    const map = fs.readFileSync(filePath, 'utf8').trim().split('\n').map(line => line.split(''));

    // DEBUG
    console.table(map);

    // Start helper function to find antennas
    const antennas = findAntennas(map);

    const mapWidth = map[0].length;
    const mapHeight = map.length;
    
    const antinodes = computeAntinodes(antennas, mapWidth, mapHeight);
    
    //console.log("Number of unique antinodes: " + antinodes.size);
}

main();