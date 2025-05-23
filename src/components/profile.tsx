import { useState } from "react";

function ProfileMenu() {
  return (
    <div className="absolute mt-2 right-0 bg-white rounded-xl shadow w-40 z-10">
      <ul className="text-left text-sm text-gray-700">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Login</li>
      </ul>
    </div>
  );
}

function ProfileButton() {
  return (
    <summary className="cursor-pointer bg-white w-24 h-24 rounded-full overflow-hidden shadow flex items-center justify-center hover:shadow-lg transition">
      <img
        src="https://placehold.co/100x100"
        alt="Generic user"
        className="w-full h-full object-cover"
      />
    </summary>
  );
}

export default function Profile() {
  return (
    <details className="relative">
      <ProfileButton />
      <ProfileMenu />
    </details>
  );
}
