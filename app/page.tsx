export default function Page() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5EDE4',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '52px', color: '#3F2A1D', marginBottom: '20px' }}>
          Jankesowa Pasieka
        </h1>
        <p style={{ fontSize: '22px', color: '#555' }}>
          Strona działa technicznie.<br />
          Deployment udany.
        </p>
        <p style={{ marginTop: '40px', color: '#888', fontSize: '14px' }}>
          Test z {new Date().toLocaleString('pl-PL')}
        </p>
      </div>
    </div>
  );
}