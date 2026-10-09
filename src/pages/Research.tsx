import { BookOpen, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";

const studies = [
  {
    title: "Discovery and quantification of plastic particles in human blood",
    year: "2022",
    source: "Environment International",
    category: "Human Detection",
    summary:
      "Researchers reported measurable plastic particles in human blood samples, providing evidence of internal exposure.",
    interpretation:
      "Detection confirms exposure, but the study did not establish that the particles caused a particular disease.",
    url: "https://pubmed.ncbi.nlm.nih.gov/35367073/",
  },
  {
    title: "Detection of microplastics in human lung tissue using µFTIR",
    year: "2022",
    source: "Science of the Total Environment",
    category: "Respiratory",
    summary:
      "Microplastics were detected in human lung tissue, supporting inhalation as an exposure pathway.",
    interpretation:
      "The findings support further investigation of airborne fibres and respiratory exposure.",
    url: "https://pubmed.ncbi.nlm.nih.gov/35364151/",
  },
  {
    title:
      "Microplastics and Nanoplastics in Atheromas and Cardiovascular Events",
    year: "2024",
    source: "New England Journal of Medicine",
    category: "Cardiovascular",
    summary:
      "Microplastics and nanoplastics were detected in carotid artery plaque in a patient cohort.",
    interpretation:
      "The study found an association with later cardiovascular events, but an association does not by itself prove causation.",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2309822",
  },
  {
    title:
      "Dietary and inhalation exposure to nano- and microplastic particles",
    year: "2022",
    source: "World Health Organization",
    category: "Evidence Review",
    summary:
      "WHO reviewed available evidence on dietary and inhalation exposure and potential implications for human health.",
    interpretation:
      "The report emphasizes major evidence gaps and the need for stronger, standardized research.",
    url: "https://www.who.int/publications/i/item/9789240054608",
  },
  {
    title: "Microplastics in drinking-water",
    year: "2019",
    source: "World Health Organization",
    category: "Water",
    summary:
      "WHO reviewed the occurrence of microplastics in tap and bottled water, treatment methods, and potential health implications.",
    interpretation:
      "Available evidence was limited, so WHO called for better exposure and health-effect research.",
    url: "https://www.who.int/publications-detail-redirect/9789241516198",
  },
  {
    title: "Tissue accumulation of microplastics and potential health risks",
    year: "2024",
    source: "Environmental Research",
    category: "Human Detection",
    summary:
      "Researchers examined microplastics in lung, intestinal, and tonsil tissue using infrared spectroscopy.",
    interpretation:
      "The work contributes detection data, while long-term clinical significance remains uncertain.",
    url: "https://pubmed.ncbi.nlm.nih.gov/38220018/",
  },
];

const categories = [
  "All",
  "Human Detection",
  "Respiratory",
  "Cardiovascular",
  "Evidence Review",
  "Water",
];

function Research() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStudies = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return studies.filter((study) => {
      const matchesCategory =
        selectedCategory === "All" || study.category === selectedCategory;

      const matchesSearch =
        study.title.toLowerCase().includes(normalizedSearch) ||
        study.summary.toLowerCase().includes(normalizedSearch) ||
        study.source.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="research-page">
      <section className="research-hero">
        <span className="eyebrow">Evidence library</span>
        <h1>
          Microplastic research,
          <span> explained clearly.</span>
        </h1>

        <p>
          Explore selected studies and evidence reviews covering human
          detection, exposure pathways, and areas where scientific uncertainty
          remains.
        </p>

        <div className="research-search">
          <Search size={20} />

          <input
            type="search"
            value={searchTerm}
            placeholder="Search studies, sources, or topics"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </section>

      <section className="research-summary">
        <article>
          <strong>{studies.length}</strong>
          <span>Selected resources</span>
        </article>

        <article>
          <strong>5</strong>
          <span>Research categories</span>
        </article>

        <article>
          <strong>2019–2024</strong>
          <span>Publication range</span>
        </article>
      </section>

      <section className="research-content">
        <div className="research-filter">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? "research-filter-active"
                  : ""
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="study-count">
          Showing {filteredStudies.length} research resources
        </div>

        <div className="study-grid">
          {filteredStudies.map((study) => (
            <article className="study-card" key={study.title}>
              <div className="study-card-top">
                <span className="study-category">{study.category}</span>
                <span className="study-year">{study.year}</span>
              </div>

              <span className="study-icon">
                <BookOpen size={22} />
              </span>

              <h2>{study.title}</h2>
              <span className="study-source">{study.source}</span>

              <p>{study.summary}</p>

              <div className="study-interpretation">
                <strong>How to interpret it</strong>
                <span>{study.interpretation}</span>
              </div>

              <a href={study.url} target="_blank" rel="noreferrer">
                Open original source
                <ExternalLink size={16} />
              </a>
            </article>
          ))}
        </div>

        {filteredStudies.length === 0 && (
          <div className="no-studies">
            <BookOpen size={34} />
            <h2>No matching studies</h2>
            <p>Try another search term or select a different category.</p>
          </div>
        )}
      </section>

      <section className="research-caution">
        <strong>Research changes as new evidence appears.</strong>
        <p>
          MicroGuard AI distinguishes particle detection, experimental
          findings, and demonstrated clinical effects. Avoid treating the
          presence of particles as proof of a specific health outcome.
        </p>
      </section>
    </div>
  );
}

export default Research;