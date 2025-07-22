// controllers/programController.js

// Get all programs
exports.getPrograms = (req, res) => {
  res.json({ message: 'Fetched all programs successfully.' });
};

// Get a single program by ID
exports.getProgram = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Fetched program with ID: ${id}` });
};

// Create a new program
exports.createProgram = (req, res) => {
  const programData = req.body;
  res.status(201).json({ message: 'Program created successfully.', data: programData });
};

// Update an existing program
exports.updateProgram = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  res.json({ message: `Program with ID ${id} updated successfully.`, data: updatedData });
};

// Delete a program
exports.deleteProgram = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Program with ID ${id} deleted successfully.` });
};

// Enroll user in a program
exports.enrollProgram = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  res.json({ message: `User ${userId} enrolled in program ${id}.` });
};

// Unenroll user from a program
exports.unenrollProgram = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  res.json({ message: `User ${userId} unenrolled from program ${id}.` });
};

// Get progress of a user in a program
exports.getProgramProgress = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  res.json({ message: `Progress for user ${userId} in program ${id}.` });
};

// Mark a module as complete
exports.markModuleComplete = (req, res) => {
  const { id, moduleId } = req.params;
  const userId = req.user.id;
  res.json({ message: `User ${userId} completed module ${moduleId} in program ${id}.` });
};
