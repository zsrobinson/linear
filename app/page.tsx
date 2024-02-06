"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { BlockMath } from "react-katex";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <main className="m-8 flex flex-col items-start gap-4">
      <h2 className="text-lg font-semibold">
        Reduced Row Echolon Form Proof of Concept
      </h2>

      <p>
        Enter your original matrix below with spaces between each element and
        each row on separate lines.
      </p>

      <Textarea
        className="min-h-24 max-w-96 font-mono"
        placeholder="1 2 3&#10;4 5 6"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOutput("");
        }}
      />

      <Button
        onClick={() => {
          const matrix = strToMatrix(input);
          reducedEcholonForm(matrix);
          setOutput(matrix.map((row) => row.join(" ")).join("\n"));
        }}
      >
        Reduce
      </Button>

      {output ? (
        <BlockMath
          math={
            matrixToLatex(strToMatrix(input)) +
            "\\implies" +
            matrixToLatex(strToMatrix(output))
          }
        />
      ) : (
        input !== "" && <BlockMath math={matrixToLatex(strToMatrix(input))} />
      )}
    </main>
  );
}

function reducedEcholonForm(matrix: number[][]) {
  // STEP 4: repeat 1-3 until all rows are processed
  for (let currRow = 0; currRow < matrix.length; currRow++) {
    // STEP 1: start with first non-zero column as pivot
    const pivotPos = getFirstNonZeroCol(matrix, currRow);

    // STEP 2: swap rows to bring non-zero term to pivot
    if (matrix[currRow][pivotPos] === 0) {
      for (let i = currRow + 1; i < matrix.length; i++) {
        if (matrix[i][pivotPos] === 0) continue;
        interchangeRows(matrix, currRow, i);
      }
    }

    // STEP 3: perform row operations to clear below pivot
    for (let i = currRow + 1; i < matrix.length; i++) {
      if (matrix[i][pivotPos] === 0) continue;

      const scalar = -1 * (matrix[i][pivotPos] / matrix[currRow][pivotPos]);
      replaceRows(matrix, i, currRow, scalar);
    }
  }

  // STEP 5: working backwards, generate zeros above each pivot
  for (let currRow = matrix.length - 1; currRow >= 0; currRow--) {
    const pivotPos = getFirstNonZeroCol(matrix, currRow);

    // scale current row so that pivot is 1
    if (matrix[currRow][pivotPos] !== 1) {
      scaleRow(matrix, currRow, 1 / matrix[currRow][pivotPos]);
    }

    for (let i = currRow - 1; i >= 0; i--) {
      if (matrix[i][pivotPos] === 0) continue;

      const scalar = -1 * (matrix[i][pivotPos] / matrix[currRow][pivotPos]);
      replaceRows(matrix, i, currRow, scalar);
    }
  }
}

function getFirstNonZeroCol(matrix: number[][], startingRow = 0) {
  for (let i = startingRow; i < matrix[startingRow].length; i++) {
    for (let j = startingRow; j < matrix.length; j++) {
      if (matrix[j][i] !== startingRow) continue;
    }
    return i;
  }
  return -1;
}

function getPivotPos(row: number[]) {
  for (let i = 0; i < row.length; i++) {
    if (row[i] !== 0) return i;
  }
  return -1;
}

/** Replaces `rowA` by the sum of itself and `rowB` * `scalar`. */
function replaceRows(
  matrix: number[][],
  rowA: number,
  rowB: number,
  scalar: number,
) {
  for (let i = 0; i < matrix[rowA].length; i++) {
    matrix[rowA][i] += scalar * matrix[rowB][i];
  }
}

/** Switches the positions of `rowA` and `rowB`. */
function interchangeRows(matrix: number[][], rowA: number, rowB: number) {
  const tmp = matrix[rowA];
  matrix[rowA] = matrix[rowB];
  matrix[rowB] = tmp;
}

/** Multiples all entries in `row` by `scalar` */
function scaleRow(matrix: number[][], row: number, scalar: number) {
  for (let i = 0; i < matrix[row].length; i++) {
    matrix[row][i] *= scalar;
  }
}

function strToMatrix(str: string) {
  return str.split("\n").map((row) =>
    row
      .split(" ")
      .filter((n) => n.length > 0 && n !== "-")
      .map((n) => Number(n)),
  );
}

function matrixToLatex(matrix: number[][]) {
  let latex = "\\begin{bmatrix} ";
  for (let i = 0; i < matrix.length; i++) {
    latex += matrix[i].map(formatNum).join(" & ") + "\\\\";
  }
  return latex + "\\end{bmatrix}";
}

function formatNum(n: number) {
  if (isNaN(n)) return "\text{NaN}";
  return String(Math.round(n * 1e3) / 1e3);
}
