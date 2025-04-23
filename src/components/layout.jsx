import Header from "./header.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="h-full">
        <Outlet />
      </main>
    </>
  );
}

