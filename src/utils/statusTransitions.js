// Valid status transitions based on assignment rules
const validTransitions = {
  NEW: ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED', 'LOST'], 
  QUALIFIED: ['CONVERTED', 'LOST'],
  CONVERTED: [], // Terminal state
  LOST: [] // Terminal state
};

const isValidTransition = (currentStatus, newStatus) => {
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

module.exports = {
  isValidTransition,
  validTransitions
};