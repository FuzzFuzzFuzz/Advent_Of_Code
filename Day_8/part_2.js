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

    //console.table(antennas);
    return antennas;
}

// Compute antinodes for antennas with the same frequency
function computeAntinodes(antennas, mapWidth, mapHeight) {

    const antinodes = new Set();

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

                    // Check bounds for the antinodes
                    if (firstOuterX >= 0 && firstOuterX < mapWidth && firstOuterY >= 0 && firstOuterY < mapHeight) {
                        antinodes.add(`${firstOuterX},${firstOuterY}`);
                        // DEBUG
                        console.log(`Added First Outer Antinode: (${firstOuterX}, ${firstOuterY})`);
                    }
                    if (secondOuterX >= 0 && secondOuterX < mapWidth && secondOuterY >= 0 && secondOuterY < mapHeight) {
                        antinodes.add(`${secondOuterX},${secondOuterY}`);
                        // DEBUG
                        console.log(`Added Second Outer Antinode: (${secondOuterX}, ${secondOuterY})`);
                    }
                }
            }
        }
    }
    console.log("Final Antinodes Set:", [...antinodes]);
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
    
    console.log(`Number of unique antinodes: ` + antinodes.size);
}

main();