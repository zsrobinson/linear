"use client";

import Fraction from "fraction.js";
import { useEffect, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [operations, setOperations] = useState<RowOperationWithMatrix[]>([]);
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
              <li key={i} className="pb-0.5">
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
function reducedEcholonForm(matrix: Fraction[][]) {
  const opr = new MatrixOperator(matrix);

  // STEP 4: repeat 1-3 until all rows are processed
  for (let currRow = 0; currRow < matrix.length; currRow++) {
    // STEP 1: start with first non-zero column as pivot
    const pivotPos = getFirstNonZeroCol(matrix, currRow);
    if (pivotPos === -1) continue;

    // STEP 2: swap rows to bring non-zero term to pivot
    if (matrix[currRow][pivotPos].equals(0)) {
      for (let i = currRow + 1; i < matrix.length; i++) {
        if (matrix[i][pivotPos].equals(0)) continue;
        opr.interchange(currRow, i);
        break;
      }
    }

    // STEP 3: perform row operations to clear below pivot
    for (let i = currRow + 1; i < matrix.length; i++) {
      if (matrix[i][pivotPos].equals(0)) continue;

      const scalar = matrix[i][pivotPos].div(matrix[currRow][pivotPos]).mul(-1);
      opr.replace(i, currRow, scalar);
    }
  }

  // STEP 5: working backwards, generate zeros above each pivot
  for (let currRow = matrix.length - 1; currRow >= 0; currRow--) {
    const pivotPos = getFirstNonZeroCol(matrix, currRow);
    if (pivotPos === -1) continue;

    // scale current row so that pivot is 1
    if (!matrix[currRow][pivotPos].equals(1)) {
      opr.scale(currRow, matrix[currRow][pivotPos].inverse());
    }

    for (let i = currRow - 1; i >= 0; i--) {
      if (matrix[i][pivotPos].equals(0)) continue;

      const scalar = matrix[i][pivotPos].div(matrix[currRow][pivotPos]).mul(-1);
      opr.replace(i, currRow, scalar);
    }
  }

  return opr.operations;
}

function getFirstNonZeroCol(matrix: Fraction[][], startingRow: number) {
  for (let i = 0; i < matrix[0].length; i++) {
    let allZeros = true;
    for (let j = startingRow; j < matrix.length; j++) {
      if (matrix[j][i].n !== 0) allZeros = false;
    }
    if (!allZeros) return i;
  }
  return -1;
}

function strToMatrix(str: string) {
  return str.split("\n").map((strRow) => {
    const row: Fraction[] = [];
    strRow.split(" ").forEach((n) => {
      try {
        row.push(new Fraction(n));
      } catch {}
    });
    return row;
  });
}

function matrixToLatex(matrix: Fraction[][]) {
  let latex = "\\begin{bmatrix} ";
  for (let i = 0; i < matrix.length; i++) {
    latex += matrix[i].map((f) => f.toLatex()).join(" & ");
    if (i !== matrix.length - 1) latex += "\\\\[2px]";
  }
  return latex + "\\end{bmatrix}";
}

function operationToLatex(opr: RowOperation): string {
  switch (opr.type) {
    case "replace":
      return `R_${opr.rowA + 1} \\gets R_${opr.rowA + 1} + R_${opr.rowB + 1} * ${opr.scalar.toLatex()}`;
    case "interchange":
      return `R_${opr.rowA + 1} \\leftrightarrow R_${opr.rowB + 1}`;
    case "scale":
      return `R_${opr.row + 1} \\gets R_${opr.row + 1} * ${opr.scalar.toLatex()}`;
  }
}

type RowOperation =
  | { type: "replace"; rowA: number; rowB: number; scalar: Fraction }
  | { type: "interchange"; rowA: number; rowB: number }
  | { type: "scale"; row: number; scalar: Fraction };
type RowOperationWithMatrix = RowOperation & { matrix: Fraction[][] };

/** Tools to perform row operations on a given matrix and record the process. */
class MatrixOperator {
  matrix: Fraction[][];
  operations: RowOperationWithMatrix[];

  constructor(matrix: Fraction[][]) {
    this.matrix = matrix;
    this.operations = [];
  }

  /** Replaces `rowA` by the sum of itself and `rowB` * `scalar`. */
  replace(rowA: number, rowB: number, scalar: Fraction) {
    for (let i = 0; i < this.matrix[rowA].length; i++) {
      const scaledRowB = this.matrix[rowB][i].mul(scalar);
      this.matrix[rowA][i] = this.matrix[rowA][i].add(scaledRowB);
    }

    this.pushOperation({ type: "replace", rowA, rowB, scalar });
  }

  /** Switches the positions of `rowA` and `rowB`. */
  interchange(rowA: number, rowB: number) {
    const tmp = this.matrix[rowA];
    this.matrix[rowA] = this.matrix[rowB];
    this.matrix[rowB] = tmp;

    this.pushOperation({ type: "interchange", rowA, rowB });
  }

  /** Multiples all entries in `row` by `scalar` */
  scale(row: number, scalar: Fraction) {
    for (let i = 0; i < this.matrix[row].length; i++) {
      this.matrix[row][i] = this.matrix[row][i].mul(scalar);
    }

    this.pushOperation({ type: "scale", row, scalar });
  }

  pushOperation(operation: RowOperation) {
    this.operations.push({
      ...operation,
      matrix: cloneMatrix(this.matrix),
    });
  }
}

function cloneMatrix(matrix: Fraction[][]) {
  const newMatrix: Fraction[][] = [];

  for (let i = 0; i < matrix.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < matrix[i].length; j++) {
      newMatrix[i][j] = matrix[i][j].clone();
    }
  }

  return newMatrix;
}
