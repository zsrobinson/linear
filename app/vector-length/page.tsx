"use client";

import Fraction from "fraction.js";
import { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import { Examples } from "~/components/examples";
import { PageTitle, PageWrapper } from "~/components/page-ui";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { getChapter } from "~/lib/chapters";
import { Vector } from "~/lib/vector";

const title = "Vector Length Calculator";
const chapter = getChapter("6.1");

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
        Enter the vector in the text area below using either spaces or line
        breaks between elements. Or, check out some of the examples.
      </p>

      <Examples
        actions={[
          () => setInput("2 3"),
          () => setInput("-1 2 4"),
          () => setInput("1 5 2 3"),
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
              const inputVector = Vector.fromStr(input);
              const resultFrac = inputVector.dot(inputVector);
              setResult(resultFrac);
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
            "\\left\\lVert" +
            Vector.fromStrToLatex(input, "pmatrix", "col") +
            "\\right\\rVert" +
            "= \\sqrt{" +
            result.toLatex() +
            "} \\approx " +
            Math.sqrt((result.n / result.d) * result.s).toFixed(3)
          }
        />
      ) : input !== "" ? (
        <BlockMath
          math={
            "\\left\\lVert" +
            Vector.fromStrToLatex(input, "pmatrix", "col") +
            "\\right\\rVert" +
            "="
          }
        />
      ) : null}
    </PageWrapper>
  );
}
