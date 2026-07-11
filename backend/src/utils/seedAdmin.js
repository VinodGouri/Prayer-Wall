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
    } else {
      let updated = false;

      // If existing user has no password (e.g. registered via Google previously),
      // set the initial password and force change password on login
      if (!existing.password) {
        const salt = await bcrypt.genSalt(10);
        existing.password = await bcrypt.hash('TestAdmin@123', salt);
        existing.mustChangePassword = true;
        updated = true;
        console.log('✅ Password set for existing admin user');
      }

      if (existing.role !== 'admin') {
        existing.role = 'admin';
        updated = true;
        console.log('✅ Existing user promoted to admin');
      }

      if (updated) {
        await existing.save();
      }
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = { seedAdmin };
