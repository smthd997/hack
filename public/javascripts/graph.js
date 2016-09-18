function verticesDicToList(verticesDic) {
    console.log("1");
    var vertCopy = JSON.parse(JSON.stringify(verticesDic));
    console.log(vertCopy);
    var list = [];
    for(var key in vertCopy) {
        list.push(vertCopy[key]);
    }
    return list;
}

function makeD3Graph(div, width, height, verticesDict, edges) {
    var vertices = verticesDicToList(verticesDict);
    // Name of html selector for div
    var svg = d3.select(div).append("svg").attr("width", width).attr("height", height),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var edge = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter().append("line")
        .attr("stroke", "#000")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var vertex = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(vertices)
        .enter().append("circle")
        .attr("r", function(d) { return d.id == meId ? "15" : d.type == "user" ? 5 : 10; })
        .call(d3.drag()
            .on("start", function(d) {
                if (!d3.event.active)
                    simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", function(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on("end", function(d) {
                if (!d3.event.active)
                    simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }))
        .on("click", function(d) { return d; });

    edge.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(vertices)
        .on("tick", function() {
            edge
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            vertex
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

    simulation.force("link")
        .links(edges);

    return;
};