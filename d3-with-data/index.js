const data = [
  {width: 200, height: 300, fill: 'red'},
  {width: 20, height: 400, fill: 'blue'},
  {width: 100, height: 40, fill: 'green'}

];

const svg = d3.select('svg');

//join data to rects
const rects = svg.selectAll('rect')
  .data(data)
  
//add attrs to rects already in dom 
rects.attr('width', d => d.width )
  .attr('height', d => d.height )
  .attr('fill', d => d.fill )

//add rects for additional data
rects.enter()
  .append('rect')
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill)