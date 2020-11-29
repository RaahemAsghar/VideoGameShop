
console.log("admin script");

function removeGame() {
  console.log("remove game");
}


//handle delete game modal

$("#delete-game-btn").on("click", function (event) {
  $("#delete-game-modal").on("show.bs.modal", function () {
    document.getElementById("delete-game-body").innerHTML =
      "Are you sure you want to delete game with ID: " + event.target.value + '?';
    document.getElementById('confirm-delete').href = '/admin/del-game/'+event.target.value
  });
});


//handle delete console modal

$("#delete-console-btn").on("click", function (event) {
    $("#delete-console-modal").on("show.bs.modal", function () {
      document.getElementById("delete-console-body").innerHTML =
        "Are you sure you want to delete console with ID: " + event.target.value + '?';
      document.getElementById('confirm-delete').href = '/admin/del-console/'+event.target.value
    });
  });
  