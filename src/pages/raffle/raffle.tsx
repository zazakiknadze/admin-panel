import { Raffle, RafflePrize, RaffleStatus } from "@/interfaces/raffle";
import { SortOrder } from "@/interfaces/shared";
import { useRaffleData } from "@/pages/raffle/hooks/useRaffleData";
import RaffleTable from "@/pages/raffle/raffleTable";
import { handleChangePageFunction, handleSortFunction } from "@/utils/helpers";
import { Add, FileDownload } from "@mui/icons-material";
import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Raffle = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [statusFilter, setStatusFilter] = useState<RaffleStatus | "All">("All");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  const handleSort = (columnId: string) => {
    handleSortFunction(columnId, sortBy, setSortOrder, setSortBy);
  };

  const { data, isLoading, error, refetch } = useRaffleData({
    _page: page + 1,
    _limit: rowsPerPage,
    status: statusFilter === "All" ? undefined : statusFilter,
    startDate_gte: startDateFilter || undefined,
    endDate_lte: endDateFilter || undefined,
  });

  const handleResetFilters = () => {
    setStatusFilter("All");
    setStartDateFilter("");
    setEndDateFilter("");
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    handleChangePageFunction(_, newPage, setPage, setSortBy, setSortOrder);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = data?.data || [];

  const rowsWithSortId = rows.map((rows: Raffle) => ({
    ...rows,
    sortId: Number(rows.id),
  }));

  const total = data?.total || 0;

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Status",
      "Start Date",
      "End Date",
      "Draw Date",
      "Created At",
      "Updated At",
      "Ticket Price",
      "Max Tickets Per User",
      "Total Ticket Limit",
      "Prizes",
    ].join(",");

    const csvContent = rowsWithSortId
      .map((r: Raffle) =>
        [
          r.id,
          `"${r.name}"`,
          r.status,
          r.startDate,
          r.endDate,
          r.drawDate,
          r.createdAt,
          r.updatedAt,
          r.ticketPrice,
          r.maxTicketsPerUser,
          r.totalTicketLimit,
          r.prizes.map((p: RafflePrize) => p.name).join(","),
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${csvContent}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raffles_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 2,
          py: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as RaffleStatus);
              setPage(0);
            }}
            sx={{ width: 160 }}
          >
            {["All", ...Object.values(RaffleStatus)].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <TextField
            size="small"
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={startDateFilter}
            onChange={(e) => {
              setStartDateFilter(e.target.value);
              setPage(0);
            }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={endDateFilter}
            onChange={(e) => {
              setEndDateFilter(e.target.value);
              setPage(0);
            }}
          />

          <Button
            variant="contained"
            onClick={handleResetFilters}
            sx={{
              backgroundColor: "green",
              color: "white",
              height: 40,
              "&:hover": { backgroundColor: "green" },
            }}
          >
            Clear Filters
          </Button>
        </Stack>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={handleExportCSV}
            sx={{
              backgroundColor: "green",
              color: "white",
              height: 40,
              "&:hover": { backgroundColor: "green" },
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/raffle/create")}
            sx={{
              backgroundColor: "green",
              color: "white",
              height: 40,
              "&:hover": { backgroundColor: "green" },
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
      <RaffleTable
        rows={rowsWithSortId}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      />
    </Box>
  );
};

export default Raffle;
