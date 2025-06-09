import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authMiddleware} from './authMiddleware.js';
import { User, Medical, Reminder } from './models.js';
import { spawn } from 'child_process';
import { fetchData } from './dataFetch.js';
const router = express.Router();
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs';

// GET /login
router.get('/login', (req, res) => {
    res.render('login'); // Render the login page
  });
  
  // GET /register
  router.get('/register', (req, res) => {
    res.render('register'); // Render the registration page
  });
  
  // GET /
  router.get('/', authMiddleware, (req, res) => {
    if (!req.cookies.token || !req.user) {
      return res.redirect('/login'); // Redirect to login page if not authenticated
    }
    res.render('home'); // Pass user data to the homepage template
  });

// Login route
router.post('/login', async (req, res) => {
    try {
      const { phone, password } = req.body;
  
      // Find the user by phone number
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id }, // Payload (user ID)
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '1h' } // Token expiration time
      );
  
      // Send the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 3600000, // Cookie expiration time (1 hour in milliseconds)
      });
  
      // Respond with success message
      res.json({ message: 'Login successful!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during login.' });
    }
  });


// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, emergencyContacts, medicalIssues } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      phone,
      passwordHash,
      emergencyContacts,
      medicalIssues: medicalIssues.join(', '), // Store as a comma-separated string
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});


// Protected route: Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      // Access the authenticated user's ID from req.user
      const userId = req.user.userId;
  
      // Fetch user details from the database
      const user = await User.findById(userId).select('-passwordHash'); // Exclude sensitive data
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Transform the user data into the desired format
      const userData = {
        name: user.name,
        conditions: user.medicalIssues, // Convert string to array
        phone: user.phone,
        address: "123 Healthcare St, Wellness City", // Static for now; you can add this to the database later
        medicationsCount: user.medical ? user.medical.length : '0', // Assuming `medical` is an array of medications
        remindersCount: user.reminders ? user.reminders.length : '0', // Assuming `reminders` is an array of reminders
      };
  
      // Send the user data as a response
      res.render('profile', {user : userData});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  });




// Protected route: Medicines
router.get('/medicine', authMiddleware, async (req, res) => {
    try {
      // Access the authenticated user's ID from req.user
      const userId = req.user.userId;
  
      // Fetch medications for the user from the database
      const medicines = await Medical.find({ userId });
  
      if (medicines.length === 0) {
        return res.status(200).render('medicine', { medicines: [] });
      }
      // Transform the data into the desired format
      const formattedMedicines = medicines.map(med => ({
        id: med._id,
        name: med.medicationName,
        dosage: med.dosage,
<<<<<<< HEAD
        schedule: med.schedule,
        instructions: med.instructions || 'No instructions provided'
=======
        schedule: med.schedule.times.join(', '), // Convert array of times to a string
        instructions: med.instructions || 'No instructions provided',
        lastTaken: med.lastTaken ? med.lastTaken.toISOString().split('T')[0] : 'Not taken yet',
>>>>>>> 02fc30822f502e41c44e4bca57872159e4c29fc9
      }));
  
      // Send the medicines data as a response
      res.status(200).render('medicine', { medicines: formattedMedicines});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  

// Protected route: Reminders
router.get('/reminder', authMiddleware, async (req, res) => {
  try {
    // Access the authenticated user's ID from req.user
    const userId = req.user.userId;

    // Fetch reminders for the user from the database
    // console.log(userId);
    
    const reminders = await Reminder.find({ userId });


     // If no reminders exist, return an empty array
     if (reminders.length === 0) {
      return res.status(200).render('reminder', { reminders: []});
    }


    // Transform the data into the desired format
    const formattedReminders = reminders.map(reminder => ({
      id: reminder._id,
      type: reminder.notificationType,
      message: reminder.message,
      time: reminder.time,
      iteration: reminder.iteration,
      sentAt: reminder.sentAt ? reminder.sentAt.toISOString().split('T')[0] : 'Not sent yet',
    }));

    // Send the reminders data as a response
    // console.log(formattedReminders);
    
    res.status(200).render('reminder', { reminders: formattedReminders})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});









// Fetch all reminders for the authenticated user
router.get('/reminders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const reminders = await Reminder.find({ userId });
    res.json(reminders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add a new reminder
router.post('/reminders', authMiddleware, async (req, res) => {
  try {
    const { type, time, iteration, message } = req.body;
    const userId = req.user.userId;

    const newReminder = new Reminder({
      userId,
      notificationType: type,
      time,
      iteration,
      message,
      createdAt: new Date(),
    });

    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update an existing reminder
router.put('/reminders/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, time, iteration, message } = req.body;
    const userId = req.user.userId;

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: id, userId },
      { notificationType: type, time, iteration, message },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }

    res.json(updatedReminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a reminder
router.delete('/reminders/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedReminder = await Reminder.findOneAndDelete({ _id: id, userId });

    if (!deletedReminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }

    res.json({ message: 'Reminder deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});




// Fetch all medicines for the authenticated user
router.get('/medicines', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const medicines = await Medical.find({ userId });
    res.json(medicines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add a new medicine
router.post('/medicines', authMiddleware, async (req, res) => {
  try {
    const { name, dosage, schedule, instructions } = req.body;
    const userId = req.user.userId;

    const newMedicine = new Medical({
      userId,
      medicationName: name,
      dosage,
      schedule: schedule.split('&').map(time => time.trim()),
<<<<<<< HEAD
      instructions
=======
      instructions,
      lastTaken: new Date(),
>>>>>>> 02fc30822f502e41c44e4bca57872159e4c29fc9
    });

    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update an existing medicine
router.put('/medicines/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, schedule, instructions } = req.body;
    const userId = req.user.userId;

    const updatedMedicine = await Medical.findOneAndUpdate(
      { _id: id, userId },
      { medicationName: name, dosage, schedule: schedule.split('&').map(time => time.trim()), instructions },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found.' });
    }

    res.json(updatedMedicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a medicine
router.delete('/medicines/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedMedicine = await Medical.findOneAndDelete({ _id: id, userId });

    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found.' });
    }

    res.json({ message: 'Medicine deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});



router.post('/aiwork', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;
    console.log("User ID:", userId);
    const userData = await fetchData(userId);
    console.log("User Data:", userData);

    const pythonProcess = spawn('python', ['python.py']);
    let pythonOutput = '';

    // Write input as JSON to Python stdin
    pythonProcess.stdin.write(JSON.stringify({
      text: text,
      user_profile: userData
    }));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error("Python Error:", data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const response = JSON.parse(pythonOutput);
          res.status(response.status).json({ response: response.message });
        } catch (e) {
          res.status(500).json({ error: "Invalid JSON response from Python" });
        }
      } else {
        res.status(500).json({ error: "Python script failed" });
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

