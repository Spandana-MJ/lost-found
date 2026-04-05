import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";


export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",     // "danger" | "warning" | "info"
  onConfirm,
  onCancel,
}) {
  const variantStyles = {
    danger: {
      icon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: "bg-yellow-100 text-yellow-600",
      button: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400",
    },
    info: {
      icon: "bg-blue-100 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}>
                <AlertTriangle size={22} />
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => { onConfirm(); }}
                  className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

