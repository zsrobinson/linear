"use client";

import { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import { Examples } from "~/components/examples";
import { PageTitle, PageWrapper } from "~/components/page-ui";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { getChapter } from "~/lib/chapters";
import { Matrix } from "~/lib/matrix";

const title = "Matrix Inverse Calculator";
const chapter = getChapter("3.5");

export default function Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Matrix>();
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
          () => setInput("2 1\n1 1"),
          () => setInput("2 3 2\n1 0 3\n2 2 3"),
          () => setInput("1 0 4\n0 1 2\n0 -3 -4"),
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
              setResult(matrix.getInverse());
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
          math={Matrix.fromStrToLatex(input) + "^{-1}=" + result.toLatex()}
        />
      ) : input !== "" ? (
        <BlockMath math={Matrix.fromStrToLatex(input) + "^{-1}="} />
      ) : null}
    </PageWrapper>
  );
}
