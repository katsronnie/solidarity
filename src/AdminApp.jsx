import { useState, useEffect } from "react";
import AdminAuth from "./AdminAuth";
import AdminLayout from "./AdminLayout";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminTransactions from "./AdminTransactions";
import AdminPayouts from "./AdminPayouts";
import AdminHospitals from "./AdminHospitals";
import AdminRevenue from "./AdminRevenue";
import AdminAccounts from "./AdminAccounts";
import AdminSettings from "./AdminSettings";
import { supabase } from "./lib/supabaseClient";

export default function AdminApp() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("staff");
  const [adminName, setAdminName] = useState("");
  const [currentPage, setCurrentPage] = useState("overview");
  const [checkingSession, setCheckingSession] = useState(true);

  // Pull admin details from admin_users for whatever Supabase user is
  // currently signed in, and only then grant console access.
  const restoreFromSession = async (user) => {
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id, email, role, name")
      .eq("id", user.id)
      .single();

    if (adminRow) {
      setAdminEmail(adminRow.email);
      setAdminRole(adminRow.role);
      setAdminName(adminRow.name);
      setIsAdminAuthenticated(true);
    } else {
      // A Supabase session exists, but it's not an admin account —
      // don't let it into the console.
      await supabase.auth.signOut();
      setIsAdminAuthenticated(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // On first load (including every refresh), check whether Supabase
    // already has a valid session for this browser, and restore login
    // state from it instead of always starting at the login screen.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await restoreFromSession(session.user);
      }
      if (mounted) setCheckingSession(false);
    });

    // Keep local state in sync if the session ends elsewhere (e.g. token
    // expiry, or signing out in another tab).
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setIsAdminAuthenticated(false);
        setAdminEmail("");
        setAdminRole("staff");
        setAdminName("");
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (email, role, name) => {
    setAdminEmail(email);
    setAdminRole(role || "staff");
    setAdminName(name || "");
    setIsAdminAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    setAdminEmail("");
    setAdminRole("staff");
    setAdminName("");
    setCurrentPage("overview");
  };

  // Brief loading screen while we check for an existing session, so we
  // don't flash the login form before knowing whether one exists.
  if (checkingSession) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "#0D1526" }}
      >
        <p style={{ color: "#7C8CA8", fontFamily: "Manrope", fontSize: 13, fontWeight: 600 }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      adminEmail={adminEmail}
      adminRole={adminRole}
      adminName={adminName}
    >
      {currentPage === "overview" && <AdminOverview />}
      {currentPage === "users" && <AdminUsers />}
      {currentPage === "transactions" && <AdminTransactions />}
      {currentPage === "payouts" && <AdminPayouts />}
      {currentPage === "hospitals" && <AdminHospitals />}
      {currentPage === "revenue" && <AdminRevenue />}
      {currentPage === "accounts" && <AdminAccounts adminRole={adminRole} />}
      {currentPage === "settings" && <AdminSettings />}
    </AdminLayout>
  );
}