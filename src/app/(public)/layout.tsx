import Navigation from "../../components/layout/Navigation";

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
