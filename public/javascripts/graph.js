function verticesDicToList(verticesDic) {
    var vertCopy = JSON.parse(JSON.stringify(verticesDic));
    var list = [];
    for(var key in vertCopy) {
        list.push(vertCopy[key]);
    }
    return list;
}

function getDegree(id, edges) {
    var count = 0;
    for (var edge in edges) {
        if(edges[edge].source == id || edges[edge].target == id) {
            count += 1;
        }
    }
    return count;
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
        .attr("stroke", function(d) { return { "like": "#cc1111", "comment": "#1111cc", "in_post": "#11cc11" }[d.type]; })
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var vgs = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(vertices)
        .enter().append("g")
        .attr("fill-opacity", function(d) {
            var degree = getDegree(d.id, edges);
            degree *= 1.1;
            return 1 - (1 / degree);
        })
        .on("click", onClickBubble)
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
            }));

    var vertex = vgs.append("circle")
        .attr("r", function(d) { return d.id == meId ? 30 : d.type == "user" ? 5 : 12; })
        .attr("fill", "#000")
        .attr("data-id", function(d) { return d.id; });
    var txt = vgs.append("text").text(function(d) { return d.type == "me" ? "me" : d.type == "status" ? "..." : ""; })
        .attr("fill", "#fff").style("pointer-events", "none").attr("transform", "translate(-6,3)");
    var clips = vgs.append("clipPath").attr("id", function(d) { return "clip-path-" + d.id; }).append("circle").attr("r", 12);
    var img = vgs.append("image").attr("xlink:href", function(d) { return d.type == "photo" ? d.content : ""; })
        .attr("x", "-14px")
        .attr("y", "-14px")
        .attr("width", function(d) { return d.type == "photo" ? "28px" : "0px"; })
        .attr("height", function(d) { return d.type == "photo" ? "28px" : "0px"; })
        .attr("clip-path", function(d) { return "url(#clip-path-" + d.id; +")" });

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
            clips
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            txt
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
            img
                .attr("x", function(d) { return d.x - 12; })
                .attr("y", function(d) { return d.y - 12; });
        });

    simulation.force("link")
        .links(edges);

    return;
};