// File URLs
const urlJSON = 'https://unpkg.com/world-atlas@1.1.4/world/50m.json';
const urlTSV = 'https://unpkg.com/world-atlas@1.1.4/world/50m.tsv';

// Selected countries
const stages = [
  'china',
  'canada',
  'france',
  'india',
  'germany',
  'russia',
  'mexico',
  'united states',
  'south africa',
];

let selection = stages[0]; // Default selection

// SVG dimensions
const width = 500;
const height = 250;

// Create SVG
const world = d3
  .select('.world')
  .append('svg')
  .attr('viewBox', `0 0 ${width} ${height}`);

// Country codes and URLs
const countryCodes = {
  china: "JFK1488",
  canada: "(((friend)))",
  france: "NIGGASIEG",
  germany: "HEILDROYD",
  russia: "HYPERBOREA",
  mexico: "WALL420",
  india: "SKIBIDI69",
  "united states": "FENTAVRIL",
  "south africa": "RAWMILK1161",
};

const countryURLs = {
  china: "china.html",
  canada: "canada.html",
  france: "france.html",
  india: "india.html",
  germany: "germany.html",
  russia: "russia.html",
  mexico: "mexico.html",
  "united states": "us.html",
  "south africa": "sa.html",
};

// Function to update the selection when buttons are clicked
function updateSelection(direction) {
  const index = stages.findIndex(stage => stage === selection);
  if (direction === 'prev') {
    selection = index === 0 ? stages[stages.length - 1] : stages[index - 1];
  } else {
    selection = index === stages.length - 1 ? stages[0] : stages[index + 1];
  }

  d3.selectAll('path.stage')
    .attr('id', ({ name }) => name.toLowerCase() === selection ? 'selection' : null);

  d3.select('text').text(selection);
}

// Add countries to the map
function addCountries(countries) {
  const projection = d3.geoEquirectangular()
    .fitSize([width, height], countries)
    .scale([80])
    .translate([width / 2, height / 2 + 40]);

  const geoPath = d3.geoPath().projection(projection);

  // Add text to indicate the current selection
  world
    .append('text')
    .attr('x', width / 3)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .text(selection);

  // Add paths for each country
  world
    .selectAll('path.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', ({ name }) => (stages.includes(name.toLowerCase()) ? 'country stage' : 'country'))
    .attr('id', ({ name }) => ((selection === name.toLowerCase()) ? 'selection' : null))
    .attr('d', geoPath);

  const hoverSound = new Audio('son.mp3');

  // Add interactivity to countries
  d3.selectAll('path.stage')
    .on('mouseenter', function ({ name }) {
      d3.selectAll('path.stage').attr('id', ''); // Reset styles
      d3.select(this).attr('id', 'selection'); // Highlight
      d3.select('text').text(name); // Update text
      selection = name.toLowerCase();
      hoverSound.currentTime = 0;
      hoverSound.play().catch(err => console.error('Audio playback failed:', err));
    })
    .on('click', function ({ name }) {
      const countryName = name.toLowerCase();
      const userCode = prompt(`${name} code:`);
      if (userCode === countryCodes[countryName]) {
        window.location.href = countryURLs[countryName];
      } else {
        alert("Error: Incorrect code!");
      }
    });

  // Make controls visible and set up event listeners
  d3.select('.controls')
    .style('visibility', 'visible')
    .style('opacity', 1);

  d3.select('.controls .prev').on('click', () => updateSelection('prev'));
  d3.select('.controls .next').on('click', () => updateSelection('next'));
}

// Fetch and process data
Promise.all([d3.json(urlJSON), d3.tsv(urlTSV)])
  .then(([json, tsv]) => {
    const countries = topojson.feature(json, json.objects.countries);

    countries.features.forEach(feature => {
      const match = tsv.find(({ iso_n3: id }) => id === feature.id);
      feature.name = match ? match.name : 'Unknown';
    });

    addCountries(countries); // Render countries
  })
  .catch(err => console.error('Data loading error:', err));
