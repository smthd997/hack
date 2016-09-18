$(document).ready(function() {
    $("#prompt-popup").click(function(e) {
        e.stopPropagation();
    });
    
    //hide prompt on click
    // $(document).click(function() {
    //     if ($("#dimmer").css("display") === "block")
    //         hidePrompt("no");
    // });
    
    //respond to prompt 
    $("#yes-button, #okay-button").click(function() {
        hidePrompt("yes");
    });
    $("#no-button").click(function() {
       hidePrompt("no"); 
    });
    // $("#remove-button").click(function() {
    //     hidePrompt("yes");
    //     var id = $("#info-text").text();
    //     console.log(id);
    //     var newData = deleteInfo(id, currentEdges, currentVertices);
    //     currentEdges = newData.edges;
    //     currentVertices = newData.vertices;
    //     console.log(currentEdges);
    //     console.log(currentVertices);
    //     makeD3Graph("#graph", window.innerWidth, window.innerHeight, currentVertices, currentEdges);
    // });
});

var onHidePrompt;

function showPrompt(content, caption, message, isConfirm, id) {
    $("#popup-image").css("display", content == "" ? "none" : "block");
    $("#popup-image").attr("src", content);
    $("#header-text").empty().text(caption);
    $("#message-text").empty().html(message);
    if(isConfirm) {
        $("#yes-button, #no-button").addClass("invisible");
        $("#okay-button").removeClass("invisible");
        $("#info-text").text(id);
    } else {
        $("#yes-button, #no-button").removeClass("invisible");
        $("#okay-button").addClass("invisible");
    }
    $("#dimmer").stop();
    $("#dimmer").fadeIn(300);
}

function hidePrompt(param) {
    $("#dimmer").fadeOut(300);
}