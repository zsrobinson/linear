import Fraction from "fraction.js";
import { Fractionish } from "./utils";
import { Matrix } from "./matrix";

/** Represents a vector with any number of components. */
export class Vector {
  comps: Fraction[];

  constructor(comps: Fractionish[]) {
    this.comps = comps.map((x) => new Fraction(x));
  }

  size(): number {
    return this.comps.length;
  }

  /** Returns `x`th vector component. Indexing starts at 1. */
  getComp(x: number) {
    if (x > this.size()) throw new Error("Invalid component index.");
    return this.comps[x - 1];
  }

  add(other: Vector): Vector {
    if (this.size() !== other.size())
      throw new Error("Vectors are not of the same size.");
    return new Vector(this.comps.map((n, i) => n.add(other.comps[i])));
  }

  scale(scalar: Fractionish): Vector {
    return new Vector(this.comps.map((n) => n.mul(scalar)));
  }

  dot(other: Vector): Fraction {
    if (this.size() !== other.size())
      throw new Error("Vectors are not of the same size.");
    const mul = this.comps.map((n, i) => n.mul(other.comps[i]));
    return mul.reduce((a, b) => a.add(b));
  }

  length(): Fraction {
    return this.dot(this)!.pow([1, 2]);
  }

  unit(): Vector {
    return this.scale(this.length().inverse());
  }

  equals(other: Vector): boolean {
    if (this.size() !== other.size()) return false;
    return this.comps.every((n, i) => n.equals(other.comps[i]));
  }

  clone(): Vector {
    return new Vector(this.comps);
  }

  /** Returns whether the vector is a zero vector. */
  isZero(): boolean {
    return this.comps.every((x) => x.equals(0));
  }

  /**
   * Returns a LaTeX representation of the vector.
   * @see {@link Matrix.toLatex}
   */
  toLatex(type: "row" | "col" = "col"): string {
    return (
      type === "col"
        ? new Matrix(this.comps, this.size(), 1)
        : new Matrix(this.comps, 1, this.size())
    ).toLatex();
  }
}
