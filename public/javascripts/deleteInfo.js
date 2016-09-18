function deleteInfo(id, edgeList, verticesDict){
    console.log(edgeList);
    console.log(verticesDict);
    var newEdgeList = edgeList.slice();
    var newVerticesDict = $.extend(true, {}, verticesDict);
    var edgeListIndices = [];
    for(var i=0; i<edgeList.length; i++){
        if(edgeList[i].source.id == id || edgeList[i].target.id == id){
            edgeListIndices.push(i);
        }
    }
    edgeListIndices.sort(function(a,b){
        return b-a
    });
    for(var j=0; j<edgeListIndices.length; j++){
        newEdgeList.splice(j,1);
    }
    if(verticesDict[id] != undefined && verticesDict[id] != null){
        delete newVerticesDict[id];
    }
    return {edges: newEdgeList, vertices: newVerticesDict};
}