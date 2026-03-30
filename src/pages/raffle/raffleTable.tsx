import { SortOrder } from "@/interfaces/shared";
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
import { TableProps } from "@/interfaces/shared";
import { Raffle, RafflePrize, RaffleStatus } from "@/interfaces/raffle";
import { useDeleteRowMutation } from "@/pages/raffle/hooks/useDeleteRow";

const RaffleTable = ({
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
    { id: "status", label: "Status" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "drawDate", label: "Draw Date" },
    { id: "prizes", label: "Prizes" },
    { id: "ticketPrice", label: "Ticket Price" },
    { id: "maxTicketsPerUser", label: "Max Tickets Per User" },
    { id: "totalTicketLimit", label: "Total Ticket Limit" },
    { id: "createdAt", label: "Created At" },
    { id: "updatedAt", label: "Updated At" },
  ];

  const navigate = useNavigate();

  const { mutate: deleteRaffleRow } = useDeleteRowMutation();

  const handleDeleteRaffleRow = (id: string) => {
    deleteRaffleRow(id);
  };

  const sortedRows = [...(rows as Raffle[])].sort((a, b) => {
    if (sortBy === "id") {
      const numA = Number(a.id);
      const numB = Number(b.id);

      return sortOrder === SortOrder.ASC ? numA - numB : numB - numA;
    }

    const valueA = a[sortBy as keyof Raffle];
    const valueB = b[sortBy as keyof Raffle];

    if (sortBy === "ticketPrice") {
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
      data={sortedRows}
      isLoading={isLoading}
      error={error}
      resetErrorBoundary={() => refetch()}
    >
      {(sortedRows: Raffle[]) => (
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
                {sortedRows.map((row: Raffle) => (
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
                          ? row.prizes
                              .map((prize: RafflePrize) => prize.name)
                              .join(", ")
                          : String(row[column.id as keyof Raffle] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        cursor:
                          row.status === RaffleStatus.DRAWN
                            ? "not-allowed"
                            : "pointer",
                        color:
                          row.status === RaffleStatus.DRAWN
                            ? "text.disabled"
                            : "text.primary",
                      }}
                    >
                      <EditIcon
                        sx={{
                          cursor:
                            row.status === RaffleStatus.DRAWN
                              ? "not-allowed"
                              : "pointer",
                        }}
                        onClick={() =>
                          row.status === RaffleStatus.DRAWN
                            ? undefined
                            : navigate(`/raffle/${row.id}/edit`)
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/raffle/${row.id}`)}
                    >
                      <VisibilityIcon />
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteRaffleRow(row.id)}
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

export default RaffleTable;
