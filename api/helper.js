export const getEventAnalysis = (text) => {
  let result = 'Analyzing...';
  // Simulate heavy computation
  for (let i = 0; i < 10000000; i++) {
    if (i % 10000000 === 0) {
      result = `Processed ${i / 1000000}M iterations`;
    }
  }
  return `Operations completed ${result}`;
};
