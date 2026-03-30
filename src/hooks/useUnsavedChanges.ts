import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useUnsavedChanges = (isDirty: boolean) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const timer = setTimeout(() => {
        const proceed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        );

        if (proceed) {
          blocker.proceed();
        } else {
          blocker.reset();
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        return (e.returnValue = "");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
};
