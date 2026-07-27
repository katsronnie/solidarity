import React, { useEffect, useState } from "react";
import { Users2, Home, Plus, X, Check } from "lucide-react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { supabase } from "./lib/supabaseClient";

export default function GroupPage({ onNavigate }) {
  const [userId, setUserId] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [tab, setTab] = useState("family"); // "family" | "community"
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("group_id")
      .eq("id", user.id)
      .single();
    setCurrentGroupId(profile?.group_id || null);

    if (profile?.group_id) {
      const { data: grp } = await supabase.from("groups").select("*").eq("id", profile.group_id).single();
      setCurrentGroup(grp || null);
      // Default the browse tab to match their current group's type.
      if (grp?.type) setTab(grp.type);
    } else {
      setCurrentGroup(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    // Load the browsable list whenever the tab changes.
    supabase
      .from("groups")
      .select("id, name, type")
      .eq("type", tab)
      .order("created_at", { ascending: false })
      .then(({ data }) => setGroups(data || []));
  }, [tab]);

  const joinGroup = async (groupId) => {
    setBusy(true);
    const { error: updateError } = await supabase.from("profiles").update({ group_id: groupId }).eq("id", userId);
    setBusy(false);
    if (!updateError) load();
  };

  const leaveGroup = async () => {
    setBusy(true);
    const { error: updateError } = await supabase.from("profiles").update({ group_id: null }).eq("id", userId);
    setBusy(false);
    if (!updateError) load();
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError("Give your group a name.");
      return;
    }
    setBusy(true);
    setError("");

    const { data: created, error: insertError } = await supabase
      .from("groups")
      .insert({ name: newName.trim(), type: tab })
      .select()
      .single();

    if (insertError) {
      setBusy(false);
      setError(insertError.message);
      return;
    }

    await supabase.from("profiles").update({ group_id: created.id }).eq("id", userId);
    setBusy(false);
    setNewName("");
    setShowCreate(false);
    load();
  };

  return (
    <div className="px-5 pb-32 max-w-lg mx-auto">
      <PageHeader title="Your Group" onNavigate={onNavigate} />

      {/* Current status */}
      <Card
        className="p-5 mb-6"
        style={{ background: currentGroup ? "#DCEDE7" : "#F6F3EC" }}
      >
        {loading ? (
          <p className="text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Loading...</p>
        ) : currentGroup ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FFFFFF" }}>
              <Users2 size={18} color="#0E4B43" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px]" style={{ color: "#0E4B43", fontFamily: "Manrope", fontWeight: 700 }}>{currentGroup.name}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 600 }}>
                7:2:1 split — 70% you, 20% this group, 10% global pool
              </p>
            </div>
            <button
              onClick={leaveGroup}
              disabled={busy}
              className="text-[11px] shrink-0"
              style={{ color: "#E8604C", fontFamily: "Manrope", fontWeight: 700 }}
            >
              Leave
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FFFFFF" }}>
              <Home size={18} color="#8A9690" />
            </div>
            <div>
              <p className="text-[13.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>No group yet</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600 }}>
                9:1 split — 90% you, 10% global pool
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: "family", label: "Family groups" },
          { id: "community", label: "Community groups" },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setShowCreate(false); }}
              className="px-3.5 py-1.5 rounded-full text-[12px]"
              style={{
                background: active ? "#0E4B43" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#5C6B64",
                border: "1px solid " + (active ? "#0E4B43" : "#E5DFD0"),
                fontFamily: "Manrope",
                fontWeight: 700,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <SectionLabel
        right={
          !showCreate && (
            <button
              onClick={() => setShowCreate(true)}
              className="text-[11px] flex items-center gap-1"
              style={{ color: "#0E4B43", fontFamily: "Manrope", fontWeight: 700 }}
            >
              <Plus size={12} /> Start a new {tab} group
            </button>
          )
        }
      >
        Choose a group
      </SectionLabel>

      {showCreate && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>
              New {tab} group
            </p>
            <button onClick={() => { setShowCreate(false); setError(""); }}>
              <X size={15} color="#8A9690" />
            </button>
          </div>
          <form onSubmit={createGroup} className="flex flex-col gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={tab === "family" ? "e.g. Nakato Family Circle" : "e.g. Kireka Neighbors"}
              className="w-full px-3.5 py-2.5 rounded-[12px] outline-none"
              style={{ border: "1px solid #E5DFD0", fontFamily: "Manrope", fontSize: 13, color: "#14231F" }}
            />
            {error && <p className="text-[11px]" style={{ color: "#E8604C", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2.5 rounded-[12px] text-[12.5px]"
              style={{ background: "#0E4B43", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700 }}
            >
              {busy ? "Creating..." : "Create & join"}
            </button>
          </form>
        </Card>
      )}

      <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
        {groups.length === 0 && (
          <p className="text-center py-8 text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
            No {tab} groups yet — start the first one above.
          </p>
        )}
        {groups.map((g) => {
          const isCurrent = g.id === currentGroupId;
          return (
            <div key={g.id} className="flex items-center gap-3 px-4 py-3.5" style={{ borderTop: "1px solid #EFEBE0" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F6F3EC" }}>
                <Users2 size={15} color="#0E4B43" />
              </div>
              <p className="flex-1 text-[13px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>{g.name}</p>
              {isCurrent ? (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>
                  <Check size={13} /> Joined
                </span>
              ) : (
                <button
                  onClick={() => joinGroup(g.id)}
                  disabled={busy}
                  className="text-[11.5px] px-3 py-1.5 rounded-full"
                  style={{ background: "#0E4B43", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700 }}
                >
                  Join
                </button>
              )}
            </div>
          );
        })}
      </Card>

      <p className="mt-4 text-[11px] text-center leading-relaxed" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 500 }}>
        You can switch or leave your group anytime. If you never choose one, your savings simply follow the 9:1 split instead.
      </p>
    </div>
  );
}