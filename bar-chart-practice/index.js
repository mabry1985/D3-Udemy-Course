const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

// create margins and dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;
  
const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left},${margin.top})`)
  
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('font-size', '14px')

const yAxisGroup = graph.append('g');

const y = d3.scaleLinear()
  .range([graphHeight, 0]);
const x = d3.scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create & call axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + ' orders');


const t = d3.transition().duration(750)
  
const update = (data) => {
  //updating scale domains
  y.domain([0,d3.max(data, d => d.mentions)]);
  x.domain(data.map(item => item.name));
    
  //join the data to rects
  const rects = graph.selectAll('rect')
  .data(data);
  
  //remove unwanted shapes
  rects.exit().remove();
  
  //update current shapes in DOM
  rects.attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))

  rects.enter()
    .append('rect')
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', 'blue')
      .attr('x', d => x(d.name))
      .attr('y', graphHeight)
      .merge(rects)
      .transition(t)
        .attr("height", d => graphHeight - y(d.mentions))
        .attr('y', d => y(d.mentions));

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
};

let data = [];

db.collection('frameworks').onSnapshot(res => {
  
  res.docChanges().forEach(change => {
    const doc = {...change.doc.data(), id: change.doc.id};
    
    switch(change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id)
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        return;
    }
    
    update(data);
  })

  update(data)
})

const widthTween = (d) => {

  // define interpolation
  // d3.interpolate returns a function which we call 'i'
  let i = d3.interpolate(0, x.bandwidth());

  // i(1)

  return function(t) {

    return i(t);
  }
}






