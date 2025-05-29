export default function BottomBar() {
  return (
    <footer className="fixed bottom-0 w-full  text-sm text-black bg-transparent py-2 pointer-events-auto">
      Made with love by
      <a
        href="https://github.com/DenysPashkov"
        className="underline text-blue-500 hover:text-pink-300 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        Denys{" "}
      </a>
      and
      <a
        href="https://github.com/haruka1727"
        className="underline text-blue-500 hover:text-pink-300 transition"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {" "}
        Gio
      </a>
    </footer>
  );
}
