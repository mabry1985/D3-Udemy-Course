const data = [
  {width: 200, height: 400, fill: 'red'}
];

const svg = d3.select('svg');

const rect = svg.select('rect')
  .data(data)
  .attr('width', (d, i, n) => { return d.width })
  .attr('height', (d, i, n) => { return d.height })
  .attr('fill', (d, i, n) => { return d.fill })