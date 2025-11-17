/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import ReusableTable from "../components/atoms/ReusableTable";
import StatCard from "../components/atoms/StatCard";
import type { Column } from "../types/types";
import { useEffect, useState } from "react";
import { fetchReservations } from "../services/reservationsApi";
import { computeStatsFromApis, type Stats } from "../services/statsService";
import dayjs from "dayjs";

type RawRow = Record<string, any>;

export default function BookingsPage() {
  const [rows, setRows] = useState<RawRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // derive stats from computed stats so cards stay in sync with the table
  const total = stats
    ? stats.perHall
      ? Object.keys(stats.perHall).length
      : 0
    : 0; // total halls
  const reserved = stats ? stats.reservedStalls : rows.length;
  const available = stats ? stats.availableStalls : Math.max(0, 250 - reserved);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    fetchReservations()
      .then((data: any) => {
        if (!mounted) return;
        const raw: any[] = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];
        const list: RawRow[] = raw.map((r: any) => {
          const obj = r || {};
          obj.businessName =
            obj.businessName ||
            obj.business ||
            obj.company ||
            obj.business_name ||
            null;
          return obj;
        });
        setRows(list.length ? list : []);
      })
      .catch((err) => {
        console.error("Failed to fetch reservations", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    setStatsLoading(true);
    computeStatsFromApis()
      .then((s) => {
        if (!mounted) return;
        setStats(s);
      })
      .catch((err) => {
        console.error("Failed to compute stats", err);
        if (mounted) setStats(null);
      })
      .finally(() => {
        if (mounted) setStatsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const columns: Column<RawRow>[] = [
    { id: "id", header: "ID", field: "id", width: 40, hidden: false },
    { id: "fullName", header: "Full Name", field: "fullName", hidden: false },
    {
      id: "stallIds",
      header: "Stall IDs",
      field: "stallIds",
      hidden: false,
      render: (r: RawRow) => {
        const mapHallToLetters = (hid: unknown) => {
          let n = Number(hid);
          if (!Number.isFinite(n) || n <= 0) {
            const s = String(hid ?? "");
            const m = s.match(/(\d+)$/);
            n = m ? Number(m[1]) : NaN;
          }
          if (!Number.isFinite(n) || n <= 0) return String(hid ?? "");
          let res = "";
          while (n > 0) {
            n -= 1;
            const ch = String.fromCharCode((n % 26) + 65);
            res = ch + res;
            n = Math.floor(n / 26);
          }
          return res;
        };

        const hallLetter = mapHallToLetters(r.hallId ?? r.hall ?? r.hallId);
        const raw = r.stallIds ?? r.stall ?? "";
        const items: string[] = [];
        const formatOne = (val: any) => {
          const num = typeof val === "object" ? val.id ?? val._id ?? val : val;
          const s = String(num ?? "").trim();
          const n = Number(s);
          if (Number.isFinite(n)) return `Hall ${hallLetter} - Stall ${n}`;
          if (/stall/i.test(s)) return `Hall ${hallLetter} - ${s}`;
          return `Hall ${hallLetter} - Stall ${s}`;
        };

        if (Array.isArray(raw)) {
          for (const it of raw) items.push(formatOne(it));
        } else if (typeof raw === "string") {
          const parts = raw.split(/\s*,\s*/).filter(Boolean);
          for (const p of parts) items.push(formatOne(p));
        } else if (raw != null) {
          items.push(formatOne(raw));
        }

        return items.join(", ");
      },
    },
    {
      id: "price",
      header: "Price",
      field: "price",
      hidden: false,
      render: (r: RawRow) =>
        r.price ? `Rs. ${Number(r.price).toFixed(2)}` : "",
    },
    {
      id: "createdAt",
      header: "Created",
      field: "createdAt",
      width: 160,
      hidden: false,
      render: (r: RawRow) =>
        r.createdAt ? dayjs(r.createdAt).format("MMMM D, YYYY HH:mm") : "",
    },
    {
      id: "businessName",
      header: "Business",
      field: "businessName",
      hidden: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
          px: 8,
        }}
      >
        <StatCard
          title="Total Halls"
          value={total}
          subtitle={`Halls allocated for reservation`}
          colorKey="total"
        />
        <StatCard
          title="Available Stalls"
          value={available}
          subtitle={`Currently available`}
          colorKey="available"
        />
        <StatCard
          title="Reserved Stalls"
          value={reserved}
          subtitle={`Reserved`}
          colorKey="reserved"
        />
      </Box>

      <ReusableTable
        columns={columns}
        rows={rows}
        showSearch
        searchPlaceholder="Search stalls, names..."
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
        toolbarActions={null}
        showAllFields={true}
        allowColumnSelector={true}
        excludedColumnIds={[
          "userId",
          "hallId",
          "isPaid",
          "updatedAt",
          "businessadress",
          "businessAddress",
          "business_address",
          "businessAdress",
          "address",
        ]}
        headerMappings={{
          contactNumber: "Phone",
          contact: "Phone",
          email: "Email",
          note: "Note",
          businessName: "Business",
          createdAt: "Created",
          stallIds: "Stall IDs",
        }}
        loading={loading}
      />
    </Box>
  );
}
