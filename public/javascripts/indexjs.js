var meId = "";
var vertices = { };
var edges = [];
var currentEdges = edges;
var currentVertices = vertices;

function addUser(user) {
    var uid = "u" + user.id;
    if(uid != meId && (vertices[uid] == undefined || vertices[uid] == null)) { //user not in vertices
        vertices[uid] = { content: user.name, message: user.name, id: uid, type: "user" };
    }
    return uid;
}

function fetchData(callback) {
    FB.api('/me?fields=photos.limit(40){id,name,picture,tags,likes.limit(100),comments.limit(100)},feed{id,message,type,with_tags,likes.limit(100),comments.limit(100)}', function(resp) {
<<<<<<< HEAD

=======
>>>>>>> 93eaf30732c8f128e3b22f949a9d9b6bcae7eabc
        process = function(data, isPhotos) {
            for (var i = 0; i < data.length; i++) {
                var post = data[i];
                if(!isPhotos && post.type != "status")
                    continue;
                var pid = "p" + data[i].id;

                //add post to vertices
                if (vertices[pid] == undefined || vertices[pid] == null) { //photo not in vertices
                    if (isPhotos)
                        vertices[pid] = { content: post.picture, message: post.name || "", id: pid, type: "photo", likes: (post.likes == undefined ? 0 : post.likes.data.length), comments: (post.comments == undefined ? 0 : post.comments.data.length)};
                    else
                        vertices[pid] = { content: post.message || "", message: post.message || "", id: pid, type: "status" };
                    edges.push({source: meId, target: pid, type: "in_post"});
                }

                //create vertices from tags
                var tags = isPhotos ? post.tags : post.with_tags;
                for (var j = 0; j < (tags == undefined ? 0 : tags.data.length); j++) {
                    var uid = addUser(tags.data[j]);
                    edges.push({source: uid, target: pid, type: "in_post"});
                }

                //create vertices from likes
                for (var j = 0; j < (post.likes == undefined ? 0 : post.likes.data.length); j++) {
                    var uid = addUser(post.likes.data[j]);
                    edges.push({source: uid, target: pid, type: "like"});
                }

                //create vertices from comments
                for (var j = 0; j < (post.comments == undefined ? 0 : post.comments.data.length); j++) {
                    var uid = addUser(post.comments.data[j].from);
                    edges.push({source: uid, target: pid, type: "comment"});
                }
            }
        };

        process(resp.photos.data, true);
        process(resp.feed.data, false);

        callback();
    });
}

var onConnectedFn = function() {
    FB.api('/me?fields=id,name,picture', function(resp) {
        console.log('Successful login for: ' + resp.name + ", id: " + resp.id);
        meId = "u" + resp.id;
        $("#fb-photo").attr("src", resp.picture.data.url);
        vertices[meId] = { content: "<img src=\"" + resp.picture + "\" />", message: "me", id: meId, type: "me" };

        fetchData(function() {
            makeD3Graph("#graph", window.innerWidth, window.innerHeight, currentVertices, currentEdges);
        });
    });

    FB.api('/me?fields=photos{}', function(resp) {
    });
}
var onDisconnectedFn = function() {
    window.location = "/login";
}

var onClickBubble = function(d) {
    if(d.id.slice(0,1) != 'u'){
        var numID = d.id.slice(1);
        if(d.type == "photo")
            FB.api('/' + numID + '/picture?width=400', function(d) { return function(response) {
                var likes = 0, comments = 0, tags = 0;
                for (var i = 0; i < edges.length; i++) {
                    if (edges[i].source.id == d.id) {
                        if (edges[i].type == "in_post") {
                            tags += 1;
                        }
                        else if(edges[i].type == "like"){
                            likes += 1;
                        }
                        else {
                            comments += 1;
                        }
                    }
                }
                showPrompt(response.data.url, vertices[d.id].message, d.likes + " people liked this and " + d.comments + " people were talking about this.", true, d.id);
            }}(d));
        else
            showPrompt("", vertices[d.id].message, "", true, d.id);
    } else {
        var numID = d.id.slice(1);
        FB.api('/' + numID + '/picture?width=400', function(d) { return function(response) {
            var likes = 0, comments = 0, tags = 0;
            for (var i = 0; i < edges.length; i++) {
                if (edges[i].source.id == d.id) {
                    if (edges[i].type == "in_post") {
                        tags += 1;
                    }
                    else if(edges[i].type == "like"){
                        likes += 1;
                    }
                    else {
                        comments += 1;
                    }
                }
            }
            if(vertices[d.id].message != "me") {
                showPrompt(response.data.url, vertices[d.id].message, "Featured in " + tags + " of your posts, liked " + likes + " of your updates, and commented " + comments + " times on your happenings.", true, d.id);
            }else{
                showPrompt(response.data.url, vertices[d.id].message, getYouString(edges, vertices), true, d.id);
            }
        }}(d));
    }
};

function getYouString(edges, vertices){
    var ids = Object.keys(vertices);
    var degreeMap = {};
    for(var i=1; i<ids.length; i++){
        if(ids[i].slice(0,1) == 'u') {
            var degree = getDegree2(ids[i], edges);
            if (degree in degreeMap) {
                degreeMap[degree].push(ids[i]);
            } else {
                degreeMap[degree] = [ids[i]];
            }
        }
    }
    var degrees = Object.keys(degreeMap);
    var count = 0;
    var influentialIds = [];
    while(count < 5 && degrees.length != 0){
        var maxDegree = getMaxOfArray(degrees);
        degrees.splice(degrees.indexOf(maxDegree), 1);
        count += degreeMap[maxDegree].length;
        influentialIds.push.apply(influentialIds, degreeMap[maxDegree]);
    }
    var ret = "Your most influential friends on social media are:";
    for(var j=0; j < 5; j++){
        try {
            var data = vertices[influentialIds[j]].message;
            if(j == 4){
                ret += ' and ' + data + '.';
            }else {
                ret += ' ' + data + ',';
            }
        }catch(e){j-=1}
    }
    return ret;
}
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}