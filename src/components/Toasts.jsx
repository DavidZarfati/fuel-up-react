import Toast from "./Toast";

export default function Toasts({
  toast,
  showToast,
  setShowToast,
  favToast,
  showFavToast,
  setShowFavToast,
}) {
  return (
    <>
      <Toast toast={favToast} visible={showFavToast} onClose={() => setShowFavToast(false)} type="fav" />
      <Toast toast={toast} visible={showToast} onClose={() => setShowToast(false)} type="cart" />
    </>
  );
}
