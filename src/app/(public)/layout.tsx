import Navigation from "../../components/layout/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="pt-10 flex flex-col items-center">{children}</div>
    </>
  );
}
