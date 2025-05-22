const fs = require('fs')

const raw = fs.readFileSync('./airports.dat', 'utf8')
const lines = raw.split('\n')

const airports = lines.map(line => {
    const cols = line.split(',')
    return {
        name: cols[1]?.replace(/"/g, ''),
        city: cols[2]?.replace(/"/g, ''),
        country: cols[3]?.replace(/"/g, ''),
        iata: cols[4]?.replace(/"/g, ''),
        lat: cols[6]?.replace(/"/g, ''),
        lng: cols[7]?.replace(/"/g, ''),
    }
}).filter(a => a.iata && a.iata.length === 3)

fs.writeFileSync('./airports.json', JSON.stringify(airports, null, 2))
console.log(`✅ Сгенерировано ${airports.length} аэропортов`)