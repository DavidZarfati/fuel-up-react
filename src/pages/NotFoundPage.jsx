import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="page-section">
      <div className="app-container">
        <article className="surface-card notfound-card">
          <p className="notfound-code">404</p>
          <h1 className="title-lg">Pagina non trovata</h1>
          <p className="text-muted">
            Il contenuto richiesto non e disponibile o e stato spostato. Torna alla homepage o al catalogo.
          </p>
          <div className="notfound-actions">
            <Link to="/" className="btn-ui btn-ui-primary">
              Home
            </Link>
            <Link to="/products" className="btn-ui btn-ui-outline">
              Catalogo prodotti
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
