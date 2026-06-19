const signUpEmailTemplate = (name, userType, deviceData, locationData) => {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome Email</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    "
  >
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      style="background-color: #f4f4f4"
    >
      <tr>
        <td align="center">
          <table
            width="700"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="background: #ffffff; max-width: 700px; width: 100%"
          >
            <!-- Hero Section -->
            <tr>
              <td
                style="
                  background-color: #6b6b6b;
                  background-image: url(&quot;https://img.mailinblue.com/11189753/images/content_library/original/69ff4f4947b9790e32f553da.jpeg&quot;);
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                  padding: 60px 50px 80px;
                  color: white;
                "
              >
                <h1
                  style="
                    font-size: 50px;
                    line-height: 65px;
                    margin: 0;
                    font-weight: 700;
                    color: #E4C779;
                  "
                >
                  Welcome on<br />board ✈️
                </h1>
                <p style="font-size: 22px; margin-top: 80px; font-weight: 600">
                  Dear ${name},
                </p>
                <p
                  style="
                    font-size: 18px;
                    line-height: 32px;
                    margin-top: 50px;
                    max-width: 520px;
                    font-weight: 600;
                  "
                >
                  Thank you for signing up for our Aviation App. We’re excited
                  to have you with us.
                </p>
                <p
                  style="
                    font-size: 18px;
                    line-height: 32px;
                    margin-top: 40px;
                    max-width: 560px;
                    font-weight: 600;
                  "
                >
                  Your <strong>${userType}</strong> account has been login using
                  <strong
                    >${deviceData?.browser?.name || "Unknown Browser"}</strong
                  >
                  browser on
                  <strong>${deviceData?.os?.name || "Unknown Device"}</strong>.
                </p>
                <p
                  style="
                    font-size: 18px;
                    line-height: 32px;
                    margin-top: 30px;
                    max-width: 560px;
                    font-weight: 600;
                  "
                >
                  Login location:
                  <strong>
                    ${locationData?.city || "Unknown City"},
                    ${locationData?.region || ""}, ${locationData?.country_name
        || ""}
                  </strong>
                </p>
                <p
                  style="
                    font-size: 18px;
                    line-height: 32px;
                    margin-top: 30px;
                    max-width: 560px;
                    font-weight: 600;
                  "
                >
                  If this wasn't you, please contact our support team
                  immediately.
                </p>
              </td>
            </tr>
            <!-- Footer Section -->
            <tr>
              <td
                style="background-color: #2d314b; color: white; padding: 50px"
              >
                <h2 style="margin: 0; font-size: 34px; font-weight: 700">
                  Aviation
                </h2>

                <p style="margin-top: 20px; font-size: 18px; line-height: 32px">
                  Raj Regency Apartment<br />
                  452001 Indore
                </p>

                <p style="margin-top: 10px">
                  <a
                    href="mailto:${process.env.EMAIL_FROM}"
                    style="
                      color: #d4af37;
                      text-decoration: none;
                      font-size: 18px;
                    "
                  >
                    ${process.env.EMAIL_FROM}
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
}

module.exports = {
    signUpEmailTemplate
}