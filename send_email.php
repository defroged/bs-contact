<?php

$email_to = "hello@bluestar-english.com";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

  function sanitize_input($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
  }

  $full_name = sanitize_input($_POST["full_name"]);
  $child_name = sanitize_input($_POST["child_name"]);
  $child_furi = sanitize_input($_POST["child_furi"]);
  $email = sanitize_input($_POST["email"]);
  $phone = sanitize_input($_POST["phone"]);
  $years = sanitize_input($_POST["years"]);
  $age = sanitize_input($_POST["age"]);
  $experience = sanitize_input($_POST["experience"]);
  $learning_duration = sanitize_input($_POST["learning_duration"]);
  $find_out = sanitize_input($_POST["find_out"]);
  $friend = sanitize_input($_POST["friend"]);
  $special_coupon = sanitize_input($_POST["special_coupon"]);
  $other_option = sanitize_input($_POST["other_option"]);
  $inquiry = sanitize_input($_POST["inquiry"]);

  $email_subject = "New contact form submission";
  $email_body = "Full Name: {$full_name}\n";
  $email_body .= "Child Name: {$child_name}\n";
  $email_body .= "Child Name (Furigana): {$child_furi}\n";
  $email_body .= "Email: {$email}\n";
  $email_body .= "Phone: {$phone}\n";
  $email_body .= "Years: {$years}\n";
  $email_body .= "Age: {$age}\n";
  $email_body .= "Experience: {$experience}\n";
  $email_body .= "Learning Duration: {$learning_duration}\n";
  $email_body .= "Find Out: {$find_out}\n";
  $email_body .= "Friend: {$friend}\n";
  $email_body .= "Special Coupon: {$special_coupon}\n";
  $email_body .= "Other Option: {$other_option}\n";
  $email_body .= "Inquiry: {$inquiry}\n";
  
  $headers = "From: noreply@bluestar-english.com\r\n";
  $headers .= "Reply-To: {$email}\r\n"; 
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8";

  if (mail($email_to, $email_subject, $email_body, $headers)) {
    echo "Email sent successfully";
  } else {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error sending email";
  }
} else {
  header("HTTP/1.1 405 Method Not Allowed");
  echo "Invalid request method";
}

?>