const fs = require('fs')

const data = fs.readFileSync('./airlines.dat', 'utf8')
const lines = data.split('\n')

const airlines = lines.map(line => {
    const cols = line.split(',')
    return cols[1]?.replace(/"/g, '') // airline name
}).filter(name => !!name && name !== '\"' && name !== '\\N')

fs.writeFileSync('./airlines.json', JSON.stringify([...new Set(airlines)], null, 2))
console.log(`✅ Сгенерировано ${airlines.length} авиакомпаний`)