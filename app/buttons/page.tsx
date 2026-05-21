import { DemoGrid } from "../_components/demo-grid";
import { ScrambleButton } from "./_components/scramble-button";
import { AsciiPropagateButton } from "./_components/ascii-propagate-button";

const demos = [
  {
    id: "scramble",
    label: "scramble on hover",
    node: <ScrambleButton label="HOVER ME" />,
  },
  {
    id: "ascii-propagate",
    label: "ascii propagate",
    node: <AsciiPropagateButton label="ENTER ME" />,
  },
];

export default function ButtonsPage() {
  return <DemoGrid title="Buttons" demos={demos} />;
}
