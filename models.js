import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const medicalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
<<<<<<< HEAD
    schedule: { type: [String], required: true },
=======
    schedule: {
      times: [{ type: String, required: true }], // Example: ["08:00", "20:00"]
      days: [{ type: String, required: true }],  // Example: ["Monday", "Tuesday"]
    },
>>>>>>> 02fc30822f502e41c44e4bca57872159e4c29fc9
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
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);




export { Medical, Reminder, User };