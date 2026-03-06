require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const UserSchema = new mongoose.Schema({
        name: String, email: { type: String, unique: true, lowercase: true },
        password: { type: String, select: false },
        role: { type: String, default: 'student' },
        avatar: String, xp: { type: Number, default: 0 },
        streak: { type: Number, default: 0 }, lastLogin: Date,
        isActive: { type: Boolean, default: true },
    }, { strict: false });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const email = 'admin@eduflow.com';
    const password = 'Admin@1234';
    const hashed = await bcrypt.hash(password, 12);

    const existing = await User.findOne({ email });
    if (existing) {
        await User.updateOne({ email }, { $set: { password: hashed, role: 'admin', name: 'EduFlow Admin' } });
        console.log(`✅ Admin user UPDATED: ${email}`);
    } else {
        await User.create({ name: 'EduFlow Admin', email, password: hashed, role: 'admin', xp: 0, streak: 0 });
        console.log(`✅ Admin user CREATED: ${email}`);
    }
    console.log(`   Password: ${password}`);
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => { console.error('❌ Seeder error:', err); process.exit(1); });
