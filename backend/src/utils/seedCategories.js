const Category = require('../models/Category');

const defaultCategories = [
  { name: 'Health', icon: '🏥' },
  { name: 'Marriage', icon: '💍' },
  { name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { name: 'Financial', icon: '💰' },
  { name: 'Education', icon: '📚' },
  { name: 'Job', icon: '💼' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Ministry', icon: '⛪' },
  { name: 'General', icon: '🙏' },
  { name: 'Other', icon: '📝' },
];

const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

module.exports = { seedCategories };
