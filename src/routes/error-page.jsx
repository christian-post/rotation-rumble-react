import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <main>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: "100%" }}
      >
        <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>
            {error
                ? error.statusText || error.message || "Unknown error"
                : "Page not found or unexpected error."}
            </i>
          </p>
        </div>
      </div>
    </main>
      
  );
}