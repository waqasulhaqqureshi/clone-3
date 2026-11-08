import { Arrow } from "../components/Footer";
import MockScreen from "../components/MockScreen";
import type { Project, Role } from "../data/site";

type Props = {
  title: string;
  lede: string;
  projects: Project[];
  role?: Role;
  onNavigate: (p: string) => void;
};

export default function ServicePage({ title, lede, projects, role, onNavigate }: Props) {
  return (
    <div className="page" data-page={role?.id ?? "service"}>
      <div className="shell">
        <header className="page__head">
          <h1 className="page__title">{title}</h1>
          <p className="page__lede">{lede}</p>
        </header>

        <div className="work">
          {projects.map((project, i) => (
            <article className="work-card" key={project.kicker + project.title} data-flip={i % 2 === 1}>
              <div className="work-card__copy">
                {project.media.icon ? (
                  <div className="work-card__icon">
                    <img src={project.media.icon} alt="" loading="lazy" />
                  </div>
                ) : null}
                <p className="kicker">{project.kicker}</p>
                <h2 className="work-card__title">{project.title}</h2>
                <p className="work-card__sub">{project.sub}</p>
                <p className="work-card__body">{project.body}</p>
                <ul className="work-card__tags">
                  {project.tags.map((tag) => (
                    <li className="tag" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
                {project.href ? (
                  <a className="work-card__live" href={project.href} target="_blank" rel="noreferrer">
                    <span>
                      <Arrow />
                    </span>
                    Visit live site
                  </a>
                ) : null}
              </div>

              <div className={`work-card__media${project.media.kind === "phone" ? " work-card__media--phone" : ""}`}>
                <Media project={project} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <button type="button" className="backpill" onClick={() => onNavigate("/work")}>
        <ArrowLeft /> Back to the doors
      </button>
    </div>
  );
}

function Media({ project }: { project: Project }) {
  const { src, kind, alt } = project.media;
  const variant = src.startsWith("variant:") ? src.slice("variant:".length) : "portfolio";

  if (kind === "phone") {
    return (
      <div className="phone" role="img" aria-label={alt}>
        <MockScreen variant={variant} />
      </div>
    );
  }

  if (kind === "browser") {
    return (
      <div className="browser" role="img" aria-label={alt}>
        <div className="browser__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <b />
        </div>
        <MockScreen variant={variant} />
      </div>
    );
  }

  return (
    <div className="mock-plain" role="img" aria-label={alt}>
      <MockScreen variant={variant} />
    </div>
  );
}

function ArrowLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
