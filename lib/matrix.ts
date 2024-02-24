import Fraction from "fraction.js";
import { RowOperation } from "./row-operation";
import { Fractionish, range } from "./utils";
import { Vector } from "./vector";
import { z } from "zod";

/** Represents a matrix with `m` rows and `n` columns. */
export class Matrix {
  comps: Fraction[];
  m: number;
  n: number;

  /**
   * Initializes a new matrix with a 1D array of components that is later
   * interpreted as rows and columns based on `m` and `n`.
   *
   * For example, a matrix created as `new Matrix([1, 2, 3, 4, 5, 6], 2, 3)`
   * would be interpreted as the following matrix:
   *
   * ```
   * [ 1, 2, 3;
   *   4, 5, 6 ]
   * ```
   */
  constructor(comps: Fractionish[], m: number, n: number, force = false) {
    if (!force && (!Number.isInteger(n) || !Number.isInteger(m)))
      throw new Error("Floats passed as n or m.");
    if (!force && (n < 1 || m < 1))
      throw new Error("Must have more than 0 rows and columns");
    if (!force && n * m !== comps.length)
      throw new Error("Invalid number of components.");

    this.comps = comps.map((x) => new Fraction(x));
    this.m = m;
    this.n = n;
  }

  /**
   * Returns a row vector corresponding to the `i`th row of the matrix.
   * Indexing starts at 1.
   */
  getRow(i: number): Vector {
    if (i <= 0 || i > this.m) throw new Error("Invalid row index.");

    return new Vector(
      range(this.n).map((j) => this.comps[(i - 1) * this.n + j]),
    );
  }

  /**
   * Returns a column vector corresponding to the `j`th column of the matrix.
   * Indexing starts at 1.
   */
  getCol(j: number): Vector {
    if (j <= 0 || j > this.n) throw new Error("Invalid column index.");

    return new Vector(
      range(this.m).map((i) => this.comps[i * this.n + (j - 1)]),
    );
  }

  /**
   * Returns the component of the matrix at row `i` and column `j`.
   * Indexing starts at 1.
   */
  getComp(i: number, j: number) {
    return this.getRow(i).getComp(j);
  }

  /**
   * Returns an array of all row vectors in the matrix.
   * @see {@link Matrix.getRow}
   */
  getRows(): Vector[] {
    return range(this.m, 1).map((i) => this.getRow(i));
  }

  /**
   * Returns an array of all column vectors in the matrix.
   * @see {@link Matrix.getCol}
   */
  getCols(): Vector[] {
    return range(this.n, 1).map((j) => this.getCol(j));
  }

  /**
   * Returns a new matrix with the `i`th row of the current matrix replaced with
   * the supplied row vector. Indexing starts at 1.
   */
  setRow(i: number, vec: Vector): Matrix {
    if (i <= 0 || i > this.m) throw new Error("Invalid row index.");

    return Matrix.fromRows(
      this.getRows().map((row, rowIndex) => (rowIndex + 1 === i ? vec : row)),
    );
  }

  /**
   * Returns a new matrix with the `j`th column of the current matrix replaced
   * with the supplied column vector. Indexing starts at 1.
   */
  setCol(j: number, vec: Vector): Matrix {
    if (j <= 0 || j > this.n) throw new Error("Invalid column index.");

    return Matrix.fromCols(
      this.getCols().map((col, colIndex) => (colIndex + 1 === j ? vec : col)),
    );
  }

  /**
   * One of the three valid row operations.
   * Multiples all entries in `row` by `scalar`.
   */
  scaleRow(row: number, scalar: Fraction, observer?: RowOperation[]): Matrix {
    const matrix = this.setRow(row, this.getRow(row).scale(scalar));
    observer?.push({ type: "scale", row, scalar, matrix });
    return matrix;
  }

  /**
   * One of the three valid row operations.
   * Replaces `rowA` by the sum of itself and `rowB` * `scalar`.
   */
  replaceRow(
    rowA: number,
    rowB: number,
    scalar: Fraction,
    observer?: RowOperation[],
  ) {
    const scaledRowB = this.getRow(rowB).scale(scalar);
    const matrix = this.setRow(rowA, this.getRow(rowA).add(scaledRowB));
    observer?.push({ type: "replace", rowA, rowB, scalar, matrix });
    return matrix;
  }

  /**
   * One of the three valid row operations.
   * Switches the positions of `rowA` and `rowB`.
   */
  swapRows(rowA: number, rowB: number, observer?: RowOperation[]): Matrix {
    const matrix = this.setRow(rowA, this.getRow(rowB)) //
      .setRow(rowB, this.getRow(rowA));
    observer?.push({ type: "swap", rowA, rowB, matrix });
    return matrix;
  }

  add(other: Matrix): Matrix {
    return Matrix.fromRows(
      this.getRows().map((row, i) => row.add(other.getRow(i))),
    );
  }

  mul<T extends Vector | Matrix>(other: T): T {
    if (other instanceof Vector)
      return this.mul(Matrix.fromCols([other])).getCol(1) as T;

    if (this.n !== other.m)
      throw new Error("Matrices are not of compatible sizes.");

    return Matrix.fromRows(
      this.getRows().map(
        (row) => new Vector(other.getCols().map((col) => row.dot(col))),
      ),
    ) as T;
  }

  equals(other: Matrix): boolean {
    if (this.m !== other.m) return false;
    if (this.n !== other.n) return false;
    return this.comps.every((n, i) => n.equals(other.comps[i]));
  }

  clone(): Matrix {
    return new Matrix(this.comps, this.m, this.n);
  }

  /** Returns a LaTeX representation of the matrix. */
  toLatex(): string {
    let latex = "\\begin{bmatrix} ";

    this.getRows().forEach((row, i) => {
      latex += row.comps.map((x) => x.toLatex()).join(" & ");
      if (i + 1 !== this.m) latex += "\\\\[2px]";
    });

    return latex + "\\end{bmatrix}";
  }

  toStr(): string {
    return this.getRows()
      .map((row) => row.comps.join(" "))
      .join("\n");
  }

  transpose(): Matrix {
    return Matrix.fromRows(this.getCols());
  }

  /**
   * Returns a new matrix that has been converted to reduced row echolon form.
   * A list of the row operations performed is returned along with the matrix.
   * @see {@link https://textbooks.math.gatech.edu/ila/row-reduction.html}
   */
  toReducedRowEcholonForm(): { matrix: Matrix; steps: RowOperation[] } {
    let matrix = this.clone();
    const observer: RowOperation[] = [];

    // STEP 4: repeat 1-3 until all rows are processed
    for (let currRow = 1; currRow <= matrix.m; currRow++) {
      // STEP 1: start with first non-zero column as pivot
      const pivotPos = matrix.getFirstNonZeroCol(currRow);
      if (!pivotPos) continue;

      // STEP 2: swap rows to bring non-zero term to pivot
      if (matrix.getComp(currRow, pivotPos).equals(0)) {
        for (let i = currRow + 1; i <= matrix.m; i++) {
          if (matrix.getComp(i, pivotPos).equals(0)) continue;
          matrix = matrix.swapRows(currRow, i, observer);
          break;
        }
      }

      // STEP 3: perform row operations to clear below pivot
      for (let i = currRow + 1; i <= matrix.m; i++) {
        const value = matrix.getComp(i, pivotPos);
        if (value.equals(0)) continue;
        const scalar = value.div(matrix.getComp(currRow, pivotPos).mul(-1));
        matrix = matrix.replaceRow(i, currRow, scalar, observer);
      }
    }

    // STEP 5: working backwards, generate zeros above each pivot
    for (let currRow = matrix.m; currRow >= 1; currRow--) {
      const pivotPos = matrix.getFirstNonZeroCol(currRow);
      if (!pivotPos) continue;

      console.log(matrix.getComp(currRow, pivotPos));

      // scale current row so that pivot is 1
      if (!matrix.getComp(currRow, pivotPos).equals(1)) {
        const scalar = matrix.getComp(currRow, pivotPos).inverse();
        matrix = matrix.scaleRow(currRow, scalar, observer);
      }

      for (let i = currRow - 1; i >= 1; i--) {
        if (matrix.getComp(i, pivotPos).equals(0)) continue;
        const scalar = matrix
          .getComp(i, pivotPos)
          .div(matrix.getComp(currRow, pivotPos))
          .mul(-1);
        matrix = matrix.replaceRow(i, currRow, scalar, observer);
      }
    }

    return { matrix, steps: observer };
  }

  /** Helper method for {@link Matrix.toReducedRowEcholonForm}. */
  private getFirstNonZeroCol(start: number) {
    for (let j = start; j <= this.n; j++) {
      let allZeros = true;
      for (let i = start; i <= this.m; i++) {
        if (!this.getComp(i, j).equals(0)) allZeros = false;
      }
      if (!allZeros) return j;
    }
    return undefined;
  }

  /** Creates a new matrix from an array of row vectors. */
  static fromRows(rows: Vector[]): Matrix {
    if (rows.length < 1) throw new Error("Too few row vectors passed in.");
    if (rows[0].size() === 0) throw new Error("Vectors contain no components");
    if (!rows.every((row) => row.size() === rows[0].size()))
      throw new Error("Row vectors are not of the same size");

    const comps: Fraction[] = [];
    const m = rows.length;
    const n = rows[0].size();

    range(m).forEach((i) => {
      range(n).forEach((j) => {
        comps[i * n + j] = rows[i].comps[j];
      });
    });

    return new Matrix(comps, m, n);
  }

  /** Creates a new matrix from an array of column vectors. */
  static fromCols(cols: Vector[]): Matrix {
    if (cols.length < 1) throw new Error("Too few column vectors passed in.");
    if (cols[0].size() === 0) throw new Error("Vectors contain no components");
    if (!cols.every((col) => col.size() === cols[0].size()))
      throw new Error("Column vectors are not of the same size");

    const comps: Fraction[] = [];
    const m = cols[0].size();
    const n = cols.length;

    range(m).forEach((i) => {
      range(n).forEach((j) => {
        comps[i * n + j] = cols[j].comps[i];
      });
    });

    return new Matrix(comps, m, n);
  }

  /** Creates a new matrix from a string. */
  static fromStr(str: string): Matrix {
    const rows: Vector[] = [];

    str.split("\n").forEach((strRow) => {
      const comps: Fraction[] = [];
      strRow.split(" ").forEach((n) => {
        // see if fraction.js can parse it, ignore if not
        try {
          comps.push(new Fraction(n));
        } catch {}
      });
      if (comps.length > 0) rows.push(new Vector(comps));
    });

    return Matrix.fromRows(rows);
  }

  /**
   * Returns a LaTeX representation of a matrix that is in the process of being
   * inputted by the user.
   */
  static fromStrToLatex(str: string): string {
    const matrix: Fraction[][] = [];

    str.split("\n").forEach((strRow) => {
      const comps: Fraction[] = [];
      strRow.split(" ").forEach((n) => {
        try {
          comps.push(new Fraction(n));
        } catch {}
      });
      if (comps.length > 0) matrix.push(comps);
    });

    let latex = "\\begin{bmatrix} ";
    for (let i = 0; i < matrix.length; i++) {
      latex += matrix[i].map((f) => f.toLatex()).join(" & ");
      if (i !== matrix.length - 1) latex += "\\\\[2px]";
    }
    return latex + "\\end{bmatrix}";
  }

  toJSON(): SerializedMatrix {
    return this.getRows().map((row) => row.toJSON());
  }

  static fromJSON(json: SerializedMatrix): Matrix {
    const rows = json.map((row) => Vector.fromJSON(row));
    return Matrix.fromRows(rows);
  }
}

const matrixSerialization = z.string().array().array();
type SerializedMatrix = z.infer<typeof matrixSerialization>;
