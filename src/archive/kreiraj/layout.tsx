import EditorNavigation from "@/components/layout/EditorNavigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <EditorNavigation />
      {children}
    </div>
  );
}
