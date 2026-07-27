import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, AdminButton } from "./components/admin-ui";
import { supabase } from "./lib/supabaseClient";

const fmt = (n) => "UGX " + Number(n || 0).toLocaleString("en-UG");

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [advanceOpenFor, setAdvanceOpenFor] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    const [{ data: userRows }, { data: groupRows }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("groups").select("id, name"),
    ]);
    setUsers(userRows || []);
    setGroups(groupRows || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query);
    const matchesStatus = statusFilter === "All" ? true : u.status === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setBusyId(user.id);
    const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", user.id);
    setBusyId(null);
    if (!error) setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
  };

  const assignGroup = async (user, groupId) => {
    setBusyId(user.id);
    const { error } = await supabase.from("profiles").update({ group_id: groupId || null }).eq("id", user.id);
    setBusyId(null);
    if (!error) setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, group_id: groupId || null } : u)));
  };

  const submitAdvance = async (user) => {
    const amount = Number(advanceAmount.replace(/[^0-9]/g, "")) || 0;
    if (amount <= 0) return;

    setBusyId(user.id);
    const { error } = await supabase.rpc("grant_emergency_advance", {
      p_user_id: user.id,
      p_amount: amount,
    });
    setBusyId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setAdvanceOpenFor(null);
    setAdvanceAmount("");
    load(); // refresh to show new balance / debt / multiplier
  };

  return (
    <div>
      <AdminPageHeader title="Users" subtitle={`${users.length.toLocaleString()} registered accounts`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} color="#5B6472" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] outline-none"
            style={{ border: "1px solid #E4E7EC", background: "#FFFFFF", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
          />
        </div>
        <div className="flex gap-2">
          {["All", "Active", "Suspended"].map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-2 rounded-[10px] text-[12px] shrink-0"
                style={{
                  background: active ? "#16294D" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#5B6472",
                  border: "1px solid " + (active ? "#16294D" : "#E4E7EC"),
                  fontFamily: "Manrope",
                  fontWeight: 700,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <AdminCard className="divide-y" style={{ borderColor: "#E4E7EC" }}>
        {loading && <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Loading...</p>}

        {!loading && filtered.map((u) => {
          const inRecovery = Number(u.debt_balance) > 0;
          const busy = busyId === u.id;
          return (
            <div key={u.id} className="px-4 py-4" style={{ borderTop: "1px solid #EEF0F2" }}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{u.name}</p>
                    <Badge variant={u.network?.toLowerCase()}>{u.network}</Badge>
                    <Badge variant={u.status}>{u.status}</Badge>
                    {inRecovery && <Badge variant="pending">recovery · {u.multiplier}x</Badge>}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "#5B6472", fontFamily: "IBM Plex Mono" }}>{u.phone}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(u.balance)}</p>
                    {inRecovery && (
                      <p className="text-[10.5px]" style={{ color: "#B07C0E", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>
                        debt: {fmt(u.debt_balance)}
                      </p>
                    )}
                  </div>
                  <AdminButton variant={u.status === "active" ? "danger" : "success"} onClick={() => toggleStatus(u)} disabled={busy}>
                    {u.status === "active" ? "Suspend" : "Reactivate"}
                  </AdminButton>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                    Group
                  </span>
                  <select
                    value={u.group_id || ""}
                    onChange={(e) => assignGroup(u, e.target.value)}
                    disabled={busy}
                    className="px-2.5 py-1.5 rounded-[8px] outline-none text-[11.5px]"
                    style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", color: "#101828" }}
                  >
                    <option value="">No group (9:1 split)</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name} (7:2:1 split)</option>
                    ))}
                  </select>
                </div>

                {advanceOpenFor === u.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      placeholder="Amount UGX"
                      inputMode="numeric"
                      autoFocus
                      className="px-2.5 py-1.5 rounded-[8px] outline-none text-[11.5px] w-32"
                      style={{ border: "1px solid #E4E7EC", fontFamily: "IBM Plex Mono", color: "#101828" }}
                    />
                    <AdminButton variant="primary" onClick={() => submitAdvance(u)} disabled={busy}>Send</AdminButton>
                    <AdminButton variant="ghost" onClick={() => { setAdvanceOpenFor(null); setAdvanceAmount(""); }}>Cancel</AdminButton>
                  </div>
                ) : (
                  <AdminButton variant="ghost" onClick={() => setAdvanceOpenFor(u.id)} disabled={busy}>
                    Grant emergency advance
                  </AdminButton>
                )}
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>No users match this search.</p>
        )}
      </AdminCard>
    </div>
  );
}