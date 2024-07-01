import { Button } from "./ui/button";

type ExamplesProps = {
  actions: (() => void)[];
};

export function Examples({ actions }: ExamplesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {actions.map((action, i) => (
        <Button size="sm" variant="outline" onClick={action} key={i}>
          Example {i + 1}
        </Button>
      ))}
    </div>
  );
}
