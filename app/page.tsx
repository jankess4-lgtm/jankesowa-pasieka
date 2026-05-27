export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F5EDE4",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "60px", color: "#3F2A1D" }}>
          Jankesowa Pasieka
        </h1>
        <p style={{ fontSize: "28px", marginTop: "20px", color: "#666" }}>
          Strona działa poprawnie
        </p>
        <p style={{ marginTop: "40px", color: "#888" }}>
          Deployment z {new Date().toLocaleString('pl-PL')}
        </p>
      </div>
    </div>
  );
}