export default function Home() {
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
        <h1 style={{ fontSize: '60px', color: '#3F2A1D' }}>
          Jankesowa Pasieka
        </h1>
        <p style={{ fontSize: '28px', marginTop: '30px' }}>
          Strona działa poprawnie
        </p>
        <p style={{ marginTop: '50px', color: '#666' }}>
          Test Pages Router — {new Date().toLocaleString('pl-PL')}
        </p>
      </div>
    </div>
  );
}