import { useMemo, useState } from "react";
import toneData from "../../docs/animation-reference/tone-vibes.json";

type ExternalRef = { site: string; url: string; why: string };
type Vibe = {
  id: string;
  patternsJson: string[];
  feelingKeywords: string[];
  triggerPhrases: string[];
  externalRefs: ExternalRef[];
};

type KeywordCluster = {
  keywords: string[];
  openFirst: string[];
  alsoTry: string[];
  note?: string;
};

type ToneFile = {
  version: string;
  description: string;
  routingInstructions: string;
  globalHubs: Record<string, string>;
  vibes: Vibe[];
  feelingKeywordToSites: KeywordCluster[];
};

const data = toneData as ToneFile;

function matches(q: string, vibe: Vibe): boolean {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  if (vibe.id.toLowerCase().includes(n)) return true;
  if (vibe.feelingKeywords.some((k) => k.toLowerCase().includes(n) || n.includes(k.toLowerCase())))
    return true;
  if (vibe.triggerPhrases.some((t) => t.toLowerCase().includes(n) || n.includes(t.toLowerCase())))
    return true;
  if (vibe.patternsJson.some((p) => p.toLowerCase().includes(n))) return true;
  return false;
}

function clusterMatches(q: string, c: KeywordCluster): boolean {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  return c.keywords.some((k) => k.includes(n) || n.includes(k));
}

export function App() {
  const [query, setQuery] = useState("");

  const filteredVibes = useMemo(
    () => data.vibes.filter((v) => matches(query, v)),
    [query]
  );

  const filteredClusters = useMemo(
    () => data.feelingKeywordToSites.filter((c) => clusterMatches(query, c)),
    [query]
  );

  const hubEntries = Object.entries(data.globalHubs);

  return (
    <>
      <h1>Vibe → animation refs</h1>
      <p className="lead">
        Search natural language; each card links to Motion, galleries, and engines. Data:{" "}
        <code>docs/animation-reference/tone-vibes.json</code>
      </p>

      <p className="lead" style={{ fontSize: "0.8rem" }}>
        {data.routingInstructions}
      </p>

      <div className="hubs">
        {hubEntries.slice(0, 8).map(([label, url]) => (
          <a key={label} href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))}
      </div>

      <input
        className="search"
        type="search"
        placeholder="Try: elegant, ripple, breathing, scroll…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search vibes and keywords"
      />

      <div className="count">
        {filteredVibes.length} vibe(s) · {filteredClusters.length} keyword cluster(s)
      </div>

      {filteredVibes.map((vibe) => (
        <article key={vibe.id} className="card">
          <h2>{vibe.id}</h2>
          <div className="pills">
            {vibe.patternsJson.map((p) => (
              <span key={p} className="pill pill-muted">
                {p}
              </span>
            ))}
          </div>
          <div className="section-label">Keywords</div>
          <ul className="compact">
            {vibe.feelingKeywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <div className="section-label">Trigger phrases</div>
          <ul className="compact">
            {vibe.triggerPhrases.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="section-label">Open these</div>
          <div className="links">
            {vibe.externalRefs.map((ref) => (
              <a key={ref.url + ref.why} href={ref.url} target="_blank" rel="noreferrer">
                {ref.site}
                <small>{ref.why}</small>
              </a>
            ))}
          </div>
        </article>
      ))}

      <h1 style={{ marginTop: "2rem", fontSize: "1.1rem" }}>Keyword → sites</h1>
      <p className="lead">When language is broad, open these hubs first.</p>

      {filteredClusters.map((c, i) => (
        <details key={i} className="cluster" open={Boolean(query.trim())}>
          <summary>
            {c.keywords.slice(0, 6).join(" · ")}
            {c.keywords.length > 6 ? " …" : ""}
          </summary>
          <div className="section-label">Open first</div>
          <div className="links">
            {c.openFirst.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            ))}
          </div>
          <div className="section-label">Also try</div>
          <div className="links">
            {c.alsoTry.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            ))}
          </div>
          {c.note ? <p className="lead">{c.note}</p> : null}
        </details>
      ))}
    </>
  );
}
