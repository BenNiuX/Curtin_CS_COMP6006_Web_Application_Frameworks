$(document).ready(function () {
  $(".button.delete-todo").on("click", function (e) {
    e.preventDefault();
    $target = $(e.target);
    const id = $target.attr("data-todoid");
    $.ajax({
      type: "DELETE",
      url: "/todos/" + id,
      success: function (response) {
        console.log(response);
        window.location.href = "/";
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
});
