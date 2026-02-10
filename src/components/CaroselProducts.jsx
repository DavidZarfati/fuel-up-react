import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import "./CaroselProducts.css";

export default function RelatedProductsCarousel({ slug }) {
  const { backendUrl } = useGlobal();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const limit = 4;

  useEffect(() => {
    setPage(1);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;

    async function fetchRelated() {
      setLoading(true);
      setError("");
      try {
        const resp = await axios.get(
          `${backendUrl}/api/products/similar-by-categories/${slug}?page=${page}&limit=${limit}`
        );
        if (!ignore) {
          setProducts(Array.isArray(resp.data?.risultati) ? resp.data.risultati : []);
          setTotalPages(resp.data?.paginazione?.totale_pagine || 1);
        }
      } catch {
        if (!ignore) setError("Errore nel caricamento dei prodotti correlati.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRelated();
    return () => {
      ignore = true;
    };
  }, [backendUrl, slug, page]);

  if (!slug) return null;

  return (
    <section className="related-products-wrap">
      <div className="related-products-head">
        <h3 className="title-md">Prodotti correlati</h3>
        {totalPages > 1 && (
          <div className="related-products-pager">
            <button
              type="button"
              className="btn-ui btn-ui-outline"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={page === 1 || loading}
            >
              Indietro
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn-ui btn-ui-outline"
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              disabled={page === totalPages || loading}
            >
              Avanti
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="surface-card state-card">
          <p>Caricamento prodotti correlati...</p>
        </div>
      )}

      {!loading && error && <EmptyState icon="bi bi-exclamation-circle" title="Errore" description={error} />}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid related-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
