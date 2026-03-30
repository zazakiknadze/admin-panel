import { Leaderboard } from "@/interfaces/leaderboard";
import { SortOrder, TableProps } from "@/interfaces/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StateHandler from "@/components/stateHandler/stateHandler";
import { useDeleteRowMutation } from "@/pages/leaderboard/hooks/useDeleteRow";

const LeaderBoardTable = ({
  rows,
  total,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  sortBy,
  sortOrder,
  handleSort,
  isLoading,
  error,
  refetch,
}: TableProps) => {
  const columns = [
    { id: "id", label: "ID" },
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "status", label: "Status" },
    { id: "scoringType", label: "Scoring Type" },
    { id: "prizes", label: "Prizes" },
    { id: "maxParticipants", label: "Max Participants" },
    { id: "createdAt", label: "Created At" },
    { id: "updatedAt", label: "Updated At" },
  ];

  const navigate = useNavigate();

  const { mutate: deleteLeaderboardRow } = useDeleteRowMutation();

  const handleDeleteLeaderboardRow = (id: string) => {
    deleteLeaderboardRow(id);
  };

  const sortedRows = [...(rows as Leaderboard[])].sort((a, b) => {
    if (sortBy === "id") {
      const numA = Number(a.id);
      const numB = Number(b.id);

      return sortOrder === SortOrder.ASC ? numA - numB : numB - numA;
    }

    const valueA = a[sortBy as keyof Leaderboard];
    const valueB = b[sortBy as keyof Leaderboard];

    if (sortBy === "maxParticipants") {
      const numA = Number(valueA);
      const numB = Number(valueB);
      return sortOrder === SortOrder.ASC ? numA - numB : numB - numA;
    }

    return sortOrder === SortOrder.ASC
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  return (
    <StateHandler
      data={sortedRows as Leaderboard[]}
      isLoading={isLoading}
      error={error}
      resetErrorBoundary={() => refetch()}
    >
      {(sortedRows: Leaderboard[]) => (
        <Paper
          sx={{
            height: "calc(100% - 64px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TableContainer component={Paper} sx={{ height: "100%" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e7e7e7" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      {column.id !== "prizes" ? (
                        <TableSortLabel
                          active={sortBy === column.id}
                          direction={sortBy === column.id ? sortOrder : "asc"}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Edit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    View
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedRows.map((row: Leaderboard) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.id === "prizes"
                          ? row.prizes.map((prize) => prize.name).join(", ")
                          : String(row[column.id as keyof Leaderboard] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell sx={{ cursor: "pointer" }}>
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/leaderboard/${row.id}/edit`)}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/leaderboard/${row.id}`)}
                    >
                      <VisibilityIcon />
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteLeaderboardRow(row.id)}
                    >
                      <DeleteIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
            sx={{ overflow: "hidden" }}
          />
        </Paper>
      )}
    </StateHandler>
  );
};

export default LeaderBoardTable;
