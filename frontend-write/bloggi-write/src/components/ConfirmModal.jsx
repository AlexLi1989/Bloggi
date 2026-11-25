export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  mode = "danger", //danger, primary, alert
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const confirmButtonStyle =
    mode === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white" //danger mode
      : "bg-indigo-600 hover:bg-indigo-700 text-white"; //primary mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-stone-200 space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-stone-900">{title}</h3>
          <p className="text-sm text-stone-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-3.5 pt-2">
          {mode !== "alert" && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50 transition cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition cursor-pointer ${confirmButtonStyle}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
