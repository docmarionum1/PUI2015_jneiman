var w = window.innerHeight - 20,
    h = window.innerHeight - 20,
    r = window.innerHeight - 20,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root,
    color = d3.scale.category20();

$('#info').width(window.innerWidth - window.innerHeight - 50);

codes = {
    '1': 'One & Two Family Buildings',
    '2': 'Multi-Family Walk-Up Buildings',
    '3': 'Multi-Family Elevator Buildings',
    '4': 'Mixed Residential & Commercial Buildings',
    '5': 'Commercial & Office Buildings',
    '6': 'Industrial & Manufacturing Buildings',
    '7': 'Transportation & Utility',
    '8': 'Public Facilities & Institutions',
    '9': 'Open Space & Outdoor Recreation',
    '10': 'Parking Facilities',
    '11': 'Vacant Land'
};

for (code in codes) {
  console.log(codes[code]);
  $('<h1/>', {
    text: codes[code],
    style: 'color:' + color(codes[code])
  }).appendTo('#types');
}

var pack = d3.layout.pack()
  .size([r, r])
  .padding(1)
  .value(function(d) { return d.size; });


var vis = d3.select("#chart").insert("svg:svg", "h2")
  .attr("width", w)
  .attr("height", h)
  .append("svg:g")
  .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

d3.json("nyc.json", function(data) {
  node = root = data;

  var nodes = pack.nodes(root);

  vis.selectAll("circle")
      .data(nodes)
      .enter().append("svg:circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) {
        if (d.name == "") {
          return "#ffffff";
        } else if (d.children) {
          return "#aaa";
        } else {
          return color(d.name);
        }
      })
      .on("click", function(d) { return zoom(node == d ? root : d); });

  vis.selectAll("text")
      .data(nodes)
      .enter().append("svg:text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("opacity", function(d) { return d.r > window.innerHeight/30 ? 1 : 0; })
      .text(function(d) { return d.name; });

  d3.select(window).on("click", function() { zoom(root); });
});

function zoom(d, i) {
  var k = r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r > window.innerHeight/30 ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}
