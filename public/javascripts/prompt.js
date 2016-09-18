$(document).ready(function() {
    $("#prompt-popup").click(function(e) {
        e.stopPropagation();
    });
    
    //hide prompt on click
    $(document).click(function() {
        if ($("#dimmer").css("display") === "block")
            hidePrompt("no");
    });
    
    //respond to prompt 
    $("#yes-button, #okay-button").click(function() {
        hidePrompt("yes");
    });
    $("#no-button").click(function() {
       hidePrompt("no"); 
    });
    $('circle.node').click(function (e) {
        console.log('here');
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).id;
        // var data = clickVertex(id, edges, vertices);
        showPrompt('omg', 'omg', true, function(param){
        });
        console.log('here2');


    });
});

var onHidePrompt;

function showPrompt(header, message, isConfirm) {
    $("#header-text").text(header);
    $("#message-text").html(message);
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