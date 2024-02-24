import { Button } from "./ui/button";

type ExamplesProps = {
  actions: (() => void)[];
};

export function Examples({ actions }: ExamplesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {actions.map((action, i) => (
        <Button size="sm" variant="outline" onClick={action} key={1}>
          Example {i + 1}
        </Button>
      ))}
    </div>
  );
}
