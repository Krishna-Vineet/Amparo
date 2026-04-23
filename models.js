import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const medicalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    schedule: { type: [String], required: true },
  instructions: { type: String }
  },
  { timestamps: true }
);

const Medical = mongoose.model('Medical', medicalSchema);








const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notificationType: { type: String, required: true }, // e.g., "medication_reminder", "appointment"
    iteration: { type: String, required: true }, // Example: "daily"
    time: { type: String, required: true }, // Example: "08:00"
    message: { type: String, required: true },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

const Reminder = mongoose.model('Reminder', reminderSchema);










const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    medicalIssues: { type: String }, // Array of medical conditions
    emergencyContacts: [
      {
        name: { type: String, required: true },
        relation: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);


// Define an instance method to validate the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  // Password hashing is already done in the routes, but if we want to centralize it:
  // this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Virtual for user's medical records
userSchema.virtual('medical', {
  ref: 'Medical',
  localField: '_id',
  foreignField: 'userId'
});

// Virtual for user's reminders
userSchema.virtual('reminders', {
  ref: 'Reminder',
  localField: '_id',
  foreignField: 'userId'
});

// Ensure virtuals are included in toJSON and toObject
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);




export { Medical, Reminder, User };