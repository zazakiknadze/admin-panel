import { handleChangePageFunction, handleSortFunction } from "@/utils/helpers";
import { SortOrder } from "@/interfaces/shared";
import { ChangeEvent, useState } from "react";

export const useTableControls = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  const handleSort = (columnId: string) => {
    handleSortFunction(columnId, sortBy, setSortOrder, setSortBy);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    handleChangePageFunction(_, newPage, setPage, setSortBy, setSortOrder);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    setPage,
    setRowsPerPage,
    setSortBy,
    setSortOrder,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};

