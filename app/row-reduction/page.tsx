"use client";

import { useEffect, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { Examples } from "~/components/examples";
import { LabeledSwitch } from "~/components/labeled-switch";
import { PageTitle, PageWrapper } from "~/components/page-ui";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { getChapter } from "~/lib/chapters";
import { Matrix } from "~/lib/matrix";
import { RowOperation, operationToLatex } from "~/lib/row-operation";

const title = "Reduced Row Echelon Form Calculator";
const chapter = getChapter("1.2");

export default function Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Matrix>();
  const [operations, setOperations] = useState<RowOperation[]>([]);
  const [detailed, setDetailed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setResult(undefined);
    setError("");
  }, [input]);

  return (
    <PageWrapper>
      <PageTitle title={title} chapter={chapter} />

      <p>
        Enter your original matrix in the text area below with spaces between
        each element and rows on separate lines. Or, check out some of the
        examples.
      </p>

      <Examples
        actions={[
          () => setInput("2 4 1 3\n6 2 3 9\n1 1 1 1"),
          () => setInput("0 -7 -4 2\n2 4 6 12\n3 1 -1 -2"),
          () => setInput("2 1 12 1\n1 2 9 -1"),
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
              const inputMatrix = Matrix.fromStr(input);
              const { matrix: resultMatrix, steps } =
                inputMatrix.toReducedRowEchelonForm();
              setResult(resultMatrix);
              setOperations(steps);
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

      <LabeledSwitch
        checked={detailed}
        setChecked={setDetailed}
        label="Step-by-step mode"
      />

      {result ? (
        <BlockMath
          math={Matrix.fromStrToLatex(input) + "\\implies" + result.toLatex()}
        />
      ) : input !== "" ? (
        <BlockMath math={Matrix.fromStrToLatex(input) + "\\implies"} />
      ) : null}

      {result ? (
        <ol>
          {operations.map((opr, i) => (
            <li key={i} className="pb-0.5">
              <InlineMath math={operationToLatex(opr)} />
              {detailed && (
                <div className="p-2 pb-4 pl-4">
                  <InlineMath math={opr.matrix.toLatex()} />
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : null}
    </PageWrapper>
  );
}
