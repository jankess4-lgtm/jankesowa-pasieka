const fs = require('fs');
const https = require('https');

const outputFile = './public/data/paczkomaty_full.json';
let allPoints = [];
let page = 1;
const perPage = 500;

function fetchPage(page) {
  const url = `https://api-shipx-pl.easypack24.net/v1/points?type=parcel_locker&per_page=${perPage}&page=${page}`;

  https.get(url, (res) => {
    let data = '';

    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const points = json.items || [];
        allPoints = allPoints.concat(points);

        console.log(`Pobrano stronę ${page} - ${points.length} rekordów. Razem: ${allPoints.length}`);

        if (points.length === perPage && page < 100) {
          fetchPage(page + 1);
        } else {
          const fullData = { items: allPoints, count: allPoints.length };
          fs.writeFileSync(outputFile, JSON.stringify(fullData, null, 2));
          console.log(`\n✅ Zakończono! Pobrano ${allPoints.length} paczkomatów. Plik zapisany do ${outputFile}`);
        }
      } catch (e) {
        console.error('Błąd parsowania:', e.message);
      }
    });
  }).on('error', (e) => {
    console.error('Błąd połączenia:', e.message);
  });
}

fetchPage(1);