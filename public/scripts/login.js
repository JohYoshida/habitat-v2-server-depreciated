$(document).ready(() => {

  $("#login").on("click", (event) => {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    $.ajax({
      type: 'GET',
      url: "http://localhost:4000/admin",
      data: {},
      crossDomain: true,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent(username + ':' + password))))
      }
    }).then(res => {
      if (res.verified) {
        window.location.replace("http://localhost:4000/");
      }
    });
  });

  $("#logout").on("click", (event) => {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: "http://localhost:4000/admin",
    }).then(() => {
      window.location.replace("http://localhost:4000");
    });
  })

});
