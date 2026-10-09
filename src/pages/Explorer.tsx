import { Info, MousePointer2, Search, ShieldCheck } from "lucide-react";
import HumanBody3D from "../components/HumanBody3D";

function Explorer() {
  return (
    <div className="explorer-page">
      <section className="page-hero explorer-heading">
        <span className="eyebrow">Interactive anatomy</span>

        <h1>
          Explore microplastic pathways through the
          <span> human body.</span>
        </h1>

        <p>
          Rotate the body, zoom in, and select an organ to examine reported
          findings, possible exposure pathways, and current areas of research.
        </p>
      </section>

      <section className="explorer-guide">
        <article>
          <MousePointer2 size={20} />
          <div>
            <strong>Select</strong>
            <span>Click an organ or its label</span>
          </div>
        </article>

        <article>
          <Search size={20} />
          <div>
            <strong>Inspect</strong>
            <span>Scroll to zoom into the body</span>
          </div>
        </article>

        <article>
          <ShieldCheck size={20} />
          <div>
            <strong>Understand</strong>
            <span>Review pathways and findings</span>
          </div>
        </article>
      </section>

      <section className="explorer-workspace">
        <HumanBody3D />
      </section>

      <section className="evidence-banner">
        <Info size={22} />

        <div>
          <strong>How to interpret this explorer</strong>
          <p>
            Detection of microplastics in human samples does not automatically
            establish that they caused damage or disease. The explorer clearly
            separates reported findings from effects that scientists are still
            investigating.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Explorer;