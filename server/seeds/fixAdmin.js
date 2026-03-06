const dns = require('dns'); dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const col = mongoose.connection.collection('users');

    // Hash password fresh (bypassing mongoose pre-save hook)
    const hash = await bcrypt.hash('Admin@1234', 12);

    // Use updateOne with $set to bypass pre-save hook entirely  
    const result = await col.updateOne(
        { email: 'admin@eduflow.com' },
        { $set: { password: hash, role: 'admin', isActive: true, name: 'EduFlow Admin' } }
    );

    if (result.matchedCount === 0) {
        // Create fresh if not found
        await col.insertOne({
            name: 'EduFlow Admin',
            email: 'admin@eduflow.com',
            password: hash,
            role: 'admin',
            xp: 0,
            streak: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Admin user CREATED from scratch');
    } else {
        console.log('✅ Admin password FIXED (', result.modifiedCount, 'doc updated)');
    }

    // Verify immediately
    const user = await col.findOne({ email: 'admin@eduflow.com' });
    const valid = await bcrypt.compare('Admin@1234', user.password);
    console.log('🔐 Password verification:', valid ? 'VALID ✅' : 'INVALID ❌ — something is wrong!');
    console.log('👤 Role:', user.role);
    console.log('📧 Email:', user.email);

    await mongoose.disconnect();
    process.exit(0);
}

fixAdmin().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
