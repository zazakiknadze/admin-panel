import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      let message = "Something went wrong";

      if (error instanceof Error) {
        message = error.message;
      }

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };

        message = err.response?.data?.message ?? message;
      }

      toast.error(`API Error: ${message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      let message = "Something went wrong";

      if (error instanceof Error) {
        message = error.message;
      }

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };

        message = err.response?.data?.message ?? message;
      }

      toast.error(`Update Failed: ${message}`);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
