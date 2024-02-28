"use client";

import { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import { Examples } from "~/components/examples";
import { PageTitle, PageWrapper } from "~/components/page-ui";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { getChapter } from "~/lib/chapters";
import { Matrix } from "~/lib/matrix";

const title = "Matrix Multiplication Calculator";
const chapter = getChapter("3.4");

export default function Page() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState<Matrix>();
  const [error, setError] = useState("");

  useEffect(() => {
    setResult(undefined);
    setError("");
  }, [inputA, inputB]);

  return (
    <PageWrapper>
      <PageTitle title={title} chapter={chapter} />

      <p>
        Enter each matrix in the text areas below with spaces between each
        element and rows on separate lines. Or, check out some of the examples.
      </p>

      <Examples
        actions={[
          () => {
            setInputA("1 2 3\n4 5 6");
            setInputB("1 -3\n2 -2\n3 -1");
          },
          () => {
            setInputA("-1 2\n5 4\n2 -3");
            setInputB("3 -4\n-2 1");
          },
          () => {
            setInputA("1 1 1\n1 2 3\n1 4 5");
            setInputB("2 0 0\n0 3 0\n0 0 5");
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
              const inputMatrixA = Matrix.fromStr(inputA);
              const inputMatrixB = Matrix.fromStr(inputB);
              const resultMatrix = inputMatrixA.mul(inputMatrixB);
              setResult(resultMatrix);
            } catch (e) {
              let message = "Unknown error";
              if (e instanceof Error) message = e.message;
              setError(message);
              console.error(e);
            }
          }}
        >
          Reduce
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
            Matrix.fromStrToLatex(inputA) +
            Matrix.fromStrToLatex(inputB) +
            "=" +
            result.toLatex()
          }
        />
      ) : inputA !== "" || inputB !== "" ? (
        <BlockMath
          math={
            Matrix.fromStrToLatex(inputA) + Matrix.fromStrToLatex(inputB) + "="
          }
        />
      ) : null}
    </PageWrapper>
  );
}
