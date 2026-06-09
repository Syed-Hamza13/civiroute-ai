// Ye function hamare Python BERT model ko simulate kar raha hai
const analyzeGrievance = (text) => {
  const lowerText = text.toLowerCase();
  
  let predictedDepartment = 'PWD'; // Default
  let urgency = 'Medium'; // Default

  // Simple keyword matching (Isi logic ko baad me AI replace karega)
  if (lowerText.includes('water') || lowerText.includes('pipe') || lowerText.includes('leak')) {
    predictedDepartment = 'Water';
    urgency = lowerText.includes('flood') ? 'High' : 'Medium';
  } else if (lowerText.includes('light') || lowerText.includes('wire') || lowerText.includes('electricity')) {
    predictedDepartment = 'Electricity';
    urgency = lowerText.includes('live') || lowerText.includes('spark') ? 'High' : 'Medium';
  } else if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('divider')) {
    predictedDepartment = 'PWD';
    urgency = lowerText.includes('accident') || lowerText.includes('huge') ? 'High' : 'Medium';
  }

  return { predictedDepartment, urgency };
};

module.exports = { analyzeGrievance };