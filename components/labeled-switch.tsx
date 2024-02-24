import { Dispatch, SetStateAction, useId } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type LabeledSwitchProps = {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  label: string;
};

export function LabeledSwitch({
  checked,
  setChecked,
  label,
}: LabeledSwitchProps) {
  const id = useId();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={() => setChecked((c) => !c)}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
