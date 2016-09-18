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
    $("circle").click(function(event){
        console.log('here');
        var data = clickVertex($(this).data('id'), edges, vertices);
        showPrompt(data.title, data.content, false);
    })
});

var onHidePrompt;

function showPrompt(content, caption, message, isConfirm) {
    $("#popup-image").css("display", content == "" ? "none" : "block");
    $("#popup-image").attr("src", content);
    $("#header-text").empty().text(caption);
    $("#message-text").empty().html(message);
    if(isConfirm) {
        $("#yes-button, #no-button").addClass("invisible");
        $("#okay-button").removeClass("invisible");
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