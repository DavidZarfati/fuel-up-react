import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPageDetail.css";

// ✅ aggiungi questo import
import { useCart } from "../context/CartContext";

export default function Productpagedetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ prendi addToCart dal context
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${backendBaseUrl}/api/products/${slug}`)
      .then((resp) => {
        setProduct(resp.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Prodotto non trovato");
        setLoading(false);
      });
  }, [slug, backendBaseUrl]);

  // ✅ comodo: estrai il prodotto vero e proprio
  const p = product?.result?.[0];

  // ✅ funzione che costruisce l’oggetto da mettere nel carrello
  function handleAddToCart() {
    if (!p) return;

    addToCart({
      id: p.id, // IMPORTANTISSIMO: deve esserci
      name: slug.replaceAll ? slug.replaceAll("-", " ") : slug.split("-").join(" "),
      brand: p.brand,
      image: p.image,
      // scelgo il prezzo scontato se c’è, altrimenti quello base
      price: Number(p.discount_price ?? p.price ?? 0),
    });
  }

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : p ? (
        <div className="d-flex flex-column">
          <img
            src={`${backendBaseUrl}${p.image}`}
            alt={slug}
            style={{ maxWidth: "20%", height: "30%", display: "block", margin: "40px auto" }}
          />

          <h2 className="dz-titolo-prodotto">
            {slug.replaceAll ? slug.replaceAll("-", " ") : slug.split("-").join(" ")}{" "}
            <span className="dz-brand-badge">{p.brand}</span>
          </h2>

          <p className="dz-description-prodotto">
            {p.description ? p.description : "Nessuna descrizione disponibile."}
          </p>

          <p className="dz-description-prodotto">
            {p.size ? `Dimensione : ${p.size}` : "Nessuna descrizione disponibile."}
          </p>

          <p className="dz-description-prodotto">
            {p.manufacturer_note ? `Informazioni Aggiuntive : ${p.manufacturer_note}` : "Nessuna descrizione disponibile."}
          </p>

          <p className="dz-description-prodotto">
            {p.color ? `colore : ${p.color}` : `gusto : ${p.flavor}`}
          </p>

          <div className="d-flex justify-content-around">
            <p className="dz-description-prodotto">
              Prezzo Base : <span className="dz-prodotto-senza-sconto">{p.price}</span>
            </p>
            <p className="dz-description-prodotto">
              Prezzo Scontato : <span className="dz-prezzo-scontato">{p.discount_price}</span>
            </p>
          </div>

          {/* bottone aggiungi al carrello */}
          <div className="d-flex justify-content-center" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Aggiungi al carrello
            </button>
          </div>
        </div>
      ) : (
        <div>Product data not available.</div>
      )}
    </>
  );
}
