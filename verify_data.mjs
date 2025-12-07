
console.log("STARTING VERIFICATION");
try {
    const { mockDestinations } = await import('./src/data/mockDestinations.js');
    console.log(`Loaded mockDestinations. Count: ${mockDestinations.length}`);

    const eiffel = mockDestinations.find(d => d.name === 'Eiffel Tower');
    if (eiffel) console.log("FOUND Eiffel Tower");
    else console.error("MISSING Eiffel Tower");

} catch (e) {
    console.error("CRITICAL ERROR:", e);
}
console.log("ENDING VERIFICATION");
