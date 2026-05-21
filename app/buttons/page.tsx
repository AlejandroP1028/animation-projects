import { DemoGrid } from "../_components/demo-grid";
import { ScrambleButton } from "./_components/scramble-button";
import { AsciiPropagateButton } from "./_components/ascii-propagate-button";
import { SplitRiseButton } from "./_components/split-rise-button";

const demos = [
  {
    id: "scramble",
    label: "scramble on hover",
    node: <ScrambleButton label="HOVER ME" />,
  },
  {
    id: "ascii-propagate",
    label: "ascii propagate",
    node: <AsciiPropagateButton label="HOVER ME" />,
  },
  {
    id: "split-rise",
    label: "split rise on hover",
    node: <SplitRiseButton label="HOVER ME" />,
  },
];

export default function ButtonsPage() {
  return <DemoGrid title="Buttons" demos={demos} />;
}
