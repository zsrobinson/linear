import Fraction from "fraction.js";
import { Fractionish, range } from "./utils";
import { Vector } from "./vector";

/**
 * Represents a matrix with `m` rows and `n` columns.
 */
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
  constructor(comps: Fractionish[], m: number, n: number) {
    if (!Number.isInteger(n) || !Number.isInteger(m))
      throw new Error("Floats passed as n or m.");
    if (n < 1 || m < 1)
      throw new Error("Must have more than 0 rows and columns");
    if (n * m !== comps.length)
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

    console.log(this);

    this.getRows().forEach((row, i) => {
      latex += row.comps.map((x) => x.toLatex()).join(" & ");
      if (i + 1 !== this.m) latex += "\\\\[2px]";
    });

    return latex + "\\end{bmatrix}";
  }

  transpose(): Matrix {
    return Matrix.fromRows(this.getCols());
  }

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
}
