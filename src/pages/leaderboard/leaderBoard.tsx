import {
  Leaderboard,
  LeaderboardPrize,
  LeaderboardStatus,
} from "@/interfaces/leaderboard";
import { useLeaderboardData } from "@/pages/leaderboard/hooks/useLeaderboardData";
import LeaderBoardTable from "@/pages/leaderboard/leaderBoardTable";
import { Add, FileDownload } from "@mui/icons-material";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportCsv } from "@/utils/exportCsv";
import { useTableControls } from "@/hooks/useTableControls";

const LeaderBoard = () => {
  const navigate = useNavigate();
  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTableControls();
  const [statusFilter, setStatusFilter] = useState<LeaderboardStatus | "All">(
    "All",
  );

  const { data, isLoading, error, refetch } = useLeaderboardData({
    _page: page + 1,
    _limit: rowsPerPage,
    status: statusFilter === "All" ? undefined : statusFilter,
  });


  const rows = data?.data || [];

  const rowsWithSortId = rows.map((rows: Leaderboard) => ({
    ...rows,
    sortId: Number(rows.id),
  }));

  const total = data?.total || 0;

  const statusOptions = Object.values(LeaderboardStatus);

  const statusFilterOptions = ["All", ...statusOptions];

  const handleExportCSV = () => {
    exportCsv<Leaderboard & { sortId?: number }>({
      filename: `leaderboards_${new Date().toISOString().split("T")[0]}.csv`,
      headers: [
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
      ],
      rows: rowsWithSortId,
      getRowCells: (r) => [
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
      ],
    });
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
