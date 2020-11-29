window.setTimeout(function () {
  $(".alert")
    .fadeTo(500, 0)
    .slideUp(500, function () {
      $(this).remove();
    });
}, 3000);

$(window).on("load", function () {
  var pre_loader = $("#preloader");
  pre_loader.fadeOut("slow", function () {
    $(this).remove();
  });
});

// document.getElementById('wrapper').style.backgroundColor = 'black'


