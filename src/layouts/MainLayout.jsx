import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}