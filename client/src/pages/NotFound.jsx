
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-6">

      {/* Decorative blurred circle */}
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Big 404 */}
        <motion.h1
          className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-700 select-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          404
        </motion.h1>

        {/* Icon */}
        <motion.div
          className="flex justify-center -mt-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <Search size={28} className="text-indigo-400" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-slate-400 text-base max-w-sm mx-auto mb-8">
            Looks like this page got lost too. Let's get you back to finding things.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            to="/browse"
            className="flex items-center gap-2 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
          >
            Browse Items
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
