import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import buildTestServer from '../../src/utils/testServer';

let mongoServer: MongoMemoryServer;
export async function setupTestApp() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  return buildTestServer();
}

export async function closeTestApp() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  if (mongoServer) {
    await mongoServer.stop();
  }
}
