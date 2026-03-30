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
import { Wheel } from "@/interfaces/wheel";
import { useDeleteRowMutation } from "@/pages/wheel/hooks/useDeleteRow";

const WheelTable = ({
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
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    { id: "status", label: "Status" },
    { id: "maxSpinsPerUser", label: "Max Spins Per User" },
    { id: "spinCost", label: "Spin Cost" },
    { id: "backgroundColor", label: "Background Color" },
    { id: "borderColor", label: "Border Color" },
    { id: "createdAt", label: "Created At" },
    { id: "updatedAt", label: "Updated At" },
    { id: "segments", label: "Segments" },
  ];

  const navigate = useNavigate();

  const { mutate: deleteWheelRow } = useDeleteRowMutation();

  const handleDeleteWheelRow = (id: string) => {
    deleteWheelRow(id);
  };

  const sortedRows = [...(rows as Wheel[])].sort((a, b) => {
    if (sortBy === "id") {
      const numA = Number(a.id);
      const numB = Number(b.id);

      return sortOrder === SortOrder.ASC ? numA - numB : numB - numA;
    }

    const valueA = a[sortBy as keyof Wheel];
    const valueB = b[sortBy as keyof Wheel];

    if (sortBy === "maxSpinsPerUser") {
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
      data={sortedRows as Wheel[]}
      isLoading={isLoading}
      error={error}
      resetErrorBoundary={() => refetch()}
    >
      {(sortedRows: Wheel[]) => (
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
                      {column.id !== "segments" ? (
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
                {sortedRows.map((row: Wheel) => (
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
                        {column.id === "segments"
                          ? row.segments
                              .map((segment) => segment.label)
                              .join(", ")
                          : String(row[column.id as keyof Wheel] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell sx={{ cursor: "pointer" }}>
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/wheel/${row.id}/edit`)}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/wheel/${row.id}`)}
                    >
                      <VisibilityIcon />
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteWheelRow(row.id)}
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

export default WheelTable;
