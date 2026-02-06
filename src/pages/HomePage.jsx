import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";
import SingleProductCard from "../components/SingleProductCard";
import SingleProductList from "../components/SingleProductList";
import { useGlobal } from "../context/GlobalContext";


export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGridMode, setisGridMode] = useState("");
    const [categoria, setcategoria] = useState("");
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        setLoading(true);
        axios.get(`${backendBaseUrl}/api/products?limit=30`)
            .then((resp) => {
        
                let arr = [];
                if (Array.isArray(resp.data)) {
                    arr = resp.data;
                } else if (Array.isArray(resp.data.result)) {
                    arr = resp.data.result;
                } else if (Array.isArray(resp.data.products)) {
                    arr = resp.data.products;
                }
                setProducts(arr);
                setLoading(false);
            })
            .catch((err) => {
                setError("Errore nel caricamento dei prodotti");
                setLoading(false);
            });
        console.log(categoria)
    }, [categoria, isGridMode]);

    return (
<>
  <section className="ot-home-container ot-bg-teal py-4">
    <div className="container">


      <div className="ot-hero-section mb-4 rounded-4"></div>


      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">


        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${categoria === "" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setcategoria("")}
          >
            Prodotti più venduti
          </button>

          <button
            className={`btn btn-sm ${categoria === 1 ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setcategoria(1)}
          >
            Supplements
          </button>

          <button
            className={`btn btn-sm ${categoria === 2 ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setcategoria(2)}
          >
            Apparel
          </button>

          <button
            className={`btn btn-sm ${categoria === 3 ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setcategoria(3)}
          >
            Accessories
          </button>

          <button
            className={`btn btn-sm ${categoria === 4 ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setcategoria(4)}
          >
            Food & Snacks
          </button>
        </div>


        <div className="btn-group" role="group" aria-label="Vista prodotti">
          <button
            type="button"
            className={`btn btn-sm ${isGridMode ? "btn-outline-dark" : "btn-dark"}`}
            onClick={async () => {
              setisGridMode(1);

              // la tua logica: se categoria non vuota fai fetch
              if (categoria !== "") {
                setLoading(true);
                try {
                  const resp = await axios.get(
                    `${backendBaseUrl}/api/products?macrocategoria_id=${categoria}`
                  );

                  let arr = [];
                  if (Array.isArray(resp.data)) arr = resp.data;
                  else if (Array.isArray(resp.data.result)) arr = resp.data.result;
                  else if (Array.isArray(resp.data.products)) arr = resp.data.products;

                  setProducts(arr);
                } catch (err) {
                  setError("Errore nel caricamento dei prodotti");
                } finally {
                  setLoading(false);
                }
              }
            }}
          >
            Lista
          </button>

          <button
            type="button"
            className={`btn btn-sm ${!isGridMode ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setisGridMode("")}
          >
            Griglia
          </button>
        </div>
      </div>


      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <p className="mt-3 mb-0">Caricamento prodotti...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

  
      {!loading && !error && Array.isArray(products) && (
        !isGridMode ? (
          // ✅ GRIGLIA
          <div className="row g-4">
            {(categoria === "" ? products.slice(0, 12) : products.filter(card => card.macro_categories_id === categoria))
              .map((card, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={card.id ?? card._id ?? idx}>
                  <SingleProductCard product={card} />
                </div>
              ))}
          </div>
        ) : (
          
          <div className="d-flex flex-column gap-3">
            {products
              .filter(card => categoria === "" || card.macro_categories_id === categoria)
              .map((card, idx) => (
                <div key={card.id ?? card._id ?? idx} className="card shadow-sm border-0 rounded-4">
                  <div className="card-body">
                    <SingleProductList product={card} />
                  </div>
                </div>
              ))}
          </div>
        )
      )}

      
      {!loading && !error && Array.isArray(products) && products.length === 0 && (
        <div className="alert alert-warning" role="alert">
          Nessun prodotto disponibile.
        </div>
      )}

    </div>
  </section>
</>
)}
