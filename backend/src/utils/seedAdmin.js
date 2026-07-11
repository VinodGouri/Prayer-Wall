const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'lemuelgouri2244@gmail.com';
    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('TestAdmin@123', salt);

      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        assemblyName: 'Prayer Wall Admin',
        mustChangePassword: true,
      });
      console.log('✅ Admin account seeded (lemuelgouri2244@gmail.com)');
    } else if (existing.role !== 'admin') {
      // If the user exists but is not admin, promote them
      existing.role = 'admin';
      await existing.save();
      console.log('✅ Existing user promoted to admin');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = { seedAdmin };
