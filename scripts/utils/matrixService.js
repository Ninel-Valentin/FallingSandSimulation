export default class utils {
    static GetEmptyMatrix(rows, cols) {
        const newMatrix = new Array(rows);
        for (let i = 0; i < rows; i++)
            newMatrix[i] = new Array(cols).fill(0);
        return newMatrix;
    }

    static GetClonedMatrix(oldMatrix, rows, cols) {
        const newMatrix = new Array(rows);
        for (let i = 0; i < rows; i++) {
            newMatrix[i] = new Array(cols).fill(0);
            for (let j = 0; j < cols; j++)
                if (oldMatrix?.[i]?.[j])
                    newMatrix[i][j] = oldMatrix[i][j];
        }

        return newMatrix;
    }
};