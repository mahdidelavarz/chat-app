"use client";

interface SidebarOverlayProps {
  onClick: () => void;
}

export default function SidebarOverlay({ onClick }: SidebarOverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      onClick={onClick}
    />
  );
}