meId = "";
vertices = { };
edges = [];

function addUser(user) {
    var uid = "u" + user.id;
    if (uid == meId)
        return "me";
    if(vertices[uid] == undefined || vertices[uid] == null) { //user not in vertices
        vertices[uid] = { content: user.name, message: user.name, id: uid, type: "user" };
    }
    return uid;
}

function fetch(isPhotos) {
    FB.api(isPhotos ? '/me?fields=photos{id, name, picture, tags, likes, comments}' : '/me?fields=feed{id, message, type, with_tags, likes, comments}', function(resp) {
        var data = isPhotos ? resp.photos.data : resp.feed.data;
        for (var i = 0; i < data.length; i++) {
            var post = data[i];
            if(!isPhotos && post.type != "status")
                continue;
            var pid = "p" + data[i].id;

            //add post to vertices
            if (vertices[pid] == undefined || vertices[pid] == null) { //photo not in vertices
                if (isPhotos)
                    vertices[pid] = { content: "<img src=\"" + post.picture + "\" />", message: post.name || "", id: pid, type: "photo", likes: (post.likes == undefined ? 0 : post.likes.data.length), comments: (post.comments == undefined ? 0 : post.comments.data.length)};
                else
                    vertices[pid] = { content: post.message || "", message: post.message || "", id: pid, type: "status" };
                edges.push({source: "me", target: pid, type: "in_post"});
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
    });
}

var onConnectedFn = function() {
    FB.api('/me?fields=id,name,picture', function(resp) {
        console.log('Successful login for: ' + resp.name);
        var uid = "u" + resp.id;
        $("#fb-photo").attr("src", resp.picture.data.url);
        $("#logged-in-user").text(resp.name);
        vertices[uid] = { content: "<img src=\"" + resp.picture + "\" />", message: "me", id: uid, type: "user" };
    });

    FB.api('/1031068623608604/likes', function(resp) {
    });

    fetch(true);
    fetch(false);
}
var onDisconnectedFn = function() {
    window.location = "/login";
}