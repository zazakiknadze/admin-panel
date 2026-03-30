import { Leaderboard } from "@/interfaces/leaderboard";
import { Raffle } from "@/interfaces/raffle";
import { Wheel } from "@/interfaces/wheel";

export interface IRoute {
  path?: string;
  element?: React.ReactNode;
  children?: IRoute[];
  name?: string;
  showInSidebar?: boolean;
  index?: boolean;
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum FormMode {
  CREATE = "create",
  EDIT = "edit",
}

export interface TableProps {
  rows: Leaderboard[] | Raffle[] | Wheel[];
  total: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: string;
  sortOrder: SortOrder;
  handleSort: (columnId: string) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
