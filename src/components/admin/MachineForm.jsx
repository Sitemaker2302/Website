import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { createMachine, updateMachine, uploadMachinePhoto } from "@/lib/inventoryService";
import { config } from "@/lib/config";

const EMPTY = {
  manufacturer: "",
  model: "",
  year: "",
  operatingHours: "",
  price: "",
  currency: config.currency,
  condition: "Used",
  location: "",
  locationEn: "",
  description: "",
  descriptionJp: "",
  category: "",
  photos: [],
  availability: "available",
};

export default function MachineForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initial ? {
      ...initial,
      year: initial.year ?? "",
      operatingHours: initial.operatingHours ?? "",
      price: initial.price ?? "",
      photos: initial.photos || [],
    } : {}),
  }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadMachinePhoto(f)));
      setField("photos", [...(form.photos || []), ...urls]);
    } catch {
      setError("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (idx) =>
    setField("photos", (form.photos || []).filter((_, i) => i !== idx));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.manufacturer || !form.model) {
      setError("Manufacturer and model are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        manufacturer: form.manufacturer.trim(),
        model: form.model.trim(),
        year: form.year === "" ? null : Number(form.year),
        operatingHours: form.operatingHours === "" ? null : Number(form.operatingHours),
        price: form.price === "" ? null : Number(form.price),
        currency: form.currency || "JPY",
        condition: form.condition,
        location: form.location,
        locationEn: form.locationEn,
        description: form.description,
        descriptionJp: form.descriptionJp,
        category: form.category,
        photos: form.photos || [],
        availability: form.availability,
      };
      if (initial) await updateMachine(initial.id, payload);
      else await createMachine(payload);
      onSaved();
    } catch (err) {
      setError(err?.message || "Could not save machine.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "bg-[#1a1a1a] border-[#c9a063]/40 text-white focus:border-[#c9a063]";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Manufacturer *">
          <Input value={form.manufacturer} onChange={(e) => setField("manufacturer", e.target.value)} className={inputCls} required />
        </Field>
        <Field label="Model *">
          <Input value={form.model} onChange={(e) => setField("model", e.target.value)} className={inputCls} required />
        </Field>
        <Field label="Category">
          <Input value={form.category} onChange={(e) => setField("category", e.target.value)} className={inputCls} placeholder="e.g. Wheel Loader" />
        </Field>
        <Field label="Condition">
          <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#c9a063]/40 text-white">
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="New">New</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Year">
          <Input type="number" value={form.year} onChange={(e) => setField("year", e.target.value)} className={inputCls} placeholder="e.g. 2015" />
        </Field>
        <Field label="Operating Hours">
          <Input type="number" value={form.operatingHours} onChange={(e) => setField("operatingHours", e.target.value)} className={inputCls} placeholder="e.g. 4200" />
        </Field>
        <Field label="Location (Japanese)">
          <Input value={form.location} onChange={(e) => setField("location", e.target.value)} className={inputCls} placeholder="月形町, 北海道, 日本" />
        </Field>
        <Field label="Location (Romaji)">
          <Input value={form.locationEn} onChange={(e) => setField("locationEn", e.target.value)} className={inputCls} placeholder="Tsukigata-cho, Hokkaido, Japan" />
        </Field>
        <Field label="Availability">
          <Select value={form.availability} onValueChange={(v) => setField("availability", v)}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#c9a063]/40 text-white">
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Description (English)">
        <Textarea rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} className={inputCls} />
      </Field>
      <Field label="Description (Japanese)">
        <Textarea rows={3} value={form.descriptionJp} onChange={(e) => setField("descriptionJp", e.target.value)} className={inputCls} />
      </Field>

      {/* Photos */}
      <Field label="Photos">
        <div className="flex flex-wrap gap-3">
          {(form.photos || []).map((url, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden border border-[#c9a063]/30">
              <Image src={url} alt="" className="h-full w-full" fittingType="fill" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-0 top-0 bg-black/70 p-0.5 text-white hover:bg-black"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-[#c9a063]/40 text-[10px] text-[#b0b0b0] hover:border-[#c9a063]">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-[#c9a063]" /> : <Upload className="h-4 w-4 text-[#c9a063]" />}
            {uploading ? "Uploading" : "Upload"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
          </label>
        </div>
      </Field>

      {error && <p className="border border-red-600/40 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-[#b0b0b0] hover:text-white">
          Cancel
        </Button>
        <Button type="submit" disabled={saving || uploading} className="bg-[#c9a063] text-[#0d0d0d] hover:opacity-90">
          {saving ? "Saving…" : initial ? "Save changes" : "Add machine"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label className="mb-1.5 block text-[11px] tracking-[0.18em] text-[#b0b0b0]">{label}</Label>
      {children}
    </div>
  );
}
