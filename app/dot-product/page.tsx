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

const title = "Vector Dot Product Calculator";
const chapter = getChapter("6.1");

export default function Page() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState<Fraction>();
  const [error, setError] = useState("");

  useEffect(() => {
    setResult(undefined);
    setError("");
  }, [inputA, inputB]);

  return (
    <PageWrapper>
      <PageTitle title={title} chapter={chapter} />

      <p>
        Enter each vector in the text areas below using either spaces or line
        breaks between elements.. Or, check out some of the examples.
      </p>

      <p>
        <b>Note:</b> this calculator treats row vectors and column vectors as
        the same. As long as the vectors have the same number of elements, they
        can be dotted together.
      </p>

      <Examples
        actions={[
          () => {
            setInputA("1 2 3");
            setInputB("1 -3 2");
          },
          () => {
            setInputA("-1 2 5 4");
            setInputB("3 -4 -2 1");
          },
          () => {
            setInputA("1 1 1 1 2 3");
            setInputB("2 0 0 0 3 0");
          },
        ]}
      />

      <Textarea
        className="min-h-24 max-w-96 font-mono"
        value={inputA}
        onChange={(e) => {
          setInputA(e.target.value);
        }}
      />

      <Textarea
        className="min-h-24 max-w-96 font-mono"
        value={inputB}
        onChange={(e) => {
          setInputB(e.target.value);
        }}
      />

      <div className="flex items-center gap-4">
        <Button
          onClick={() => {
            try {
              const inputVectorA = Vector.fromStr(inputA);
              const inputVectorB = Vector.fromStr(inputB);
              const resultVector = inputVectorA.dot(inputVectorB);
              setResult(resultVector);
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

        <Button
          onClick={() => {
            setInputA("");
            setInputB("");
          }}
          variant="secondary"
        >
          Clear
        </Button>

        <p className="text-sm leading-none text-red-500">{error}</p>
      </div>

      {result ? (
        <BlockMath
          math={
            Vector.fromStrToLatex(inputA, "pmatrix", "col") +
            Vector.fromStrToLatex(inputB, "pmatrix", "col") +
            "=" +
            result.toLatex()
          }
        />
      ) : inputA !== "" || inputB !== "" ? (
        <BlockMath
          math={
            Vector.fromStrToLatex(inputA, "pmatrix", "col") +
            Vector.fromStrToLatex(inputB, "pmatrix", "col") +
            "="
          }
        />
      ) : null}
    </PageWrapper>
  );
}
