import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Send } from "lucide-react";


 
export default function EmailModal({ isOpen, itemTitle = "", onSend, onClose }) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("Regarding your reported item");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Message is too short. Please provide more detail.");
      return;
    }

    setSending(true);
    setError("");
    try {
      await onSend({ subject, message: message.trim() });
      // Reset on success
      setMessage("");
      setSubject("Regarding your reported item");
      onClose();
    } catch {
      setError("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setMessage("");
      setSubject("Regarding your reported item");
      setError("");
      onClose();
    }
  };

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
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-100"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={handleClose}
                disabled={sending}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-40"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Email Reporter</h2>
                  {itemTitle && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Re: <span className="font-medium text-gray-600">{itemTitle}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={sending}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 bg-gray-50"
                  placeholder="Email subject"
                />
              </div>

              {/* Message */}
              <div className="mb-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError(""); }}
                  disabled={sending}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 bg-gray-50"
                  placeholder="Write your message to the reporter..."
                />
                <div className="flex justify-between items-center mt-1">
                  {error ? (
                    <p className="text-xs text-red-500">{error}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400">{message.length} chars</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={handleClose}
                  disabled={sending}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

