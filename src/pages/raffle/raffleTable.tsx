import { TableProps } from "@/interfaces/shared";
import { Raffle, RaffleStatus } from "@/interfaces/raffle";
import { useDeleteRowMutation } from "@/pages/raffle/hooks/useDeleteRow";
import CrudTable, {
  CrudTableColumn,
} from "@/components/crudTable/crudTable";

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
  const { mutate: deleteRaffleRow } = useDeleteRowMutation();

  const columns: CrudTableColumn<Raffle>[] = [
    { id: "id", label: "ID", sortAs: "numeric" },
    { id: "name", label: "Name", sortAs: "string" },
    { id: "status", label: "Status", sortAs: "string" },
    { id: "startDate", label: "Start Date", sortAs: "string" },
    { id: "endDate", label: "End Date", sortAs: "string" },
    { id: "drawDate", label: "Draw Date", sortAs: "string" },
    {
      id: "prizes",
      label: "Prizes",
      sortable: false,
      render: (row) => row.prizes.map((p) => p.name).join(", "),
    },
    { id: "ticketPrice", label: "Ticket Price", sortAs: "numeric" },
    { id: "maxTicketsPerUser", label: "Max Tickets Per User" },
    { id: "totalTicketLimit", label: "Total Ticket Limit" },
    { id: "createdAt", label: "Created At" },
    { id: "updatedAt", label: "Updated At" },
  ];

  return (
    <CrudTable<Raffle>
      rows={rows as Raffle[]}
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
      columns={columns}
      getRowId={(row) => row.id}
      editAction={{
        getEditPath: (row) => `/raffle/${row.id}/edit`,
        isDisabled: (row) => row.status === RaffleStatus.DRAWN,
      }}
      viewAction={{ getViewPath: (row) => `/raffle/${row.id}` }}
      deleteAction={{ onDelete: deleteRaffleRow }}
    />
  );
};

export default RaffleTable;
