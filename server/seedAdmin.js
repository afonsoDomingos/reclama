const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to create admin...');

        const adminData = {
            name: 'Administrador Reclama',
            email: 'admin@reclama.com',
            password: '@Admin123@',
            role: 'admin',
            department: 'Diretoria'
        };

        const existingUser = await User.findOne({ email: adminData.email });

        if (existingUser) {
            console.log('Admin user already exists.');
        } else {
            await User.create(adminData);
            console.log('Admin user created successfully!');
            console.log('Email: admin@reclama.com');
            console.log('Password: @Admin123@');
        }

        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
