import { clsx, type ClassValue } from "clsx";
import Fraction from "fraction.js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This type is designed to be used for function arguments where you want to be
 * as permissable as possible for the user. Instead of forcing the user to
 * convert their format into fractions beforehand, this will accept anything
 * that can be parsed by fraction.js into a fraction object.
 */
export type Fractionish =
  | string
  | number
  | Fraction
  | [string | number, string | number]
  | { n: number; d: number };
