const fs = require('fs');

// Function to load, decode, and parse data points from JSON file
function solveSecret(filename) {
    const jsonData = JSON.parse(fs.readFileSync(filename, 'utf8'));

    // Extract number of points (n) and minimum points required (k)
    const numPoints = jsonData.keys.n;
    const minPointsRequired = jsonData.keys.k;
    let decodedPoints = [];

    // Decode each point
    for (let index = 1; index <= numPoints; index++) {
        if (jsonData[index]) {
            const xValue = index;
            const baseOfY = parseInt(jsonData[index].base, 10);
            const encodedY = jsonData[index].value;
            const decodedY = parseInt(encodedY, baseOfY);
            decodedPoints.push({ x: xValue, y: decodedY });
        }
    }

    // Limit points to only those required (first k points)
    decodedPoints = decodedPoints.slice(0, minPointsRequired);

    // Function to calculate the constant term using Lagrange Interpolation
    function findConstantTerm(pointsArray) {
        let constantC = 0;

        pointsArray.forEach((pointI, i) => {
            const xi = pointI.x;
            const yi = pointI.y;
            let productTerm = yi;

            pointsArray.forEach((pointJ, j) => {
                if (i !== j) {
                    const xj = pointJ.x;
                    productTerm *= (0 - xj) / (xi - xj);  // Evaluate at x = 0 for constant term
                }
            });

            constantC += productTerm;
        });

        return Math.round(constantC);  // Rounding to nearest integer
    }

    // Calculate the constant term (secret)
    return findConstantTerm(decodedPoints);
}

// Process the test cases and display results
const inputFiles = ['testcase1.json', 'testcase2.json'];

inputFiles.forEach((file, idx) => {
    const result = solveSecret(file);
    console.log(`The secret (constant term c) for Test Case ${idx + 1} is: ${result}`);
});
