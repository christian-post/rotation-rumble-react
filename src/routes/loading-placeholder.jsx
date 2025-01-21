
export default function LoadingPlaceholder() {
  return (
    <main>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: "100%" }}
      >
        <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
          <h1>Loading</h1>
          <p>Please wait while this page is loading...</p>
        </div>
      </div>
    </main>
      
  );
}