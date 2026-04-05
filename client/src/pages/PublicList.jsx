import { useEffect, useState } from "react";
import { MapPin, Calendar, Search, Mail, PackageSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/api";

// ── Skeleton card shown while loading ────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function PublicList() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [totalCount, setTotalCount]   = useState(0);

  const fetchItems = (query = "") => {
    setLoading(true);
    const url = query
      ? `/api/items/public?search=${encodeURIComponent(query)}`
      : "/api/items/public";

    API.get(url)
      .then((res) => {
        setItems(res.data.items ?? []);
        setTotalCount(res.data.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSearch = () => {
    setActiveSearch(searchInput);
    fetchItems(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setSearchInput("");
    setActiveSearch("");
    fetchItems("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── Hero Header ──────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-14 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <PackageSearch size={48} className="opacity-90" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            Lost Items Board
          </h1>
          <p className="text-indigo-100 text-base max-w-md mx-auto">
            These items are currently lost. If you've found any of them,
            click <strong>"I Found This"</strong> to contact the owner directly.
          </p>

          {!loading && (
            <p className="mt-3 text-indigo-200 text-sm">
              {totalCount} item{totalCount !== 1 ? "s" : ""} reported lost
              {activeSearch && ` matching "${activeSearch}"`}
            </p>
          )}
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="mt-8 max-w-lg mx-auto flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, location, description..."
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/60 shadow-sm"
            />
            {searchInput && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-white text-indigo-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition shadow-sm"
          >
            Search
          </button>
        </motion.div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PackageSearch size={56} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-1">
              {activeSearch ? `No results for "${activeSearch}"` : "No lost items reported yet"}
            </h3>
            <p className="text-gray-400 text-sm">
              {activeSearch
                ? "Try a different search term"
                : "Check back later or report a lost item after logging in"}
            </p>
            {activeSearch && (
              <button
                onClick={handleClear}
                className="mt-4 text-indigo-600 text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* Items grid */}
        {!loading && items.length > 0 && (
          <AnimatePresence>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  {/* Image */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                      <PackageSearch size={36} />
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1">

                    {/* Title + Lost badge */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-base leading-tight">
                        {item.title}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        🔴 Lost
                      </span>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Location + Date */}
                    <div className="mt-2 space-y-1">
                      {item.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={12} className="text-indigo-400" />
                          {item.location}
                        </p>
                      )}
                      {item.dateLostFound && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} className="text-indigo-400" />
                          Lost on {new Date(item.dateLostFound).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* ✅ I Found This button */}
                    <div className="mt-auto pt-4">


  <a href={`https://mail.google.com/mail/?view=cm&to=${item.reporterEmail}&su=I Found Your Lost Item: ${encodeURIComponent(item.title)}&body=Hi, I found your item "${item.title}" that you reported lost. Please contact me to arrange collection.`}
  target="_blank"
  rel="noreferrer"
  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition"
>
  <Mail size={15} />
  I Found This
         </a>           </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}


