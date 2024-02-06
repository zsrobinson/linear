"use client";

import { useEffect, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [operations, setOperations] = useState<RowOperation[]>([]);
  const [detailed, setDetailed] = useState(false);

  useEffect(() => setOutput(""), [input]);

  return (
    <main className="m-8 flex flex-col items-start gap-4">
      <h2 className="text-lg font-semibold">
        Reduced Row Echolon Form Proof of Concept
      </h2>

      <p>
        Enter your original matrix in the text area below with spaces between
        each element and rows on separate lines. Or, check out some of the
        examples.
      </p>

      <div className="flex gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInput("2 4 1 3\n6 2 3 9\n1 1 1 1")}
        >
          Example 1
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setInput("0 -7 -4 2\n2 4 6 12\n3 1 -1 -2")}
        >
          Example 2
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setInput("2 1 12 1\n1 2 9 -1")}
        >
          Example 3
        </Button>
      </div>

      <Textarea
        className="min-h-24 max-w-96 font-mono"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />

      <div className="flex gap-4">
        <Button
          onClick={() => {
            const matrix = strToMatrix(input);
            const operations = reducedEcholonForm(matrix);
            setOutput(matrix.map((row) => row.join(" ")).join("\n"));
            setOperations(operations);
          }}
        >
          Reduce
        </Button>

        <Button onClick={() => setInput("")} variant="secondary">
          Clear
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="detailed"
          checked={detailed}
          onCheckedChange={() => setDetailed((c) => !c)}
        />
        <Label htmlFor="detailed">Step-by-step mode</Label>
      </div>

      {output ? (
        <>
          <BlockMath
            math={
              matrixToLatex(strToMatrix(input)) +
              "\\implies" +
              matrixToLatex(strToMatrix(output))
            }
          />

          <ol>
            {operations.map((opr, i) => (
              <li key={i}>
                <InlineMath math={operationToLatex(opr)} />
                {detailed && (
                  <div className="p-2 pb-4 pl-4">
                    <InlineMath math={matrixToLatex(opr.matrix)} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </>
      ) : (
        input !== "" && <BlockMath math={matrixToLatex(strToMatrix(input))} />
      )}
    </main>
  );
}

/**
 * Performs the row reduction algorithm on the provided matrix to convert it to
 * reduced row echolon form. Row operations will mutate the original matrix,
 * and a list of row operations performed will be returned.
 */
function reducedEcholonForm(matrix: number[][]) {
  const opr = new MatrixOperator(matrix);

  // STEP 4: repeat 1-3 until all rows are processed
  for (let currRow = 0; currRow < matrix.length; currRow++) {
    // STEP 1: start with first non-zero column as pivot
    const pivotPos = getFirstNonZeroCol(matrix, currRow);

    // STEP 2: swap rows to bring non-zero term to pivot
    if (matrix[currRow][pivotPos] === 0) {
      for (let i = currRow + 1; i < matrix.length; i++) {
        if (matrix[i][pivotPos] === 0) continue;
        opr.interchange(currRow, i);
        break;
      }
    }

    // STEP 3: perform row operations to clear below pivot
    for (let i = currRow + 1; i < matrix.length; i++) {
      if (matrix[i][pivotPos] === 0) continue;

      const scalar = -1 * (matrix[i][pivotPos] / matrix[currRow][pivotPos]);
      opr.replace(i, currRow, scalar);
    }
  }

  // STEP 5: working backwards, generate zeros above each pivot
  for (let currRow = matrix.length - 1; currRow >= 0; currRow--) {
    const pivotPos = getFirstNonZeroCol(matrix, currRow);

    // scale current row so that pivot is 1
    if (matrix[currRow][pivotPos] !== 1) {
      opr.scale(currRow, 1 / matrix[currRow][pivotPos]);
    }

    for (let i = currRow - 1; i >= 0; i--) {
      if (matrix[i][pivotPos] === 0) continue;

      const scalar = -1 * (matrix[i][pivotPos] / matrix[currRow][pivotPos]);
      opr.replace(i, currRow, scalar);
    }
  }

  return opr.operations;
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

function operationToLatex(opr: RowOperation): string {
  switch (opr.type) {
    case "replace":
      return `R_${opr.rowA + 1} \\gets R_${opr.rowA + 1} + R_${opr.rowB + 1} * ${formatNum(opr.scalar)}`;
    case "interchange":
      return `R_${opr.rowA + 1} \\leftrightarrow R_${opr.rowB + 1}`;
    case "scale":
      return `R_${opr.row + 1} \\gets R_${opr.row + 1} * ${formatNum(opr.scalar)}`;
  }
}

function formatNum(n: number) {
  if (isNaN(n)) return "\text{NaN}";
  return String(Math.round(n * 1e3) / 1e3);
}

type RowOperation = (
  | { type: "replace"; rowA: number; rowB: number; scalar: number }
  | { type: "interchange"; rowA: number; rowB: number }
  | { type: "scale"; row: number; scalar: number }
) & { matrix: number[][] };

/** Tools to perform row operations on a given matrix and record the process. */
class MatrixOperator {
  matrix: number[][];
  operations: RowOperation[];

  constructor(matrix: number[][]) {
    this.matrix = matrix;
    this.operations = [];
  }

  /** Replaces `rowA` by the sum of itself and `rowB` * `scalar`. */
  replace(rowA: number, rowB: number, scalar: number) {
    for (let i = 0; i < this.matrix[rowA].length; i++) {
      this.matrix[rowA][i] += scalar * this.matrix[rowB][i];
    }

    this.operations.push({
      type: "replace",
      rowA,
      rowB,
      scalar,
      matrix: this.matrixClone(),
    });
  }

  /** Switches the positions of `rowA` and `rowB`. */
  interchange(rowA: number, rowB: number) {
    const tmp = this.matrix[rowA];
    this.matrix[rowA] = this.matrix[rowB];
    this.matrix[rowB] = tmp;

    this.operations.push({
      type: "interchange",
      rowA,
      rowB,
      matrix: this.matrixClone(),
    });
  }

  /** Multiples all entries in `row` by `scalar` */
  scale(row: number, scalar: number) {
    for (let i = 0; i < this.matrix[row].length; i++) {
      this.matrix[row][i] *= scalar;
    }

    this.operations.push({
      type: "scale",
      row,
      scalar,
      matrix: this.matrixClone(),
    });
  }

  matrixClone() {
    return JSON.parse(JSON.stringify(this.matrix));
  }
}
