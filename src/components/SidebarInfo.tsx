export function SidebarInfo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border-b pb-2">
      <span className="font-semibold">{label}</span>
      <span className="text-gray-600">{children}</span>
    </div>
  );
}
