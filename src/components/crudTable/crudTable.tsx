import { SortOrder } from "@/interfaces/shared";
import StateHandler from "@/components/stateHandler/stateHandler";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { type ChangeEvent, type ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export type CrudTableSortAs = "numeric" | "string";

export type CrudTableColumn<T> = {
  id: string;
  label: string;
  sortable?: boolean;
  sortAs?: CrudTableSortAs;
  render?: (row: T) => ReactNode;
};

export type CrudTableProps<T> = {
  rows: T[];
  total: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  sortBy: string;
  sortOrder: SortOrder;
  handleSort: (columnId: string) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  columns: CrudTableColumn<T>[];
  getRowId: (row: T) => string;
  editAction: {
    getEditPath: (row: T) => string;
    isDisabled?: (row: T) => boolean;
  };
  viewAction: {
    getViewPath: (row: T) => string;
  };
  deleteAction: {
    onDelete: (id: string) => void;
  };
};

const CrudTable = <T,>({
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
  columns,
  getRowId,
  editAction,
  viewAction,
  deleteAction,
}: CrudTableProps<T>) => {
  const navigate = useNavigate();

  const sortedRows = useMemo(() => {
    const arr = [...rows];

    if (!sortBy) return arr;

    const sortColumn = columns.find((c) => c.id === sortBy);
    const sortAs: CrudTableSortAs = sortColumn?.sortAs ?? "string";

    return arr.sort((a, b) => {
      const valueA = (a as unknown as Record<string, unknown>)[sortBy];
      const valueB = (b as unknown as Record<string, unknown>)[sortBy];

      if (sortAs === "numeric") {
        const numA = Number(valueA);
        const numB = Number(valueB);
        return sortOrder === SortOrder.ASC ? numA - numB : numB - numA;
      }

      const strA = String(valueA);
      const strB = String(valueB);
      return sortOrder === SortOrder.ASC
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [rows, sortBy, sortOrder, columns]);

  return (
    <StateHandler
      data={sortedRows}
      isLoading={isLoading}
      error={error}
      resetErrorBoundary={() => refetch()}
    >
      {(sorted: T[]) => (
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
                      {column.sortable === false ? (
                        column.label
                      ) : (
                        <TableSortLabel
                          active={sortBy === column.id}
                          direction={
                            sortBy === column.id ? sortOrder : "asc"
                          }
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
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
                {sorted.map((row) => {
                  const rowId = getRowId(row);
                  const isEditDisabled = editAction.isDisabled
                    ? editAction.isDisabled(row)
                    : false;

                  return (
                    <TableRow
                      key={rowId}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.render
                            ? column.render(row)
                            : String(
                                (row as unknown as Record<string, unknown>)[
                                  column.id
                                ] ?? "",
                              )}
                        </TableCell>
                      ))}

                      <TableCell
                        sx={{
                          cursor: isEditDisabled ? "not-allowed" : "pointer",
                          color: isEditDisabled
                            ? "text.disabled"
                            : "text.primary",
                        }}
                      >
                        <EditIcon
                          sx={{
                            cursor: isEditDisabled
                              ? "not-allowed"
                              : "pointer",
                        }}
                          onClick={
                            isEditDisabled
                              ? undefined
                              : () => navigate(editAction.getEditPath(row))
                          }
                        />
                      </TableCell>

                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(viewAction.getViewPath(row))}
                      >
                        <VisibilityIcon />
                      </TableCell>

                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => deleteAction.onDelete(rowId)}
                      >
                        <DeleteIcon />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box>
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
          </Box>
        </Paper>
      )}
    </StateHandler>
  );
};

export default CrudTable;

