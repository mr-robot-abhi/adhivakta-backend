import mongoose from "mongoose";
import User from "./models/User";
import Case from "./models/Case";
import dotenv from "dotenv";
import { auth } from "./utils/firebaseAdmin";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, { dbName: "adhivakta" });
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Case.deleteMany({});

    // Create users in Firebase first
    const lawyerFirebase = await auth.createUser({
      email: "lawyer@example.com",
      password: "password123",
      displayName: "John Doe",
    });
    const clientFirebase = await auth.createUser({
      email: "client@example.com",
      password: "password123",
      displayName: "Jane Smith",
    });

    // Create users in MongoDB
    const lawyer = new User({
      email: "lawyer@example.com",
      phone: "+1234567891",
      name: "John Doe",
      role: "lawyer",
      expertise: "Criminal Law",
      firebaseUid: lawyerFirebase.uid,
    });
    const client = new User({
      email: "client@example.com",
      phone: "+1234567892",
      name: "Jane Smith",
      role: "client",
      firebaseUid: clientFirebase.uid,
    });
    await Promise.all([lawyer.save(), client.save()]);

    // Set custom claims
    await auth.setCustomUserClaims(lawyerFirebase.uid, { role: "lawyer" });
    await auth.setCustomUserClaims(clientFirebase.uid, { role: "client" });

    // Test Cases
    const cases = [
      new Case({
        caseName: "Smith vs. State",
        caseNumber: "CR123/2025",
        caseDate: new Date("2025-01-01"),
        advocateOnRecord: lawyer._id,
        courtType: "High Court",
        hearingDates: [{ date: new Date("2025-03-20"), outcome: "Pending" }],
        documents: [
          { fileName: "Plea.pdf", path: "uploads/plea.pdf", uploadedAt: new Date() },
        ],
        status: "open",
      }),
      new Case({
        caseName: "Doe vs. Corp",
        caseNumber: "CV456/2025",
        caseDate: new Date("2025-02-01"),
        advocateOnRecord: lawyer._id,
        courtType: "District Court",
        hearingDates: [],
        documents: [],
        status: "open",
      }),
    ];
    await Case.insertMany(cases);

    console.log("Test data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();