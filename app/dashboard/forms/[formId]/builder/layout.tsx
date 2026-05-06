import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Builder | AI Form Builder",
  description: "Design your form by dragging and dropping fields onto the canvas.",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F5F5F7]">
      {children}
    </div>
  );
}
