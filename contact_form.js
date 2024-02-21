$(document).ready(function (){
  $("#contact-form").submit(function (e){
    e.preventDefault();
   
    const formData = new FormData(this);
    $.ajax({
      type: "POST",
      url: "send_email.php",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        alert("Form submitted successfully!");
        $("#contact-form")[0].reset();
      },
      error: function (errResponse) {
        alert("Error submitting the form. Please try again.");
      }
    });
  });
});