import { IRoute, SortOrder } from "@/interfaces/shared";
import { LeaderboardParams } from "@/services/api/leaderboard";

export const cleanParams = (params: LeaderboardParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined),
  );

export const handleSortFunction = (
  columnId: string,
  sortBy: string,
  setSortOrder: (value: React.SetStateAction<SortOrder>) => void,
  setSortBy: (column: string) => void,
) => {
  if (sortBy === columnId) {
    setSortOrder((prev: SortOrder) =>
      prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
    );
  } else {
    setSortBy(columnId);
    setSortOrder(SortOrder.ASC);
  }
};

export const handleChangePageFunction = (
  _: unknown,
  newPage: number,
  setPage: (page: number) => void,
  setSortBy: (column: string) => void,
  setSortOrder: (order: SortOrder) => void,
) => {
  setPage(newPage);
  setSortBy("");
  setSortOrder(SortOrder.ASC);
};

export const getFirstAvailablePath = (routes: IRoute[]): string => {
  for (const route of routes) {
    if (route.showInSidebar && route.path) {
      return `/${route.path}`;
    }
  }
  return "/not-found";
};
