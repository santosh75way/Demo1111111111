import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function PublicErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>Try refreshing the page.</p>
    </div>
  );
}
