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
        .attr("r", function(d) { return d.id == meId ? 20 : d.type == "user" ? 5 : 10; })
        .attr("data-id", function(d) { return d.id; })
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
            })
        ).on("click", function(d){
            if(d.id.slice(0,1) != 'u'){
                var ret = clickVertex(d.id, edges, verticesDict);
                showPrompt(ret.title, ret.content, true);
            }else{
                ret = {};
                var numID = d.id.slice(1);
                FB.api('/'+numID+'/picture?type=large', function(response){
                    console.log(response);
                    ret.content = '<img src="'+response.data.url+'">';
                    ret.title = verticesDict[d.id].message;
                    var typeEdgeCount = {likePicture: 0, commentPicture: 0, taggedPicture: 0, likeStatus: 0, commentStatus: 0, taggedStatus: 0};
                    for(var i=0; i<edges.length; i++){
                        if(edges[i].source == d.id){
                            if(edges[i].type == "in_post"){
                                if(verticesDict[edges[i].target].message == "picture"){
                                    typeEdgeCount.taggedPicture += 1;
                                }else{
                                    typeEdgeCount.taggedStatus += 1;
                                }
                            }else if(edges[i].type == "like"){
                                if(verticesDict[edges[i].target].message == "picture"){
                                    typeEdgeCount.likePicture += 1;
                                }else{
                                    typeEdgeCount.likeStatus += 1;
                                }
                            }else{
                                if(verticesDict[edges[i].target].message == "picture"){
                                    typeEdgeCount.commentPicture += 1;
                                }else{
                                    typeEdgeCount.commentStatus += 1;
                                }
                            }
                        }
                    }
                    ret.edgeCount = typeEdgeCount;
                    showPrompt(ret.title, ret.content, true);
                });
            }
        });
        //.append("img").attr("xlink:href", function(d) { return "@Url.Content(\"" + d.content + "\")"; });

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