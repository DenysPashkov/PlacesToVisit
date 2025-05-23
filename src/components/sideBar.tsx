import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SideBar() {
  return (
    <>
      <aside className="w-100 bg-white rounded-2xl shadow-xl p-6 h-[90vh] ">
        <div className="mb-4 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          <input
            type="search"
            placeholder="Cerca..."
            className="w-full pl-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <nav className="flex flex-col gap-3">
            <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
              <img
                src="../assets/react.svg"
                alt="Immagine esempio"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">Posto 1</p>
                <p className="text-sm text-gray-500">Distanza</p>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
