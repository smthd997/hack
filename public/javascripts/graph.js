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

var d3Graph = function(div, width, height, nodesDict, links) {
    var nodes = verticesDicToList(nodesDict);
    // Name of html selector for div
    var svg = d3.select(div).append("svg").attr("width", width).attr("height", height),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#000")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return;

    this.div = div;
    this.width = width;
    this.height = height;

    d3.select(div).selectAll("svg").remove();

    this.svg = d3.select(div).append("svg:svg")
        .attr('width', this.width)
        .attr('height', this.height);

    this.svg.append("svg:rect")
        .style("stroke", "#444")
        .style("fill", "#fff")
        .attr("width", width)
        .attr("height", height);

    this.simulation = d3.forceSimulation()
        // checks links for source of vertex.id
        .force("link", d3.forceLink().id(function (vertex) { return vertex.id; }))
        .force("charge", d3.forceManyBody())
        // makes center of screen center of force
        .force("center", d3.forceCenter(width / 2, height / 2));
};

d3Graph.prototype.loadGraph = function(vertices, edges) {
    this.vertices = verticesDicToList(vertices);
    this.edges = edges;

    console.log(this.vertices);
    console.log(this.edges);

    // Make sure to remove everything when loading graph again
    //this.svg.selectAll("line").remove();
    //this.svg.selectAll("circle").remove();

    var simulation = this.simulation;

    // Initializes an edge
    var edge = this.svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(this.edges)
        .enter()
        .append("line")
        .attr("stroke", "black");

    // Initializes vertex
    var vertex = this.svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(this.vertices)
        .enter().append("circle")
        .attr("r", 100)// TODO: add callback for dynamic sizes
        .attr("fill", "#ff00ff")// TODO: add callback for colors
        .call(d3.drag()
            .on("start", function(d) {
                if(!d3.event.active) {
                    simulation.alphaTarget(0.3).restart();
                }
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", function(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on("end", function(d) {
                if(!d3.event.active) {
                    simulation.alphaTarget(0).restart();
                }
                d.fx = null;
                d.fy = null;
            }))
        //.on("click", function() {})// TODO: add click functionality
        .append("title")
        .text(function(d) { return d.id; });

    // Add force simulation to nodes
    simulation
        .nodes(this.vertices)
        .on("tick", function() {
            edge.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            vertex.attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y });
        });


    simulation.force("link").links(this.edges);


    return this;
};


// $(window).width(), $(window).height()-250
    /*var myFlower = new CodeFlower("#graph",800,800);
    var json = {
        "name": "root",
        "children": [{
            "name": "app",
            "children": [{
                "name": "dashboard",
                "children": [{
                    "name": "public",
                    "children": [{
                        "name": "stylesheets",
                        "children": [{"name": "bootstrap.css", "size": 4945, "language": "CSS"}, {
                            "name": "style.css",
                            "size": 254,
                            "language": "CSS"
                        }, {"name": "jquery.tagsinput.css", "size": 7, "language": "CSS"}],
                        "size": 5206
                    }, {
                        "name": "javascripts",
                        "children": [{
                            "name": "dateNavigation.js",
                            "size": 155,
                            "language": "Javascript"
                        }, {
                            "name": "dateInterval.js",
                            "size": 83,
                            "language": "Javascript"
                        }, {
                            "name": "bootstrap-affix.js",
                            "size": 56,
                            "language": "Javascript"
                        }, {
                            "name": "bootstrap-button.js",
                            "size": 52,
                            "language": "Javascript"
                        }, {"name": "uptimeBar.js", "size": 47, "language": "Javascript"}, {
                            "name": "checkState.js",
                            "size": 31,
                            "language": "Javascript"
                        }, {
                            "name": "flashcanvas",
                            "children": [{
                                "name": "canvas2png.js",
                                "size": 27,
                                "language": "Javascript"
                            }, {"name": "flashcanvas.js", "size": 21, "language": "Javascript"}],
                            "size": 48
                        }, {
                            "name": "statNavigation.js",
                            "size": 26,
                            "language": "Javascript"
                        }, {"name": "flotr2.min.js", "size": 3, "language": "Javascript"}, {
                            "name": "jquery.min.js",
                            "size": 3,
                            "language": "Javascript"
                        }, {
                            "name": "jquery.tablesorter.min.js",
                            "size": 1,
                            "language": "Javascript"
                        }, {"name": "moment.min.js", "size": 1, "language": "Javascript"}, {
                            "name": "ejs.min.js",
                            "size": 1,
                            "language": "Javascript"
                        }, {"name": "jquery.tagsinput.min.js", "size": 1, "language": "Javascript"}],
                        "size": 508
                    }],
                    "size": 5714
                }, {"name": "app.js", "size": 126, "language": "Javascript"}],
                "size": 5840
            }, {
                "name": "api",
                "children": [{
                    "name": "routes",
                    "children": [{"name": "check.js", "size": 95, "language": "Javascript"}, {
                        "name": "ping.js",
                        "size": 68,
                        "language": "Javascript"
                    }, {"name": "tag.js", "size": 64, "language": "Javascript"}],
                    "size": 227
                }, {"name": "app.js", "size": 59, "language": "Javascript"}],
                "size": 286
            }],
            "size": 6126
        }, {
            "name": "lib",
            "children": [{
                "name": "qosAggregator.js",
                "size": 476,
                "language": "Javascript"
            }, {"name": "intervalBuilder.js", "size": 144, "language": "Javascript"}, {
                "name": "monitor.js",
                "size": 109,
                "language": "Javascript"
            }, {
                "name": "pollers",
                "children": [{"name": "https.js", "size": 81, "language": "Javascript"}, {
                    "name": "http.js",
                    "size": 80,
                    "language": "Javascript"
                }, {"name": "icmp.js", "size": 53, "language": "Javascript"}, {
                    "name": "udp.js",
                    "size": 47,
                    "language": "Javascript"
                }, {"name": "base.js", "size": 33, "language": "Javascript"}],
                "size": 294
            }, {"name": "proxy.js", "size": 61, "language": "Javascript"}, {
                "name": "analyzer.js",
                "size": 40,
                "language": "Javascript"
            }, {"name": "timer.js", "size": 15, "language": "Javascript"}],
            "size": 1139
        }, {
            "name": "models",
            "children": [{"name": "check.js", "size": 313, "language": "Javascript"}, {
                "name": "tag.js",
                "size": 176,
                "language": "Javascript"
            }, {
                "name": "migrations",
                "children": [{"name": "upgrade2to3.js", "size": 137, "language": "Javascript"}],
                "size": 137
            }, {"name": "checkEvent.js", "size": 56, "language": "Javascript"}, {
                "name": "ping.js",
                "size": 51,
                "language": "Javascript"
            }, {"name": "checkYearlyStat.js", "size": 16, "language": "Javascript"}, {
                "name": "tagYearlyStat.js",
                "size": 16,
                "language": "Javascript"
            }, {"name": "checkMonthlyStat.js", "size": 16, "language": "Javascript"}, {
                "name": "tagMonthlyStat.js",
                "size": 16,
                "language": "Javascript"
            }, {"name": "tagDailyStat.js", "size": 15, "language": "Javascript"}, {
                "name": "checkHourlyStat.js",
                "size": 15,
                "language": "Javascript"
            }, {"name": "tagHourlyStat.js", "size": 15, "language": "Javascript"}, {
                "name": "checkDailyStat.js",
                "size": 15,
                "language": "Javascript"
            }],
            "size": 857
        }, {
            "name": "test",
            "children": [{
                "name": "lib",
                "children": [{"name": "test_intervalBuilder.js", "size": 133, "language": "Javascript"}],
                "size": 133
            }],
            "size": 133
        }, {
            "name": "fixtures",
            "children": [{"name": "computeStats.js", "size": 117, "language": "Javascript"}, {
                "name": "populate.js",
                "size": 70,
                "language": "Javascript"
            }, {"name": "fixEvents.js", "size": 28, "language": "Javascript"}, {
                "name": "dummyTargetUdp.js",
                "size": 19,
                "language": "Javascript"
            }, {"name": "dummyTarget.js", "size": 13, "language": "Javascript"}],
            "size": 247
        }, {
            "name": "plugins",
            "children": [{
                "name": "console",
                "children": [{"name": "index.js", "size": 86, "language": "Javascript"}],
                "size": 86
            }, {"name": "email", "children": [{"name": "index.js", "size": 36, "language": "Javascript"}], "size": 36}],
            "size": 122
        }, {"name": "app.js", "size": 75, "language": "Javascript"}, {
            "name": "config",
            "children": [{"name": "default.yaml", "size": 36, "language": "YAML"}, {
                "name": "test.yaml",
                "size": 4,
                "language": "YAML"
            }],
            "size": 40
        }, {"name": "bootstrap.js", "size": 32, "language": "Javascript"}, {
            "name": "monitor.js",
            "size": 4,
            "language": "Javascript"
        }, {"name": "makefile", "size": 3, "language": "make"}],
        "nbFiles": 81,
        "size": 8778
    };
    myFlower.update(json);*/
