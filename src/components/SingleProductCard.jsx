import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";
import { useToasts } from "../hooks/useToasts";
import Toasts from "./Toasts";

export default function SingleProductCard({ product }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  const {
    toast,
    showToast,
    setShowToast,
    favToast,
    showFavToast,
    setShowFavToast,
    fireCartToast,
    fireFavToast,
  } = useToasts();

  const cartItem = cart.find((item) => item.id === product.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;



  function handleToggleFavourite() {
    const wasFav = isFavourite(product.id);
    toggleFavourite(product);

    fireFavToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: wasFav
        ? "Hai rimosso dai preferiti:"
        : "Hai aggiunto ai preferiti:",
    });
  }

  function handleAddToCart() {
    addToCart(product);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: "Hai aggiunto al carrello:",
    });
  }

  function handleRemoveFromCart() {
    removeFromCart(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: "Hai rimosso dal carrello:",
    });
  }

  function handleIncrease() {
    increaseQuantity(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: `Quantità aumentata (ora ${quantity + 1}):`,
    });
  }

  function handleDecrease() {
    if (quantity <= 1) {
      handleRemoveFromCart();
      return;
    }
    decreaseQuantity(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: `Quantità diminuita (ora ${quantity - 1}):`,
    });
  }



  return (
    <>
      <div className="card h-100 shadow-sm position-relative pb-2">
        {/* ❤️ CUORE */}
        <button
          onClick={handleToggleFavourite}
          className="ot-heart-button"
          aria-label="Preferito"
        >
          <i
            className={isFavourite(product.id) ? "bi bi-heart-fill" : "bi bi-heart"}
            style={{
              color: isFavourite(product.id) ? "#dc3545" : "#666",
              fontSize: "18px",
            }}
          />
        </button>

        {/* IMMAGINE */}
        <img
          src={`${backendBaseUrl}${product.image}`}
          className="card-img-top"
          alt={product.name}
          style={{ height: "220px", objectFit: "contain" }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.name}</h5>

          {product.description && (
            <p className="card-text text-muted small line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="ot-list-item-details">
            <p className="ot-list-item-price">
              {product.discount_price ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'black' }}>
                    € {product.price?.toFixed(2)}
                  </span>
                  <span style={{ color: 'red', marginLeft: '8px' }}>
                    € {product.discount_price.toFixed(2)}
                  </span>
                </>
              ) : (
                <>€ {product.price?.toFixed(2)}</>
              )}
            </p>
          </div>

          {/* AZIONI */}
          <div className="mt-auto d-flex gap-2 flex-wrap align-items-center">
            <Link
              to={`/products/${product.slug}`}
              className="btn btn-outline-primary btn-sm"
            >
              Dettagli
            </Link>

            {!isInCart ? (
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-sm"
              >
                Aggiungi
              </button>
            ) : (
              <>
                <div className="d-flex align-items-center gap-1">
                  <button
                    onClick={handleDecrease}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    -
                  </button>

                  <span className="fw-bold">{quantity}</span>

                  <button
                    onClick={handleIncrease}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => navigate("/shopping-cart")}
                  className="btn btn-success btn-sm"
                >
                  Carrello
                </button>

                <button
                  onClick={handleRemoveFromCart}
                  className="btn btn-outline-danger btn-sm"
                >
                  Rimuovi
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🔔 TOAST identici a HomePage */}
      <Toasts
        toast={toast}
        showToast={showToast}
        setShowToast={setShowToast}
        favToast={favToast}
        showFavToast={showFavToast}
        setShowFavToast={setShowFavToast}
      />
    </>
  );
}
