const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');
const Complaint = require('./models/Complaint');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusflow';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Resource.deleteMany({}),
      Booking.deleteMany({}),
      Complaint.deleteMany({}),
    ]);
    console.log('🧹 Cleared all collections');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campusflow.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created: admin@campusflow.com / admin123');

    // Create students
    const students = await User.create([
      { name: 'Rohit Dahiya', email: 'rohit@college.edu', password: 'student123', role: 'student' },
      { name: 'Priya Sharma', email: 'priya@college.edu', password: 'student123', role: 'student' },
      { name: 'Arjun Patel', email: 'arjun@college.edu', password: 'student123', role: 'student' },
      { name: 'Sneha Gupta', email: 'sneha@college.edu', password: 'student123', role: 'student' },
      { name: 'Vikram Singh', email: 'vikram@college.edu', password: 'student123', role: 'student' },
      { name: 'Ananya Verma', email: 'ananya@college.edu', password: 'student123', role: 'student' },
      { name: 'Karan Mehta', email: 'karan@college.edu', password: 'student123', role: 'student' },
      { name: 'Divya Joshi', email: 'divya@college.edu', password: 'student123', role: 'student' },
    ]);
    console.log(`✅ ${students.length} students created (password: student123)`);

    // Create resources
    const resources = await Resource.create([
      { name: 'Computer Lab A', type: 'lab', description: 'Main CS lab with 40 high-performance workstations, dual monitors, and dedicated GPU machines', capacity: 40, location: 'Block A, Floor 2, Room 201' },
      { name: 'Computer Lab B', type: 'lab', description: 'Secondary lab with 30 PCs for general computing and programming sessions', capacity: 30, location: 'Block A, Floor 3, Room 305' },
      { name: 'AI & ML Lab', type: 'lab', description: 'Specialized lab with GPU clusters for machine learning and deep learning projects', capacity: 20, location: 'Block A, Floor 4, Room 402' },
      { name: 'Network Lab', type: 'lab', description: 'Cisco networking equipment, routers, switches for hands-on networking practice', capacity: 25, location: 'Block A, Floor 2, Room 210' },
      { name: 'Seminar Hall 101', type: 'classroom', description: 'Large seminar hall with projector, sound system, and whiteboard', capacity: 120, location: 'Block B, Floor 1, Room 101' },
      { name: 'Seminar Hall 202', type: 'classroom', description: 'Medium-sized seminar hall ideal for workshops and guest lectures', capacity: 80, location: 'Block B, Floor 2, Room 202' },
      { name: 'Tutorial Room 301', type: 'classroom', description: 'Small classroom with smart board for tutorial and group study sessions', capacity: 35, location: 'Block C, Floor 3, Room 301' },
      { name: 'Tutorial Room 302', type: 'classroom', description: 'Small interactive classroom with round-table seating arrangement', capacity: 30, location: 'Block C, Floor 3, Room 302' },
      { name: 'Main Auditorium', type: 'auditorium', description: 'College auditorium with stage, lighting, and professional sound system for cultural events', capacity: 500, location: 'Main Building, Ground Floor' },
      { name: 'Mini Auditorium', type: 'auditorium', description: 'Smaller auditorium for departmental events, presentations, and conferences', capacity: 200, location: 'Block D, Floor 1' },
      { name: 'Cricket Ground', type: 'sports', description: 'Full-size cricket ground with practice nets and floodlights', capacity: 300, location: 'Campus Sports Complex' },
      { name: 'Indoor Sports Hall', type: 'sports', description: 'Badminton, table tennis, and basketball courts under one roof', capacity: 150, location: 'Sports Block, Ground Floor' },
      { name: 'Discussion Room 1', type: 'other', description: 'Private meeting room with video conferencing setup for group discussions', capacity: 10, location: 'Library Building, Floor 2' },
      { name: 'Maker Space', type: 'other', description: 'Innovation hub with 3D printers, soldering stations, and prototyping tools', capacity: 15, location: 'Block E, Floor 1' },
    ]);
    console.log(`✅ ${resources.length} resources created`);

    // Helper: create date offsets
    const now = new Date();
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    const setHour = (date, h) => { const d = new Date(date); d.setHours(h, 0, 0, 0); return d; };

    // Create bookings
    const bookings = await Booking.create([
      { user: students[0]._id, resource: resources[0]._id, startTime: setHour(daysFromNow(1), 9), endTime: setHour(daysFromNow(1), 11), purpose: 'Web Development workshop for 3rd year students', status: 'approved', adminNote: 'Approved — please ensure cleanup after session' },
      { user: students[1]._id, resource: resources[4]._id, startTime: setHour(daysFromNow(2), 14), endTime: setHour(daysFromNow(2), 16), purpose: 'IEEE student chapter guest lecture on cloud computing', status: 'approved' },
      { user: students[2]._id, resource: resources[2]._id, startTime: setHour(daysFromNow(3), 10), endTime: setHour(daysFromNow(3), 13), purpose: 'Training ML model for final year project using GPU cluster', status: 'pending' },
      { user: students[3]._id, resource: resources[8]._id, startTime: setHour(daysFromNow(5), 17), endTime: setHour(daysFromNow(5), 21), purpose: 'Annual cultural fest opening ceremony rehearsal', status: 'pending' },
      { user: students[4]._id, resource: resources[1]._id, startTime: setHour(daysFromNow(1), 14), endTime: setHour(daysFromNow(1), 16), purpose: 'Competitive programming practice session for ICPC team', status: 'approved' },
      { user: students[5]._id, resource: resources[5]._id, startTime: setHour(daysFromNow(4), 10), endTime: setHour(daysFromNow(4), 12), purpose: 'Technical seminar on blockchain technology', status: 'pending' },
      { user: students[6]._id, resource: resources[10]._id, startTime: setHour(daysFromNow(6), 6), endTime: setHour(daysFromNow(6), 9), purpose: 'Inter-department cricket tournament practice match', status: 'approved' },
      { user: students[0]._id, resource: resources[12]._id, startTime: setHour(daysFromNow(2), 15), endTime: setHour(daysFromNow(2), 17), purpose: 'Project review meeting with team members', status: 'approved' },
      { user: students[7]._id, resource: resources[9]._id, startTime: setHour(daysFromNow(7), 14), endTime: setHour(daysFromNow(7), 18), purpose: 'Departmental farewell event planning and setup', status: 'pending' },
      { user: students[3]._id, resource: resources[6]._id, startTime: setHour(daysAgo(2), 9), endTime: setHour(daysAgo(2), 11), purpose: 'Data Structures tutorial session for juniors', status: 'approved' },
      { user: students[1]._id, resource: resources[3]._id, startTime: setHour(daysAgo(1), 14), endTime: setHour(daysAgo(1), 16), purpose: 'CCNA certification exam prep lab session', status: 'rejected', adminNote: 'Lab under maintenance on that day, please reschedule' },
      { user: students[5]._id, resource: resources[13]._id, startTime: setHour(daysFromNow(3), 10), endTime: setHour(daysFromNow(3), 14), purpose: 'IoT project — assembling prototype with 3D printed parts', status: 'approved' },
      { user: students[2]._id, resource: resources[7]._id, startTime: setHour(daysAgo(5), 10), endTime: setHour(daysAgo(5), 12), purpose: 'Group study for Operating Systems mid-term exam', status: 'cancelled' },
      { user: students[4]._id, resource: resources[11]._id, startTime: setHour(daysFromNow(8), 16), endTime: setHour(daysFromNow(8), 18), purpose: 'Badminton doubles tournament — quarter finals', status: 'pending' },
    ]);
    console.log(`✅ ${bookings.length} bookings created`);

    // Create complaints
    const complaints = await Complaint.create([
      { user: students[0]._id, title: 'Computer Lab A — PC #12 not working', description: 'The monitor on workstation 12 in Computer Lab A has a flickering display and the keyboard is missing several keys. Unable to work on assignments properly.', category: 'infrastructure', status: 'in-progress', adminResponse: 'Maintenance team notified. Will be fixed within 48 hours.' },
      { user: students[1]._id, title: 'Wi-Fi connectivity issues in Block B', description: 'The Wi-Fi in Block B, Floor 2 keeps disconnecting every 10-15 minutes. Multiple students are affected. This has been going on for a week now.', category: 'infrastructure', status: 'open' },
      { user: students[2]._id, title: 'Projector not working in Seminar Hall 101', description: 'The projector in Seminar Hall 101 shows a dim image and the HDMI port is loose. We have a presentation scheduled next week and need it fixed urgently.', category: 'facilities', status: 'resolved', adminResponse: 'Projector bulb replaced and HDMI port repaired. Tested and working fine now.' },
      { user: students[3]._id, title: 'Water cooler broken near Block C entrance', description: 'The water cooler near the Block C entrance has been leaking since Monday. It is creating a slippery floor which is a safety hazard for students.', category: 'facilities', status: 'resolved', adminResponse: 'Plumber dispatched. Water cooler has been repaired and the leak is fixed.' },
      { user: students[4]._id, title: 'Request for extended library hours during exams', description: 'As mid-term exams are approaching, many students need the library to stay open until 11 PM instead of 8 PM. Please consider extending the hours.', category: 'academics', status: 'open' },
      { user: students[5]._id, title: 'Hostel Room 305 — AC not cooling', description: 'The air conditioner in Room 305 of the boys hostel has stopped cooling. The room temperature is unbearable, especially during the afternoon. Complained verbally 3 times already.', category: 'hostel', status: 'in-progress', adminResponse: 'AC technician scheduled for tomorrow morning. Temporary portable fan will be provided.' },
      { user: students[6]._id, title: 'Broken bench in Tutorial Room 301', description: 'One of the benches in Tutorial Room 301 has a broken leg and is unstable. A student almost fell yesterday. Please replace or repair it immediately.', category: 'infrastructure', status: 'open' },
      { user: students[7]._id, title: 'Inadequate parking space for cycles', description: 'The cycle parking area near Block A is always overflowing. Many students have to park on the road which gets their cycles damaged. Need more parking racks.', category: 'facilities', status: 'closed', adminResponse: 'New parking racks installed near Block A and Block C entrances. Capacity doubled.' },
      { user: students[0]._id, title: 'AI Lab GPU cluster overheating', description: 'The GPU machines in the AI Lab are overheating during extended training sessions. The lab gets very hot and the machines throttle, slowing down our research.', category: 'infrastructure', status: 'in-progress', adminResponse: 'Additional cooling units ordered. Expected installation by end of this week.' },
      { user: students[1]._id, title: 'Canteen food quality deteriorating', description: 'The food quality in the main canteen has dropped significantly. Stale ingredients are being used and portions have decreased. Multiple students have gotten sick.', category: 'other', status: 'open' },
    ]);
    console.log(`✅ ${complaints.length} complaints created`);

    console.log('\n🚀 Seeding complete!\n');
    console.log('  📧 Admin:    admin@campusflow.com / admin123');
    console.log('  📧 Student:  rohit@college.edu / student123');
    console.log('  📧 Student:  priya@college.edu / student123');
    console.log('  ... and 6 more students (all password: student123)\n');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
