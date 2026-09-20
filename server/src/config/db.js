import mongoose from 'mongoose';

let isConnecting = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (isConnecting) return;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gokana';

  mongoose.connection.on('error', (err) => {
    console.error('⚠️ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✦ MongoDB reconnected successfully');
  });

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    isConnecting = false;
    console.log(`✦ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    isConnecting = false;
    console.error('⚠️ Initial MongoDB connection error:', err.message);
    console.log('🔄 Will retry connecting to MongoDB in 5 seconds...');
    setTimeout(() => connectDB(), 5000);
  }
};

