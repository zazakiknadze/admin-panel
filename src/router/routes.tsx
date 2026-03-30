import Layout from "@/components/layout/layout";
import { FormMode, IRoute } from "@/interfaces/shared";
import LeaderBoard from "@/pages/leaderboard/leaderBoard";
import LeaderboardDetail from "@/pages/leaderboard/leaderBoardDetail";
import { LeaderboardForm } from "@/pages/leaderboard/leaderboardForm";
import NotFound from "@/pages/notFound/notFound";
import Raffle from "@/pages/raffle/raffle";
import RaffleDetail from "@/pages/raffle/raffleDetail";
import { RaffleForm } from "@/pages/raffle/raffleForm";
import Wheel from "@/pages/wheel/wheel";
import WheelDetail from "@/pages/wheel/wheelDetail";
import { WheelForm } from "@/pages/wheel/wheelForm";
import { getFirstAvailablePath } from "@/utils/helpers";
import { Navigate } from "react-router-dom";

const DynamicRedirect = () => {
  const path = getFirstAvailablePath(routes[0].children || []);
  return <Navigate to={path} replace />;
};

export const routes: IRoute[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DynamicRedirect />,
      },
      {
        path: "leaderboard",
        name: "Leaderboard",
        showInSidebar: true,
        children: [
          {
            index: true,
            element: <LeaderBoard />,
          },
          {
            path: "create",
            element: <LeaderboardForm mode={FormMode.CREATE} />,
          },
          {
            path: ":id",
            element: <LeaderboardDetail />,
          },
          {
            path: ":id/edit",
            element: <LeaderboardForm mode={FormMode.EDIT} />,
          },
        ],
      },

      {
        path: "raffle",
        name: "Raffle",
        showInSidebar: true,
        children: [
          {
            index: true,
            element: <Raffle />,
          },
          {
            path: "create",
            element: <RaffleForm mode={FormMode.CREATE} />,
          },
          {
            path: ":id",
            element: <RaffleDetail />,
          },
          {
            path: ":id/edit",
            element: <RaffleForm mode={FormMode.EDIT} />,
          },
        ],
      },
      {
        path: "wheel",
        name: "Wheel",
        showInSidebar: true,
        children: [
          {
            index: true,
            element: <Wheel />,
          },
          {
            path: "create",
            element: <WheelForm mode={FormMode.CREATE} />,
          },
          {
            path: ":id",
            element: <WheelDetail />,
          },
          {
            path: ":id/edit",
            element: <WheelForm mode={FormMode.EDIT} />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
