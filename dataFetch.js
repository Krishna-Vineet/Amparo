import mongoose from 'mongoose';
import { Medical, Reminder, User } from './models.js'; // Import models

async function fetchData(userId) {
  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log("Invalid userId:", userId);
        
      throw new Error('Invalid userId');
    }

    // Get current date and time
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
    const currentTime = now.toTimeString().split(' ')[0]; // e.g., "14:00:00"
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000).toTimeString().split(' ')[0]; // e.g., "20:00:00"

    // Fetch user data
    const user = await User.findById(userId, 'name medicalIssues emergencyContacts').lean();

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch medications due in the next 6 hours
    const medications = await Medical.find({ userId }, 'medicationName dosage schedule instructions').lean();

    // Fetch reminders
    const reminders = await Reminder.find({ userId }, 'notificationType iteration time message sentAt').lean();

    // Return formatted data
    return {
      user: {
        name: user.name,
        medicalIssues: user.medicalIssues,
        emergencyContacts: user.emergencyContacts,
      },
      medications: medications.length > 0 ? medications : [],
      reminders,
    };
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

export { fetchData };