import { InlineMath } from "react-katex";
import { Matrix } from "~/lib/matrix";
import { Vector } from "~/lib/vector";

export default function Page() {
  const a = new Matrix([1, 1, 0, 0, 1, 1], 2, 3);
  const v = new Vector([1, 2, 3]);

  return (
    <main className="m-8 flex flex-col items-start gap-4">
      <InlineMath math={"A=" + a.toLatex()} />
      <InlineMath math={"v=" + v.toLatex()} />
      <InlineMath math={"Av=" + a.mul(v).toLatex()} />
      <p>{a.getComp(1, 1).toLatex()}</p>
      <p>{a.getComp(1, 2).toLatex()}</p>
      <p>{a.getComp(1, 3).toLatex()}</p>
    </main>
  );
}
