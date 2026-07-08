import React, { useState } from "react";
import { Search } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, AdminButton } from "./components/admin-ui";
import { USERS as INITIAL, fmt } from "./lib/adminData";

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query);
    const matchesStatus = statusFilter === "All" ? true : u.status === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u))
    );
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

      <AdminCard className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.6fr_1fr_0.8fr_1fr_0.8fr_0.9fr] gap-2 px-4 py-3" style={{ background: "#F9FAFB", borderBottom: "1px solid #E4E7EC" }}>
          {["User", "Phone", "Network", "Balance", "Status", ""].map((h) => (
            <span key={h} className="text-[10.5px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {filtered.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_0.8fr_1fr_0.8fr_0.9fr] gap-2 px-4 py-3.5 items-center"
            style={{ borderTop: "1px solid #EEF0F2" }}
          >
            <div>
              <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{u.name}</p>
              <p className="md:hidden text-[11px] mt-0.5" style={{ color: "#5B6472", fontFamily: "Manrope" }}>{u.phone}</p>
            </div>
            <span className="hidden md:block text-[12px]" style={{ color: "#5B6472", fontFamily: "IBM Plex Mono" }}>{u.phone}</span>
            <span className="hidden md:block"><Badge variant={u.network.toLowerCase()}>{u.network}</Badge></span>
            <span className="text-[12.5px]" style={{ color: "#101828", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(u.balance)}</span>
            <span className="hidden md:block"><Badge variant={u.status}>{u.status}</Badge></span>
            <div className="flex justify-end md:justify-start">
              <AdminButton variant={u.status === "active" ? "danger" : "success"} onClick={() => toggleStatus(u.id)}>
                {u.status === "active" ? "Suspend" : "Reactivate"}
              </AdminButton>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>No users match this search.</p>
        )}
      </AdminCard>
    </div>
  );
}
