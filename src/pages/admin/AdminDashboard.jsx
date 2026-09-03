import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  listMachines,
  deleteMachine,
} from "@/lib/inventoryService";
import {
  localizeCategory,
  localizeAvailability,
  AVAILABILITY_STYLES,
  formatPrice,
} from "@/lib/inventoryLocalize";
import { useLanguage } from "@/lib/LanguageContext";
import MachineForm from "@/components/admin/MachineForm";

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const [me, setMe] = useState(undefined);
  const [machines, setMachines] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => listMachines().then(setMachines).catch(() => setMachines([]));

  useEffect(() => {
    load();
    import("@/api/base44Client")
      .then(({ base44 }) => base44.auth.me())
      .then((u) => setMe(u))
      .catch(() => setMe(null));
  }, []);

  // Admin role gate (writes are also enforced server-side via RLS).
  if (me && me.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d] text-center text-white">
        <ShieldAlert className="h-10 w-10 text-[#c9a063]" />
        <p className="mt-4 text-[#b0b0b0]">
          {lang === "jp" ? "管理者権限が必要です。" : "Administrator access required."}
        </p>
        <Link to="/" className="mt-4 text-[#c9a063] hover:underline">
          {lang === "jp" ? "ホームへ" : "Back to home"}
        </Link>
      </div>
    );
  }

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setDialogOpen(true);
  };
  const onSaved = async () => {
    setDialogOpen(false);
    setEditing(null);
    await load();
  };
  const onDelete = async (m) => {
    if (!window.confirm(`Delete ${m.manufacturer} ${m.model}?`)) return;
    setBusy(true);
    try {
      await deleteMachine(m.id);
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-body text-white">
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-12 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c9a063]/20 pb-8">
          <div>
            <Link to="/" className="mb-3 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#b0b0b0] hover:text-[#c9a063]">
              <ArrowLeft className="h-3 w-3" /> {lang === "jp" ? "ホームへ" : "BACK TO SITE"}
            </Link>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
              {lang === "jp" ? "在庫管理" : "Inventory Admin"}
            </h1>
            <p className="mt-2 text-sm text-[#b0b0b0]">
              {lang === "jp" ? "機械の追加・編集・削除、写真のアップロードができます。" : "Add, edit and delete machines; upload photos and manage availability."}
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#c9a063] text-[#0d0d0d] hover:opacity-90">
            <Plus className="h-4 w-4" /> {lang === "jp" ? "機械を追加" : "Add machine"}
          </Button>
        </div>

        {machines === null ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#c9a063]" />
          </div>
        ) : machines.length === 0 ? (
          <div className="mt-16 text-center text-sm text-[#b0b0b0]">
            {lang === "jp" ? "機械がありません。追加してください。" : "No machines yet. Add your first."}
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto border border-[#c9a063]/20">
            <table className="w-full text-sm">
              <thead className="bg-[#1a1a1a] text-left text-[10px] uppercase tracking-[0.18em] text-[#b0b0b0]">
                <tr>
                  <th className="px-4 py-3">Machine</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c9a063]/10">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-[#1a1a1a]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden bg-[#0d0d0d]">
                          {m.photos?.[0] && <Image src={m.photos[0]} alt="" className="h-full w-full" fittingType="fill" />}
                        </div>
                        <div>
                          <div className="font-medium text-white">{m.manufacturer} {m.model}</div>
                          <div className="text-[11px] text-[#b0b0b0]">{(m.location || m.locationEn)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#b0b0b0]">{localizeCategory(m.category, "en")}</td>
                    <td className="px-4 py-3 text-[#b0b0b0]">{m.year || "—"}</td>
                    <td className="px-4 py-3 text-[#b0b0b0]">{m.operatingHours != null ? m.operatingHours.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-[#c9a063]">{formatPrice(m) || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`border px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] ${AVAILABILITY_STYLES[m.availability || "available"]}`}>
                        {localizeAvailability(m.availability || "available", "en")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(m)} className="text-[#b0b0b0] hover:text-[#c9a063]">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(m)} disabled={busy} className="text-[#b0b0b0] hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#c9a063]/30 bg-[#0d0d0d] text-white">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wide text-[#c9a063]">
              {editing ? "Edit machine" : "Add machine"}
            </DialogTitle>
          </DialogHeader>
          <MachineForm
            initial={editing}
            onSaved={onSaved}
            onCancel={() => { setDialogOpen(false); setEditing(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
