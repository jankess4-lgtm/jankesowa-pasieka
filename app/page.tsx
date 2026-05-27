export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5EDE4',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          Jankesowa Pasieka
        </h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>
          Strona testowa - deployment udany ✅
        </p>
        <p style={{ color: '#666' }}>
          Jeśli widzisz tę stronę — wszystko działa technicznie.<br />
          Teraz przywrócimy pełną wersję.
        </p>
      </div>
    </div>
  );
}