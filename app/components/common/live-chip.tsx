export default function LiveChip() {
  return (
    <span className="bg-red-1 flex items-center px-2 py-1 space-x-2">
      <span className="text-white font-bold text-xs">LIVE</span>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
    </span>
  );
}
