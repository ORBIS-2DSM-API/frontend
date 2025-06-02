import Header from "./header.jsx";
import { Outlet } from "react-router-dom";
import FloatingManualButton from "./manual.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 mt-12 mb-24">
        <Outlet />
      </main>
      <FloatingManualButton />
    </div>
  );
}

