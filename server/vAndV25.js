function cutTrees(matrix) {
  let min = +Infinity;
  let minx = 0;
  let miny = 0;
  let TreeCount = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] > 0) {
        TreeCount++;
        if (matrix[i][j] > 1 && matrix[i][j] < min) {
          min = matrix[i][j];
          minx = i;
          miny = j;
        }
      }
    }
  }

  // minx, miny, total # trees

  function findViableMin(array, value) {
    let moves = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i] === undefined) {
        continue;
      }
      if (array[i] > 0 && array[i] < value) {
        moves.push(array[i]);
      }
    }

    if (moves.length === 0) {
      return -1;
    }

    return moves;
  }
  // return the min value greater than 0, if it exists; else -1


  function pathFinder(startx, starty, count = 0, treeCount = 0) {

    if (treeCount === TreeCount) {
      return count;
    }

    let moves = [matrix[startx + 1, starty], matrix[startx - 1, starty], matrix[startx, starty - 1], matrix[startx, starty - 1]];

    let nextMoves = findViableMin(moves);
    // array of possible moves

    return Math.min(pathFinder())



  }

}
