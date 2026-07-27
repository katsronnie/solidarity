import React, { useEffect, useState } from "react";
import { Plus, X, Users2 } from "lucide-react";
import { AdminCard, AdminPageHeader, AdminSectionLabel, Badge, AdminButton } from "./components/admin-ui";
import { supabase } from "./lib/supabaseClient";

const fmt = (n) => "UGX " + Number(n || 0).toLocaleString("en-UG");

export default function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("family");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: groupRows } = await supabase.from("groups").select("*").order("created_at", { ascending: false });
    setGroups(groupRows || []);

    const { data: profileRows } = await supabase.from("profiles").select("group_id");
    const counts = {};
    (profileRows || []).forEach((p) => {
      if (p.group_id) counts[p.group_id] = (counts[p.group_id] || 0) + 1;
    });
    setMemberCounts(counts);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }
    setSaving(true);
    const { error: insertError } = await supabase.from("groups").insert({ name: name.trim(), type });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName("");
    setType("family");
    setShowForm(false);
    setError("");
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Groups"
        subtitle="Community & family groups — each gets 20% of its members' savings, pooled together"
      />

      {!showForm ? (
        <AdminButton variant="primary" onClick={() => setShowForm(true)}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> New group</span>
        </AdminButton>
      ) : (
        <AdminCard className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <AdminSectionLabel>New group</AdminSectionLabel>
            <button onClick={() => { setShowForm(false); setName(""); setError(""); }}>
              <X size={16} color="#5B6472" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                  Group name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nakato Family Circle"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                  style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                  style={{ border: "1px solid #E4E7EC", fontFamily: "Manrope", fontSize: 13, color: "#101828" }}
                >
                  <option value="family">Family</option>
                  <option value="community">Community</option>
                </select>
              </div>
            </div>
            {error && <p className="text-[11.5px]" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>}
            <div className="flex gap-2">
              <AdminButton variant="primary" type="submit">{saving ? "Creating..." : "Create group"}</AdminButton>
              <AdminButton variant="ghost" type="button" onClick={() => { setShowForm(false); setName(""); setError(""); }}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <div className="mt-6">
        <AdminSectionLabel right={<span className="text-[11px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{groups.length} groups</span>}>
          All groups
        </AdminSectionLabel>
        <AdminCard className="divide-y" style={{ borderColor: "#E4E7EC" }}>
          {loading && <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Loading...</p>}
          {!loading && groups.length === 0 && (
            <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>
              No groups yet — create the first one above.
            </p>
          )}
          {!loading && groups.map((g) => (
            <div key={g.id} className="flex items-center gap-3 px-4 py-3.5" style={{ borderTop: "1px solid #EEF0F2" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F4F5F7" }}>
                <Users2 size={16} color="#16294D" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{g.name}</p>
                  <Badge variant={g.type === "family" ? "active" : "pending"}>{g.type}</Badge>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: "#5B6472", fontFamily: "Manrope" }}>
                  {memberCounts[g.id] || 0} member{(memberCounts[g.id] || 0) === 1 ? "" : "s"}
                </p>
              </div>
              <p className="text-[13px] shrink-0" style={{ color: "#101828", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>
                {fmt(g.balance)}
              </p>
            </div>
          ))}
        </AdminCard>
      </div>
    </div>
  );
}