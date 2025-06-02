import Header from "./header.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="h-screen pt-6 bg-gradient-to-b from-gray-100 to-gray-200">
        <Outlet />
      </main>
    </>
  );
}

