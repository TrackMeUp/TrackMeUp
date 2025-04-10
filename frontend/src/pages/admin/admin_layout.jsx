import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <Header />
      <Outlet />
    </div>
  );
}
