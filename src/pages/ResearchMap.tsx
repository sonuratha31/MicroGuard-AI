import { ExternalLink, Globe2, Layers, MapPin } from "lucide-react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useMemo, useState } from "react";

type StudyLocation = {
  id: number;
  city: string;
  country: string;
  region: string;
  category: string;
  year: string;
  title: string;
  finding: string;
  source: string;
  url: string;
  coords: [number, number];
};

const locations: StudyLocation[] = [
  {
    id: 1,
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    category: "Human blood",
    year: "2022",
    title: "Plastic particles detected in human blood",
    finding:
      "The study reported measurable plastic particles in human blood samples.",
    source: "Environment International",
    url: "https://pubmed.ncbi.nlm.nih.gov/35367073/",
    coords: [52.3676, 4.9041],
  },
  {
    id: 2,
    city: "Hull",
    country: "United Kingdom",
    region: "Europe",
    category: "Lung tissue",
    year: "2022",
    title: "Microplastics detected in human lung tissue",
    finding:
      "Researchers used µFTIR spectroscopy to identify particles in lung samples.",
    source: "Science of the Total Environment",
    url: "https://pubmed.ncbi.nlm.nih.gov/35364151/",
    coords: [53.7457, -0.3367],
  },
  {
    id: 3,
    city: "Naples",
    country: "Italy",
    region: "Europe",
    category: "Cardiovascular",
    year: "2024",
    title: "Microplastics and nanoplastics in carotid plaque",
    finding:
      "Particles were detected in surgically removed carotid artery plaques.",
    source: "New England Journal of Medicine",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2309822",
    coords: [40.8518, 14.2681],
  },
  {
    id: 4,
    city: "Geneva",
    country: "Switzerland",
    region: "Europe",
    category: "Evidence review",
    year: "2022",
    title: "Dietary and inhalation exposure evidence review",
    finding:
      "WHO reviewed available evidence and highlighted substantial research gaps.",
    source: "World Health Organization",
    url: "https://www.who.int/publications/i/item/9789240054608",
    coords: [46.2044, 6.1432],
  },
  {
    id: 5,
    city: "Beijing",
    country: "China",
    region: "Asia",
    category: "Human tissue",
    year: "2024",
    title: "Microplastic accumulation across human tissues",
    finding:
      "Researchers examined particles in lung, intestinal, and tonsil samples.",
    source: "Environmental Research",
    url: "https://pubmed.ncbi.nlm.nih.gov/38220018/",
    coords: [39.9042, 116.4074],
  },
  {
    id: 6,
    city: "Global review",
    country: "Multiple regions",
    region: "Global",
    category: "Drinking water",
    year: "2019",
    title: "Microplastics in drinking-water",
    finding:
      "WHO reviewed occurrence, treatment, exposure, and potential health implications.",
    source: "World Health Organization",
    url: "https://www.who.int/publications-detail-redirect/9789241516198",
    coords: [0, 0],
  },
];

const regions = ["All", "Europe", "Asia", "Global"];

function createMarkerIcon(label: string, active: boolean) {
  const html = `
    <div class="map-label-container ${active ? "active" : ""}">
      <span class="map-pin-dot"></span>
      <span class="map-label-text">${label}</span>
    </div>
  `;

  return divIcon({
    className: "map-pin-wrapper",
    html,
    iconSize: [120, 36],
    iconAnchor: [60, 18],
    popupAnchor: [0, -14],
  });
}

function ResearchMap() {
  const [selectedStudy, setSelectedStudy] = useState<StudyLocation>(locations[0]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const visibleLocations = useMemo(
    () =>
      selectedRegion === "All"
        ? locations
        : locations.filter((location) => location.region === selectedRegion),
    [selectedRegion],
  );

  function changeRegion(region: string) {
    setSelectedRegion(region);

    if (region === "All") {
      setSelectedStudy(locations[0]);
      return;
    }

    const firstMatch = locations.find((location) => location.region === region);
    if (firstMatch) {
      setSelectedStudy(firstMatch);
    }
  }

  return (
    <div className="map-page">
      <section className="map-heading">
        <div>
          <span className="eyebrow">Global evidence explorer</span>
          <h1>
            See where microplastic
            <span> research is happening.</span>
          </h1>
        </div>

        <p>
          Select a map marker to view the study location, research category,
          main finding, and original source.
        </p>
      </section>

      <section className="map-statistics">
        <article>
          <Globe2 size={22} />
          <div>
            <strong>{locations.length}</strong>
            <span>Featured resources</span>
          </div>
        </article>

        <article>
          <MapPin size={22} />
          <div>
            <strong>{new Set(locations.map((location) => location.region)).size}</strong>
            <span>Geographic scopes</span>
          </div>
        </article>

        <article>
          <Layers size={22} />
          <div>
            <strong>{new Set(locations.map((location) => location.category)).size}</strong>
            <span>Research categories</span>
          </div>
        </article>
      </section>

      <section className="map-filter">
        <span>Filter map:</span>

        {regions.map((region) => (
          <button
            type="button"
            key={region}
            className={selectedRegion === region ? "map-filter-active" : ""}
            onClick={() => changeRegion(region)}
          >
            {region}
          </button>
        ))}
      </section>

      <section className="map-workspace">
        <div className="world-map">
          <MapContainer
            center={[22, 10]}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            scrollWheelZoom
            className="leaflet-map"
            aria-label="Microplastics research map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {visibleLocations.map((location, index) => {
              // small offset to reduce exact overlap for nearby markers
              const nudgex = ((index % 5) - 2) * 0.02;
              const nudgey = (((index + 2) % 5) - 2) * 0.02;
              const adjusted: [number, number] = [location.coords[0] + nudgex, location.coords[1] + nudgey];
              const active = selectedStudy.id === location.id || hoveredId === location.id;

              return (
                <Marker
                  key={location.id}
                  position={adjusted}
                  icon={createMarkerIcon(location.city || location.region, active)}
                  eventHandlers={{
                    click: () => setSelectedStudy(location),
                    mouseover: () => setHoveredId(location.id),
                    mouseout: () => setHoveredId(null),
                  }}
                >
                  <Popup>
                    <strong>{location.title}</strong>
                    <br />
                    {location.city}, {location.country}
                    <br />
                    {location.source}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <aside className="map-study-panel">
          <div className="map-panel-location">
            <MapPin size={18} />
            <span>
              {selectedStudy.city}, {selectedStudy.country}
            </span>
          </div>

          <div className="map-panel-tags">
            <span>{selectedStudy.category}</span>
            <span>{selectedStudy.year}</span>
          </div>

          <h2>{selectedStudy.title}</h2>
          <p>{selectedStudy.finding}</p>

          <div className="map-source">
            <span>Published by</span>
            <strong>{selectedStudy.source}</strong>
          </div>

          <a href={selectedStudy.url} target="_blank" rel="noreferrer">
            View original research
            <ExternalLink size={16} />
          </a>
        </aside>
      </section>

      <p className="map-note">
        This prototype displays a curated selection of research resources and
        does not represent every microplastic study worldwide.
      </p>
    </div>
  );
}

export default ResearchMap;
