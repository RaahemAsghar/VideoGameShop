$(window).on("load", function () {
  var pre_loader = $("#preloader");
  pre_loader.fadeOut("slow", function () {
    $(this).remove();
  });
});

