"use client";

import Link from "next/link";
import { PageWrapper } from "~/components/page-ui";
import { textbookLink } from "~/lib/chapters";

export default function Page() {
  return (
    <PageWrapper>
      <p>
        Welcome to <b>Concepts in Linear Algebra</b>! Consider checking out some
        of the pages listed below. To learn more about any particular concept
        described on each page, check out the link provided to the respective
        chapter of the{" "}
        <a href={textbookLink("index")} target="_blank" className="underline">
          Interactive Linear Algebra
        </a>{" "}
        textbook. To report any corrections or calculation errors, please
        contact me via one of the methods on{" "}
        <a href="https://zsrobinson.com" target="_blank" className="underline">
          my website
        </a>
        .
      </p>

      <ul className="list-inside list-disc pl-4">
        <li className="pb-2">
          <Link href="/row-reduction" className="underline">
            Reduced Row Echelon Form Calculator
          </Link>{" "}
          <span className="text-muted-foreground">(Chapter 1.2)</span>
        </li>
        <li className="pb-2">
          <Link href="/matrix-multiplication" className="underline">
            Matrix Multiplication Calculator
          </Link>{" "}
          <span className="text-muted-foreground">(Chapter 3.4)</span>
        </li>
        <li className="pb-2">
          <Link href="/matrix-transpose" className="underline">
            Matrix Transpose Calculator
          </Link>{" "}
          <span className="text-muted-foreground">(Chapter 4.1)</span>
        </li>
        <li className="pb-2">
          <Link href="/matrix-determinant" className="underline">
            Matrix Determinant Calculator
          </Link>{" "}
          <span className="text-muted-foreground">(Chapter 4.2)</span>
        </li>
      </ul>
    </PageWrapper>
  );
}
