
// Global objects
let data, scatterplot, barchart;

const dispatcher = d3.dispatch("filterRegion")

/**
 * Load data from CSV file asynchronously and render charts
 */
d3.csv('africa_country_profile_variables.csv')
  .then(_data => {
    data = _data;
    data.forEach(d => {
      d.population = +d.population;
      d.density = +d.density;
      d.area = +d.area;
      d.GDP = +d.GDP;
    });



    const colorScale = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain([new Set(data.map(d=>d.Region))])
    // Initialize scales

    //data aggregation solution 1
    let regionDict = {}

    for(let i=0; i<data.length; i++) {
      let r = data[i].Region
      if (r in regionDict) {
        regionDict[r] += 1
      } else {
        regionDict[r] = 1
      }
    }
    let regions = []
    for (let r in regionDict){
      regions.push({name: r, num: regionDict[r]})
    }
    // solution 2
    regions = d3.groups(data, d => d.Region).map(d=> ({name: d[0], num: d[1].length}));

    scatterplot = new Scatterplot({
      parentElement: '#scatterplot',
      colorScale: colorScale
    }, data);
    scatterplot.updateVis();

    barchart = new Barchart({parentElement: "#barchart",
      colorScale: colorScale},
      regions, dispatcher)
    barchart.updateVis()

  })
  .catch(error => console.error(error));


/**
 * Dispatcher waits for 'filterCategory' event
 * We filter data based on the selected categories and update the scatterplot
 */
dispatcher.on('filterRegion', function (selectedRegion) {
  if (selectedRegion === ''){
    scatterplot.data = data
    scatterplot.updateVis()
  } else {
    scatterplot.data = data.filter(d => d.Region === selectedRegion)
    scatterplot.updateVis()
  }
})
