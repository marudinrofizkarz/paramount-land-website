const fetch = require("node-fetch");

async function testAPI() {
  try {
    console.log("Testing API endpoint...");
    const response = await fetch(
      "http://localhost:9003/api/landing-pages/components"
    );
    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.data) {
      console.log("Components count:", data.data.length);
      console.log(
        "Component types:",
        data.data.map((c) => c.type)
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAPI();
