import {
  Leaderboard,
  LeaderboardPrize,
  LeaderboardStatus,
} from "@/interfaces/leaderboard";
import { SortOrder } from "@/interfaces/shared";
import { useLeaderboardData } from "@/pages/leaderboard/hooks/useLeaderboardData";
import LeaderBoardTable from "@/pages/leaderboard/leaderBoardTable";
import { handleChangePageFunction, handleSortFunction } from "@/utils/helpers";
import { Add, FileDownload } from "@mui/icons-material";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [statusFilter, setStatusFilter] = useState<LeaderboardStatus | "All">(
    "All",
  );

  const handleSort = (columnId: string) => {
    handleSortFunction(columnId, sortBy, setSortOrder, setSortBy);
  };

  const { data, isLoading, error, refetch } = useLeaderboardData({
    _page: page + 1,
    _limit: rowsPerPage,
    status: statusFilter === "All" ? undefined : statusFilter,
  });

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

  const rowsWithSortId = rows.map((rows: Leaderboard) => ({
    ...rows,
    sortId: Number(rows.id),
  }));

  const total = data?.total || 0;

  const statusOptions = Object.values(LeaderboardStatus);

  const statusFilterOptions = ["All", ...statusOptions];

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Status",
      "Start Date",
      "End Date",
      "Participants",
      "Created At",
      "Updated At",
      "Scoring Type",
      "Prizes",
    ].join(",");

    const csvContent = rowsWithSortId
      .map((r: Leaderboard) =>
        [
          r.id,
          `"${r.title}"`,
          r.status,
          r.startDate,
          r.endDate,
          r.maxParticipants,
          r.createdAt,
          r.updatedAt,
          r.scoringType,
          r.prizes.map((p: LeaderboardPrize) => p.name).join(","),
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${csvContent}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaderboards_${new Date().toISOString().split("T")[0]}.csv`;
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
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeaderboardStatus)}
          sx={{ width: 200 }}
        >
          {statusFilterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
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
            onClick={() => navigate("/leaderboard/create")}
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
      <LeaderBoardTable
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

export default LeaderBoard;
