export async function getRecaptchaScore(token: string, key: string): Promise<boolean> {
  let res;
  const captchData = new URLSearchParams({
    secret: key,
    response: token,
  });

  try {
    // Sending a POST request to the reCAPTCHA API using fetch
    res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: captchData,
    });

    // Parsing the JSON response
    res = await res.json();
  } catch (e) {
    // Handling errors if the reCAPTCHA verification fails
    console.log("recaptcha error:", e);
  }

  //console.log(res.score); // let's console log the score

  // Checking the result of the reCAPTCHA verification
  if (res && res.success && res.score > 0.5) {
    // If verification is successful, continue with form submission
    return true;
  } else {
    // If verification fails, return an error message
    return false;
  }
}
