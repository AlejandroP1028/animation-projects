import { DemoGrid } from "../_components/demo-grid";
import { RowCurtainTransition } from "./_components/row-curtain-transition";

const demos = [
  {
    id: "row-curtain",
    label: "row curtain",
    node: <RowCurtainTransition />,
  },
];

export default function PageTransitionsPage() {
  return <DemoGrid title="Page Transitions" demos={demos} />;
}
