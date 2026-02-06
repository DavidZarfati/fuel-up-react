import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <div>
      <h2>Carrello ({totalItems})</h2>

      {cart.length === 0 ? (
        <p>Vuoto</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <strong>{item.name}</strong>
              <span>€{item.price}</span>

              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>

              <button onClick={() => removeFromCart(item.id)}>Rimuovi</button>
            </div>
          ))}

          <hr />
          <p><b>Totale:</b> €{Number(totalPrice).toFixed(2)}</p>
          <button onClick={clearCart}>Svuota carrello</button>
        </>
      )}
    </div>
  );
}
