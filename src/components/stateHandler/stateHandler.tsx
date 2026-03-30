import ErrorFallback from "@/components/errorFallBack/errorFallBack";
import Loader from "@/components/loader/loader";
import NoData from "@/components/noData/noData";
import type { ReactNode } from "react";

interface StateHandlerProps<T> {
  data?: T | null;
  isLoading?: boolean;
  error?: unknown;
  loader?: ReactNode;
  noData?: ReactNode;
  errorFallback?: ReactNode;
  resetErrorBoundary?: () => void;
  isCreateForm?: boolean;
  /**
   * In create forms we render UI without needing `data`.
   * For non-create forms, `data` is guaranteed by the checks below.
   */
  children: ((data: T) => ReactNode) | (() => ReactNode);
}

const StateHandler = <T,>(props: StateHandlerProps<T>) => {
  const {
    data,
    isLoading,
    error,
    loader = <Loader />,
    noData = <NoData />,
    resetErrorBoundary,
    errorFallback = (
      <ErrorFallback resetErrorBoundary={() => resetErrorBoundary?.()} />
    ),
    isCreateForm = false,
    children,
  } = props;

  if (isCreateForm) {
    return <>{(children as () => ReactNode)()}</>;
  }

  if (isLoading) return <>{loader}</>;
  if (error) return <>{errorFallback}</>;
  if (data == null) return <>{noData}</>;
  if (Array.isArray(data) && data.length === 0) return <>{noData}</>;

  return <>{(children as (data: T) => ReactNode)(data)}</>;
};

export default StateHandler;
