function clickVertex(id, edgeList, verticesDict){
    console.log(id);
    console.log(edgeList);
    console.log(verticesDict);
    var ret = {};
    var data = verticesDict[id];
    var numID = id.slice(1);
    if(id.slice(0,1) == 'u'){
        FB.api('/'+numID+'?fields=id,name', function(response){
            ret.title = response.name;
            var typeEdgeCount = {likePicture: 0, commentPicture: 0, taggedPicture: 0, likeStatus: 0, commentStatus: 0, taggedStatus: 0};
            for(var i=0; i<edgeList.length; i++){
                if(edgeList[i].source == id){
                    if(edgeList[i].type == "in_post"){
                        if(verticesDict[edgeList[i].target].message == "picture"){
                            typeEdgeCount.taggedPicture += 1;
                        }else{
                            typeEdgeCount.taggedStatus += 1;
                        }
                    }else if(edgeList[i].type == "like"){
                        if(verticesDict[edgeList[i].target].message == "picture"){
                            typeEdgeCount.likePicture += 1;
                        }else{
                            typeEdgeCount.likeStatus += 1;
                        }
                    }else{
                        if(verticesDict[edgeList[i].target].message == "picture"){
                            typeEdgeCount.commentPicture += 1;
                        }else{
                            typeEdgeCount.commentStatus += 1;
                        }
                    }
                }
            }
            ret.edgeCount = typeEdgeCount;
        });
    }else{
        ret.content = data.content;
        ret.title = data.message;
        if(ret.content == ret.title){
            ret.content = ""
        }
        typeEdgeCount = {totalLikes: data.likes, totalComments: data.comments, likedBy: [], commentedBy: [], tagged: []};
        for(var j=0; j<edgeList.length; j++){
            if(edgeList[j].target == id){
                if(edgeList[j].type == "like"){
                    typeEdgeCount.likedBy.push(verticesDict[edgeList[j].source].message);
                }else if(edgeList[j].type == "comment"){
                    typeEdgeCount.commentedBy.push(verticesDict[edgeList[j].source].message);
                }else{
                    typeEdgeCount.tagged.push(verticesDict[edgeList[j].source].message);
                }
            }
        }
        ret.edgeCount = typeEdgeCount;
    }
    return ret;
}


console.log(clickVertex("p12", [{"source": "me", "target": "p12", "type": "in_post"}], {"p12": {"content": "<img src=\"[object Object]\" />", "message": "",
    "id": "p1306768812689838",
    "type": "photo",
    "likes": 3,
    "comments": 2}, "me": {"message": "Christopher Jacob Olson"}}));