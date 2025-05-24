import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function CircleButton() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>
      {showSearch && (
        <div
          onClick={() => setShowSearch(false)}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          
            <input
              type="search"
              placeholder="Cerca..."
              autoFocus
              className="w-full pl-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
