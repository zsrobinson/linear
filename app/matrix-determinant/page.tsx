"use client";

import Fraction from "fraction.js";
import { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import { Examples } from "~/components/examples";
import { PageTitle, PageWrapper } from "~/components/page-ui";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { getChapter } from "~/lib/chapters";
import { Matrix } from "~/lib/matrix";

const title = "Matrix Determinant Calculator";
const chapter = getChapter("4.2");

export default function Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Fraction>();
  const [error, setError] = useState("");

  useEffect(() => {
    setResult(undefined);
    setError("");
  }, [input]);

  return (
    <PageWrapper>
      <PageTitle title={title} chapter={chapter} />

      <p>
        Enter your matrix in the text area below with spaces between each
        element and rows on separate lines. Or, check out some of the examples.
      </p>

      <Examples
        actions={[
          () => setInput("1 3 5\n2 0 -1\n4 -3 1"),
          () => setInput("2 5 -3 -2\n-2 -3 2 -5\n1 3 -2 0\n-1 6 4 0"),
          () => setInput("12 1\n9 -1"),
        ]}
      />

      <Textarea
        className="min-h-24 max-w-96 font-mono"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />

      <div className="flex items-center gap-4">
        <Button
          onClick={() => {
            try {
              const matrix = Matrix.fromStr(input);
              setResult(matrix.getDeterminant());
            } catch (e) {
              let message = "Unknown error";
              if (e instanceof Error) message = e.message;
              setError(message);
              console.error(e);
            }
          }}
        >
          Submit
        </Button>

        <Button onClick={() => setInput("")} variant="secondary">
          Clear
        </Button>

        <p className="text-sm leading-none text-red-500">{error}</p>
      </div>

      {result ? (
        <BlockMath
          math={
            Matrix.fromStrToLatex(input, "vmatrix") + "=" + result.toLatex()
          }
        />
      ) : input !== "" ? (
        <BlockMath math={Matrix.fromStrToLatex(input, "vmatrix") + "="} />
      ) : null}
    </PageWrapper>
  );
}
