import React, { useEffect, useState } from "react";
import { UserPlus, X, ShieldAlert, Trash2 } from "lucide-react";
import { AdminCard, AdminPageHeader, AdminSectionLabel, Badge, AdminButton } from "./components/admin-ui";
import { supabase } from "./lib/supabaseClient";

const EMPTY_FORM = { name: "", email: "", password: "", role: "staff" };

export default function AdminAccounts({ adminRole }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [rowBusyId, setRowBusyId] = useState(null);

  const isMaster = adminRole === "master";

  const loadAdmins = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    const { data, error: loadError } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: true });

    if (!loadError) setAdmins(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are all required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    const { data, error: fnError } = await supabase.functions.invoke("create-admin", {
      body: { name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role },
    });
    setSaving(false);

    if (fnError || data?.error) {
      setError(data?.error || fnError.message || "Could not create the admin account.");
      return;
    }

    setForm(EMPTY_FORM);
    setShowForm(false);
    loadAdmins();
  };

  const handleRoleToggle = async (admin) => {
    const newRole = admin.role === "master" ? "staff" : "master";
    setRowBusyId(admin.id);
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ role: newRole })
      .eq("id", admin.id);
    setRowBusyId(null);

    if (!updateError) {
      setAdmins((prev) => prev.map((a) => (a.id === admin.id ? { ...a, role: newRole } : a)));
    }
  };

  const handleDelete = async (admin) => {
    if (admin.id === currentUserId) return; // safety net, button is hidden for self anyway
    const confirmed = window.confirm(`Remove ${admin.name} (${admin.email})? This deletes their login entirely.`);
    if (!confirmed) return;

    setRowBusyId(admin.id);
    const { data, error: fnError } = await supabase.functions.invoke("delete-admin", {
      body: { id: admin.id },
    });
    setRowBusyId(null);

    if (fnError || data?.error) {
      alert(data?.error || fnError.message || "Could not remove this admin.");
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
  };

  if (!isMaster) {
    return (
      <div>
        <AdminPageHeader title="Admin accounts" />
        <AdminCard className="p-6 flex items-start gap-3">
          <ShieldAlert size={18} color="#B07C0E" className="shrink-0 mt-0.5" />
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 500 }}>
            Only the master admin can view or manage admin accounts. Ask your master admin
            to add you or grant this access.
          </p>
        </AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Admin accounts" subtitle="Manage who has access to this console" />

      {!showForm ? (
        <AdminButton variant="primary" onClick={() => setShowForm(true)}>
          <span className="flex items-center gap-1.5"><UserPlus size={14} /> Add admin</span>
        </AdminButton>
      ) : (
        <AdminCard className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <AdminSectionLabel>New admin account</AdminSectionLabel>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError(""); }}>
              <X size={16} color="#5B6472" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                  style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                  style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                  Temporary password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="They should change this after first login"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                  style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                  style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
                >
                  <option value="staff">Staff (normal access)</option>
                  <option value="master">Master (can manage other admins)</option>
                </select>
              </div>
            </div>

            {error && <p className="text-[11.5px]" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>}

            <div className="flex gap-2">
              <AdminButton variant="primary" type="submit">{saving ? "Creating..." : "Create admin"}</AdminButton>
              <AdminButton variant="ghost" type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError(""); }}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <div className="mt-6">
        <AdminSectionLabel right={<span className="text-[11px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{admins.length} accounts</span>}>
          All admin accounts
        </AdminSectionLabel>
        <AdminCard className="divide-y" style={{ borderColor: "#E4E7EC" }}>
          {loading && <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Loading...</p>}

          {!loading && admins.map((a) => {
            const isSelf = a.id === currentUserId;
            const busy = rowBusyId === a.id;
            return (
              <div key={a.id} className="flex items-center justify-between px-4 py-3.5 gap-3" style={{ borderTop: "1px solid #EEF0F2" }}>
                <div className="min-w-0">
                  <p className="text-[12.5px] truncate" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>
                    {a.name} {isSelf && <span style={{ color: "#8A97A8", fontWeight: 500 }}>(you)</span>}
                  </p>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: "#5B6472", fontFamily: "Manrope" }}>{a.email}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={a.role === "master" ? "active" : "pending"}>{a.role}</Badge>

                  {!isSelf && (
                    <>
                      <AdminButton variant="ghost" onClick={() => handleRoleToggle(a)} disabled={busy}>
                        {a.role === "master" ? "Make staff" : "Make master"}
                      </AdminButton>
                      <button
                        onClick={() => handleDelete(a)}
                        disabled={busy}
                        className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ background: "#FDEDEE", opacity: busy ? 0.6 : 1 }}
                      >
                        <Trash2 size={14} color="#E5484D" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </AdminCard>
      </div>
    </div>
  );
}