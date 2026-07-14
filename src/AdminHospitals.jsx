import React, { useEffect, useState } from "react";
import { Building2, Plus, X, Trash2, BadgeCheck } from "lucide-react";
import { AdminCard, AdminPageHeader, AdminSectionLabel, Badge, AdminButton } from "./components/admin-ui";
import { supabase } from "./lib/supabaseClient";

const EMPTY_FORM = {
  name: "",
  location: "",
  category: "Public",
  address: "",
  contact_phone: "",
  mtn_merchant_id: "",
  airtel_merchant_id: "",
  verified: false,
};

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadHospitals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else {
      setHospitals(data);
      setLoadError("");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Hospital name is required.";
    if (!form.location.trim()) next.location = "Location is required.";

    const mtn = form.mtn_merchant_id.trim();
    const airtel = form.airtel_merchant_id.trim();

    if (mtn && !/^\d{8}$/.test(mtn)) next.mtn_merchant_id = "MTN MoMo Pay merchant ID must be exactly 8 digits.";
    if (airtel && !/^\d{7}$/.test(airtel)) next.airtel_merchant_id = "Airtel Money merchant ID must be exactly 7 digits.";
    if (!mtn && !airtel) {
      next.mtn_merchant_id = "Enter at least one merchant ID (MTN or Airtel) so this hospital can receive payments.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const { error } = await supabase.from("hospitals").insert({
      name: form.name.trim(),
      location: form.location.trim(),
      category: form.category,
      address: form.address.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
      mtn_merchant_id: form.mtn_merchant_id.trim() || null,
      airtel_merchant_id: form.airtel_merchant_id.trim() || null,
      verified: form.verified,
    });
    setSaving(false);

    if (error) {
      setErrors({ submit: error.message });
      return;
    }

    setForm(EMPTY_FORM);
    setShowForm(false);
    loadHospitals();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("hospitals").delete().eq("id", id);
    if (!error) setHospitals((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleVerified = async (h) => {
    const { error } = await supabase.from("hospitals").update({ verified: !h.verified }).eq("id", h.id);
    if (!error) setHospitals((prev) => prev.map((x) => (x.id === h.id ? { ...x, verified: !x.verified } : x)));
  };

  return (
    <div>
      <AdminPageHeader title="Hospitals" subtitle="Register facilities and their mobile money merchant IDs for direct payment" />

      {!showForm ? (
        <AdminButton variant="primary" onClick={() => setShowForm(true)}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> Register a hospital</span>
        </AdminButton>
      ) : (
        <AdminCard className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <AdminSectionLabel>New hospital</AdminSectionLabel>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}); }}>
              <X size={16} color="#5B6472" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Hospital name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Mengo Hospital"
                  style={inputStyle(errors.name)}
                />
              </Field>

              <Field label="Location / town" error={errors.location}>
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Kampala"
                  style={inputStyle(errors.location)}
                />
              </Field>

              <Field label="Category">
                <select value={form.category} onChange={(e) => updateField("category", e.target.value)} style={inputStyle()}>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </Field>

              <Field label="Contact phone (optional)">
                <input
                  value={form.contact_phone}
                  onChange={(e) => updateField("contact_phone", e.target.value)}
                  placeholder="07XX XXX XXX"
                  style={inputStyle()}
                />
              </Field>

              <Field label="Address (optional)" className="md:col-span-2">
                <input
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Street / plot number"
                  style={inputStyle()}
                />
              </Field>
            </div>

            <div className="pt-2" style={{ borderTop: "1px solid #E4E7EC" }}>
              <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                Payout destination — where funds are sent when a user pays this hospital
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="MTN MoMo Pay merchant ID" error={errors.mtn_merchant_id} hint="Exactly 8 digits">
                  <input
                    value={form.mtn_merchant_id}
                    onChange={(e) => updateField("mtn_merchant_id", e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="e.g. 12345678"
                    inputMode="numeric"
                    style={{ ...inputStyle(errors.mtn_merchant_id), fontFamily: "IBM Plex Mono", letterSpacing: 2 }}
                  />
                </Field>

                <Field label="Airtel Money merchant ID" error={errors.airtel_merchant_id} hint="Exactly 7 digits">
                  <input
                    value={form.airtel_merchant_id}
                    onChange={(e) => updateField("airtel_merchant_id", e.target.value.replace(/\D/g, "").slice(0, 7))}
                    placeholder="e.g. 1234567"
                    inputMode="numeric"
                    style={{ ...inputStyle(errors.airtel_merchant_id), fontFamily: "IBM Plex Mono", letterSpacing: 2 }}
                  />
                </Field>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.verified} onChange={(e) => updateField("verified", e.target.checked)} />
              <span className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 600 }}>
                Mark as verified (shown with a badge to users)
              </span>
            </label>

            {errors.submit && (
              <p className="text-[11.5px]" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>{errors.submit}</p>
            )}

            <div className="flex gap-2">
              <AdminButton variant="primary" type="submit">
                {saving ? "Saving..." : "Register hospital"}
              </AdminButton>
              <AdminButton variant="ghost" type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}); }}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <div className="mt-6">
        <AdminSectionLabel right={<span className="text-[11px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{hospitals.length} registered</span>}>
          Registered facilities
        </AdminSectionLabel>

        {loadError && (
          <p className="text-[12px] mb-3" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>
            Couldn't load hospitals: {loadError}
          </p>
        )}

        <AdminCard className="divide-y" style={{ borderColor: "#E4E7EC" }}>
          {loading && (
            <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Loading...</p>
          )}

          {!loading && hospitals.length === 0 && (
            <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>
              No hospitals registered yet — add the first one above.
            </p>
          )}

          {hospitals.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-4" style={{ borderTop: "1px solid #EEF0F2" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F4F5F7" }}>
                <Building2 size={16} color="#16294D" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{h.name}</p>
                  {h.verified && <BadgeCheck size={13} color="#1F9D63" />}
                  <Badge variant={h.category === "Public" ? "active" : "pending"}>{h.category}</Badge>
                </div>
                <p className="text-[11.5px] mt-1" style={{ color: "#5B6472", fontFamily: "Manrope" }}>{h.location}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {h.mtn_merchant_id && (
                    <span className="text-[10.5px] flex items-center gap-1" style={{ color: "#8A6D00", fontFamily: "IBM Plex Mono" }}>
                      MTN: {h.mtn_merchant_id}
                    </span>
                  )}
                  {h.airtel_merchant_id && (
                    <span className="text-[10.5px] flex items-center gap-1" style={{ color: "#C23B3B", fontFamily: "IBM Plex Mono" }}>
                      Airtel: {h.airtel_merchant_id}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <AdminButton variant={h.verified ? "ghost" : "success"} onClick={() => toggleVerified(h)}>
                  {h.verified ? "Unverify" : "Verify"}
                </AdminButton>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: "#FDEDEE" }}
                >
                  <Trash2 size={14} color="#E5484D" />
                </button>
              </div>
            </div>
          ))}
        </AdminCard>
      </div>
    </div>
  );
}

function Field({ label, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && (
        <p className="mt-1 text-[10.5px]" style={{ color: "#8A97A8", fontFamily: "Manrope" }}>{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-[10.5px]" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>
      )}
    </div>
  );
}

function inputStyle(error) {
  return {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    outline: "none",
    border: `1px solid ${error ? "#E5484D" : "#E4E7EC"}`,
    fontFamily: "Manrope",
    fontSize: 13,
    color: "#101828",
  };
}
