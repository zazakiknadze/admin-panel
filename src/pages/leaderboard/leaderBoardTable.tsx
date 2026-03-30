import { TableProps } from "@/interfaces/shared";
import { Leaderboard } from "@/interfaces/leaderboard";
import { useDeleteRowMutation } from "@/pages/leaderboard/hooks/useDeleteRow";
import CrudTable, {
  CrudTableColumn,
} from "@/components/crudTable/crudTable";

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
  const { mutate: deleteLeaderboardRow } = useDeleteRowMutation();

  const columns: CrudTableColumn<Leaderboard>[] = [
    { id: "id", label: "ID", sortAs: "numeric" },
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "status", label: "Status" },
    { id: "scoringType", label: "Scoring Type" },
    {
      id: "prizes",
      label: "Prizes",
      sortable: false,
      render: (row) => row.prizes.map((p) => p.name).join(", "),
    },
    { id: "maxParticipants", label: "Max Participants", sortAs: "numeric" },
    { id: "createdAt", label: "Created At" },
    { id: "updatedAt", label: "Updated At" },
  ];

  return (
    <CrudTable<Leaderboard>
      rows={rows as Leaderboard[]}
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
      editAction={{ getEditPath: (row) => `/leaderboard/${row.id}/edit` }}
      viewAction={{ getViewPath: (row) => `/leaderboard/${row.id}` }}
      deleteAction={{ onDelete: deleteLeaderboardRow }}
    />
  );
};

export default LeaderBoardTable;
