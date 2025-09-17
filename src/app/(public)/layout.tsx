import Navigation from "../../components/layout/Navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="flex flex-col">{children}</div>
    </>
  );
}
