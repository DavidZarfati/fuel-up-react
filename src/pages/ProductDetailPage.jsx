import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import RelatedProductsCarousel from "../components/CaroselProducts";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isFavourite, toggleFavourite } = useFavourites();
  const { cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  // Toast preferiti
  const [favToast, setFavToast] = useState(null);
  const [showFavToast, setShowFavToast] = useState(false);

  // Carico prodotto
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    axios
      .get(`${backendBaseUrl}/api/products/${slug}`)
      .then((resp) => {
        if (cancelled) return;
        setProduct(resp.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Prodotto non trovato");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, backendBaseUrl]);

  // Timer toast preferiti
  useEffect(() => {
    if (!favToast || !showFavToast) return;
    const timer = setTimeout(() => setShowFavToast(false), 2500);
    return () => clearTimeout(timer);
  }, [favToast, showFavToast]);

  // Prendo il prodotto vero dalla risposta
  const p = useMemo(() => product?.result?.[0] ?? null, [product]);

  // Stato carrello per questo prodotto
  const cartItem = useMemo(() => {
    if (!p) return null;
    return cart.find((item) => item.id === p.id) || null;
  }, [cart, p]);

  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;

  function handleToggleFav() {
    if (!p) return;

    const alreadyFav = isFavourite(p.id);
    toggleFavourite(p);

    if (!alreadyFav) {
      setFavToast({
        name: p.name,
        time: "adesso",
        image: `${backendBaseUrl}${p.image}`,
      });
      setShowFavToast(true);
    }
  }

  function handleAddToCart() {
    if (!p) return;
    addToCart(p);
  }

  function handleIncrease() {
    if (!p) return;
    increaseQuantity(p.id);
  }

  function handleDecrease() {
    if (!p) return;

    // Se sei a 1 e premi -, lo tolgo direttamente (UX più comoda)
    if (quantity <= 1) {
      removeFromCart(p.id);
      return;
    }
    decreaseQuantity(p.id);
  }

  function handleRemove() {
    if (!p) return;
    removeFromCart(p.id);
  }

  if (loading) return <div>Loading...</div>;
  if (!loading && error) return <div>{error}</div>;
  if (!loading && !error && !p) return <div>Product data not available.</div>;

  return (
    <>
      <div className="d-flex flex-column">
        {/* IMMAGINE + CUORE */}
        <div className="ml-image-wrap align-self-center position-relative">
          <img
            src={`${backendBaseUrl}${p.image}`}
            alt={p.name}
            style={{ width: "300px", height: "auto", display: "block", margin: "0 0 15px 0" }}
          />

          <button
            onClick={handleToggleFav}
            className="ot-heart-button"
            aria-label={isFavourite(p.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <i
              className={isFavourite(p.id) ? "bi bi-heart-fill" : "bi bi-heart"}
              style={{ color: isFavourite(p.id) ? "#dc3545" : "#666", fontSize: "18px" }}
            />
          </button>
        </div>

        {/* TESTO */}
        <h2 className="dz-titolo-prodotto">
          {p.name || "No name available."} <span className="dz-brand-badge">{p.brand}</span>
        </h2>

        <p className="dz-description-prodotto">{p.description || "No description available."}</p>

        {p.size && <p className="dz-description-prodotto">Size: {p.size}</p>}

        {p.manufacturer_note && (
          <p className="dz-description-prodotto">Additional information: {p.manufacturer_note}</p>
        )}

        {(p.color || p.flavor) && (
          <p className="dz-description-prodotto">
            {p.color ? `Color: ${p.color}` : `Taste: ${p.flavor}`}
          </p>
        )}

        {/* PREZZO */}
        <div className="d-flex justify-content-around">
          {p.discount_price && p.discount_price < p.price ? (
            <>
              <p className="dz-description-prodotto">
                Prezzo Base: <span className="dz-prodotto-senza-sconto">€{p.price}</span>
              </p>
              <p className="dz-description-prodotto">
                Prezzo Scontato: <span className="dz-prezzo-scontato">€{p.discount_price}</span>
              </p>
            </>
          ) : (
            <p className="dz-description-prodotto">
              Prezzo: <span className="dz-prezzo-regular">€{p.price}</span>
            </p>
          )}
        </div>

        {/* ✅ SEZIONE CARRELLO MIGLIORATA */}
        <div className="d-flex justify-content-center" style={{ marginTop: 20 }}>
          {!isInCart ? (
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Aggiungi al carrello
            </button>
          ) : (
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="d-flex align-items-center gap-1">
                <button className="btn btn-outline-secondary btn-sm" onClick={handleDecrease}>
                  -
                </button>
                <span className="fw-bold" style={{ minWidth: 24, textAlign: "center" }}>
                  {quantity}
                </span>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleIncrease}>
                  +
                </button>
              </div>

              <button className="btn btn-success btn-sm" onClick={() => navigate("/shopping-cart")}>
                Vai al carrello
              </button>

              <button className="btn btn-outline-danger btn-sm" onClick={handleRemove}>
                Rimuovi
              </button>
            </div>
          )}
        </div>

        {/* Toast preferiti */}
        {favToast && showFavToast && (
          <div className="toast-container position-fixed" style={{ bottom: 90, right: 30, zIndex: 9999 }}>
            <div
              className="toast show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{
                minWidth: 320,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <div
                className="toast-header"
                style={{
                  background: "#f5f5f5",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <img
                  src={favToast.image}
                  className="rounded me-2"
                  alt={favToast.name}
                  style={{ width: 32, height: 32, objectFit: "cover", marginRight: 8 }}
                />
                <strong className="me-auto">Preferiti</strong>
                <small className="text-body-secondary">{favToast.time}</small>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowFavToast(false)}
                  style={{ marginLeft: 8, border: "none", background: "transparent", fontSize: 18 }}
                >
                  ×
                </button>
              </div>
              <div className="toast-body" style={{ padding: "12px 24px", fontSize: 18 }}>
                Hai aggiunto <b>{favToast.name}</b> ai preferiti
              </div>
            </div>
          </div>
        )}
      </div>

      <RelatedProductsCarousel slug={slug} />
    </>
  );
}

