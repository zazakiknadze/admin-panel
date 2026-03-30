import { TableProps } from "@/interfaces/shared";
import { Wheel } from "@/interfaces/wheel";
import { useDeleteRowMutation } from "@/pages/wheel/hooks/useDeleteRow";
import CrudTable, {
  CrudTableColumn,
} from "@/components/crudTable/crudTable";

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
  const { mutate: deleteWheelRow } = useDeleteRowMutation();

  const columns: CrudTableColumn<Wheel>[] = [
    { id: "id", label: "ID", sortAs: "numeric" },
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    { id: "status", label: "Status" },
    { id: "maxSpinsPerUser", label: "Max Spins Per User", sortAs: "numeric" },
    { id: "spinCost", label: "Spin Cost" },
    { id: "backgroundColor", label: "Background Color" },
    { id: "borderColor", label: "Border Color" },
    { id: "createdAt", label: "Created At" },
    { id: "updatedAt", label: "Updated At" },
    {
      id: "segments",
      label: "Segments",
      sortable: false,
      render: (row) => row.segments.map((s) => s.label).join(", "),
    },
  ];

  return (
    <CrudTable<Wheel>
      rows={rows as Wheel[]}
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
      editAction={{ getEditPath: (row) => `/wheel/${row.id}/edit` }}
      viewAction={{ getViewPath: (row) => `/wheel/${row.id}` }}
      deleteAction={{ onDelete: deleteWheelRow }}
    />
  );
};

export default WheelTable;
