
console.log("Testing API Endpoint: http://localhost:5000/api/ai-chat");
try {
    const response = await fetch("http://localhost:5000/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: [{ role: "user", content: "Hello! Destination check." }],
            destination: "paris" // mocking context
        })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Success:", data.success);
    console.log("Response:", data.response);
    if (data.is_fallback) console.log("Note: Using Fallback/Offline Mode");

} catch (error) {
    console.error("API Test Failed:", error.message);
}
