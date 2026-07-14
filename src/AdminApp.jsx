import { useState } from "react";
import AdminAuth from "./AdminAuth";
import AdminLayout from "./AdminLayout";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminTransactions from "./AdminTransactions";
import AdminPayouts from "./AdminPayouts";
import AdminHospitals from "./AdminHospitals";
import AdminRevenue from "./AdminRevenue";
import AdminSettings from "./AdminSettings";

export default function AdminApp() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPage, setCurrentPage] = useState("overview");

  const handleLoginSuccess = (email) => {
    setAdminEmail(email);
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail("");
    setCurrentPage("overview");
  };

  if (!isAdminAuthenticated) {
    return <AdminAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      adminEmail={adminEmail}
    >
      {currentPage === "overview" && <AdminOverview />}
      {currentPage === "users" && <AdminUsers />}
      {currentPage === "transactions" && <AdminTransactions />}
      {currentPage === "payouts" && <AdminPayouts />}
      {currentPage === "hospitals" && <AdminHospitals />}
      {currentPage === "revenue" && <AdminRevenue />}
      {currentPage === "settings" && <AdminSettings />}
    </AdminLayout>
  );
}