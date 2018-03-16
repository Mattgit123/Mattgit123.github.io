
$(document).ready(function() {


        $("#theMessage").animate({right: '200px'}, "slow");
        $("#theMessage").fadeOut(2000);
        $("#theMessage").fadeIn(2000);
        $("#theMessage").animate({left: '200px'}, "slow");
        $("#theMessage").fadeOut(2000);
        $("#theMessage").fadeIn(2000);
        $("#theMessage").animate({left: '-10px'}, "slow");
        $("#theMessage").fadeOut(2000);
        $("#theMessage").fadeIn(2000);

});
        // $("#theMessage").fadeOut(2000, function(){
          // our last fadeOut is done, let's center it
          // $('#theMessage').attr('style', '');
        // });
