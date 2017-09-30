// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (let i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class=\'articleInfo panel panel-default\' data-id='"
      + data[i]._id + "'><div class=\'panel-heading\'>"
      + data[i].title + "</div>"
      + "<div class=\'panel-body\'><p>Insert Description</p><a href=\'"
      + data[i].link
      + "\' target=\'_blank\'>Link</a></div></div>"
    );
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".articleInfo", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  let thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      //console.log(data);
      $("#notes").append(
        "<form class=\'form-horizontal\'>"
        + "<fieldset>"
          + "<legend>" + data.title + "</legend>"
            + "<div class=\'form-group\'>"
              + "<label for=\'titleinput\' class=\'col-lg-2 control-label\'>Title</label>"
              + "<div class=\'col-lg-10\'>"
                + "<input type=\'text\' class=\'form-control\' id=\'titleinput\' name=\'title\' placeholder=\'Title\'>"
              + "</div>"
            + "</div>"
            + "<div class=\'form-group\'>"
              + "<label for=\'bodyinput\' class=\'col-lg-2 control-label\'>Textarea</label>"
              + "<div class=\'col-lg-10\'>"
                + "<textarea class=\'form-control\' rows=\'5\' id='bodyinput' name=\'body\' placeholder=\'Write your note here!\'></textarea>"
              + "</div>"
            + "</div>"
            + "<div class=\'form-group\'>"
              + "<div class=\'col-lg-10 col-lg-offset-2\'>"
                + "<button type=\'submit\' class=\'btn btn-primary\' data-id=\'" + data._id + "\' id=\'savenote\'>Save Note</button>"
              + "</div>"
            + "</div>"
          + "</fieldset>"
        + "</form>"
      );
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
