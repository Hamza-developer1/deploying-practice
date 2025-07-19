// Migration 001: Initial database indexes
export const up = async (db) => {
  console.log('Running migration 001: Creating initial indexes...');
  
  // Create indexes for users collection
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  
  // Create indexes for tasks collection
  await db.collection('tasks').createIndex({ user: 1 });
  await db.collection('tasks').createIndex({ createdAt: -1 });
  await db.collection('tasks').createIndex({ completed: 1 });
  await db.collection('tasks').createIndex({ priority: 1 });
  await db.collection('tasks').createIndex({ user: 1, completed: 1 });
  
  console.log('Migration 001 completed successfully');
};

export const down = async (db) => {
  console.log('Rolling back migration 001: Dropping indexes...');
  
  // Drop indexes (be careful in production)
  await db.collection('users').dropIndex({ email: 1 });
  await db.collection('users').dropIndex({ username: 1 });
  await db.collection('tasks').dropIndex({ user: 1 });
  await db.collection('tasks').dropIndex({ createdAt: -1 });
  await db.collection('tasks').dropIndex({ completed: 1 });
  await db.collection('tasks').dropIndex({ priority: 1 });
  await db.collection('tasks').dropIndex({ user: 1, completed: 1 });
  
  console.log('Migration 001 rollback completed');
};