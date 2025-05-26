import React from "react";

export default function Modal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex backdrop-blur-sm items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-6">{children}</div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
