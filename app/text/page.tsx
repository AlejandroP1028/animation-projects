import { DemoGrid } from "../_components/demo-grid";
import { BarReveal } from "./_components/bar-reveal";

const demos = [
  {
    id: "bar-reveal",
    label: "bar reveal",
    node: <BarReveal id="bar-reveal" />,
  },
];

export default function TextPage() {
  return <DemoGrid title="Text" demos={demos} />;
}
