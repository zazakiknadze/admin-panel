import ErrorFallback from "@/components/errorFallBack/errorFallBack";
import Loader from "@/components/loader/loader";
import NoData from "@/components/noData/noData";
import React from "react";

interface StateHandlerProps<T> {
  data?: T | null;
  isLoading?: boolean;
  error?: unknown;
  loader?: React.ReactNode;
  noData?: React.ReactNode;
  errorFallback?: React.ReactNode;
  resetErrorBoundary?: () => void;
  isCreateForm?: boolean;
  children: (data: T) => React.ReactNode;
}

const StateHandler = <T,>({
  data,
  isLoading,
  error,
  loader = <Loader />,
  noData = <NoData />,
  resetErrorBoundary,
  isCreateForm = false,
  errorFallback = (
    <ErrorFallback resetErrorBoundary={() => resetErrorBoundary?.()} />
  ),
  children,
}: StateHandlerProps<T>) => {
  if (isCreateForm) return <>{children(data as T)}</>;
  if (isLoading) return <>{loader}</>;
  if (error) return <>{errorFallback}</>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <>{noData}</>;

  return <>{children(data)}</>;
};

export default StateHandler;
