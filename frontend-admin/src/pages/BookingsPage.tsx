/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import ReusableTable from "../components/atoms/ReusableTable";
import StatCard from "../components/atoms/StatCard";
import type { Column } from "../types/types";
import { useEffect, useState } from "react";
import { fetchReservations } from "../services/reservationsApi";
import dayjs from "dayjs";

type RawRow = Record<string, any>;

const mockRows: RawRow[] = [
  {
    id: "01",
    fullName: "John Smith",
    stallIds: ["Hall D - Stall 4"],
    createdAt: "2025-10-28T00:00:00.000Z",
    businessName: "-",
  },
];

export default function BookingsPage() {
  const [rows, setRows] = useState<RawRow[]>(mockRows);
  const [loading, setLoading] = useState(false);

  // derive stats from rows so cards stay in sync with the table
  const total = rows.length; // assume reservations list contains total reserved items
  const reserved = rows.length;
  const available = Math.max(0, 250 - reserved);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchReservations()
      .then((data: any) => {
        if (!mounted) return;
        // keep raw objects so we can visualize all backend fields
        const raw: any[] = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];
        // normalize business name and ensure object shape
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
        setRows(list.length ? list : mockRows);
      })
      .catch((err) => {
        console.error("Failed to fetch reservations", err);
        // keep mockRows on error
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const columns: Column<RawRow>[] = [
    { id: "id", header: "ID", field: "id", width: 40 },
    { id: "fullName", header: "Full Name", field: "fullName" },
    {
      id: "stallIds",
      header: "Stall IDs",
      field: "stallIds",
      render: (r: RawRow) => {
        // Map numeric/string hallId to letters: 1 -> A, 2 -> B, ... 27 -> AA
        const mapHallToLetters = (hid: unknown) => {
          let n = Number(hid);
          if (!Number.isFinite(n) || n <= 0) {
            // try parse if string like 'hall-2'
            const s = String(hid ?? "");
            const m = s.match(/(\d+)$/);
            n = m ? Number(m[1]) : NaN;
          }
          if (!Number.isFinite(n) || n <= 0) return String(hid ?? "");
          // convert to letters (spreadsheet-style)
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
          // if it's numeric, render as 'Hall X - Stall N'
          const n = Number(s);
          if (Number.isFinite(n)) return `Hall ${hallLetter} - Stall ${n}`;
          // if already contains 'stall' or 'Stall', just prefix hall
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
      render: (r: RawRow) =>
        r.price ? `Rs. ${Number(r.price).toFixed(2)}` : "",
    },
    {
      id: "createdAt",
      header: "Created",
      field: "createdAt",
      width: 160,
      render: (r: RawRow) =>
        r.createdAt ? dayjs(r.createdAt).format("MMMM D, YYYY HH:mm") : "",
    },
    // single business column — backend may use different keys (businessName/business/company)
    { id: "businessName", header: "Business", field: "businessName" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
        }}
      >
        <StatCard
          title="Total Stalls"
          value={total}
          subtitle={`Halls allocated for reservation: 12`}
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
      />
    </Box>
  );
}
