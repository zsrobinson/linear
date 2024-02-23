import Fraction from "fraction.js";
import { Fractionish } from "./utils";

/** A representation of a vector with any number of components. */
export class Vector {
  comps: Fraction[] = [];

  constructor(comps: Fractionish[]) {
    this.comps = comps.map((n) => new Fraction(n));
  }

  size(): number {
    return this.comps.length;
  }

  add(other: Vector): Vector | undefined {
    if (this.size() !== other.size()) return undefined;
    return new Vector(this.comps.map((n, i) => n.add(other.comps[i])));
  }

  scale(scalar: Fractionish): Vector {
    return new Vector(this.comps.map((n) => n.mul(scalar)));
  }

  dot(other: Vector): Fraction | undefined {
    if (this.size() !== other.size()) return undefined;
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
}
