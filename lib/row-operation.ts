import Fraction from "fraction.js";
import { Matrix } from "./matrix";

export type RowOperation = (
  | { type: "replace"; rowA: number; rowB: number; scalar: Fraction }
  | { type: "swap"; rowA: number; rowB: number }
  | { type: "scale"; row: number; scalar: Fraction }
) & { matrix: Matrix };

export function operationToLatex(opr: RowOperation): string {
  switch (opr.type) {
    case "replace":
      return `R_${opr.rowA} \\gets R_${opr.rowA} + R_${opr.rowB} * ${opr.scalar.toLatex()}`;
    case "swap":
      return `R_${opr.rowA} \\leftrightarrow R_${opr.rowB}`;
    case "scale":
      return `R_${opr.row} \\gets R_${opr.row} * ${opr.scalar.toLatex()}`;
  }
}
