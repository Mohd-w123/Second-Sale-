import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Pincode from '../models/Pincode.js';

const pincodes = [
  // Delhi NCR
  { code: '110001', city: 'New Delhi', state: 'Delhi' },
  { code: '110002', city: 'Central Delhi', state: 'Delhi' },
  { code: '110003', city: 'Delhi GPO', state: 'Delhi' },
  { code: '110005', city: 'Karol Bagh', state: 'Delhi' },
  { code: '110016', city: 'Hauz Khas', state: 'Delhi' },
  { code: '110019', city: 'Kalkaji', state: 'Delhi' },
  { code: '110020', city: 'Okhla', state: 'Delhi' },
  { code: '110024', city: 'Lajpat Nagar', state: 'Delhi' },
  { code: '110034', city: 'Pitampura', state: 'Delhi' },
  { code: '110075', city: 'Dwarka', state: 'Delhi' },
  { code: '110085', city: 'Rohini', state: 'Delhi' },
  { code: '110092', city: 'Laxmi Nagar', state: 'Delhi' },
  { code: '122001', city: 'Gurgaon', state: 'Haryana' },
  { code: '122002', city: 'DLF Cyber City', state: 'Haryana' },
  { code: '122018', city: 'Gurgaon Sector 48', state: 'Haryana' },
  { code: '201301', city: 'Noida', state: 'Uttar Pradesh' },
  { code: '201303', city: 'Noida Sector 62', state: 'Uttar Pradesh' },
  { code: '201001', city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { code: '121001', city: 'Faridabad', state: 'Haryana' },

  // Mumbai & Maharashtra
  { code: '400001', city: 'Mumbai Fort', state: 'Maharashtra' },
  { code: '400002', city: 'Kalbadevi', state: 'Maharashtra' },
  { code: '400050', city: 'Bandra West', state: 'Maharashtra' },
  { code: '400051', city: 'Bandra BKC', state: 'Maharashtra' },
  { code: '400053', city: 'Andheri West', state: 'Maharashtra' },
  { code: '400069', city: 'Andheri East', state: 'Maharashtra' },
  { code: '400076', city: 'Powai', state: 'Maharashtra' },
  { code: '400092', city: 'Borivali West', state: 'Maharashtra' },
  { code: '400601', city: 'Thane West', state: 'Maharashtra' },
  { code: '400703', city: 'Vashi Navi Mumbai', state: 'Maharashtra' },
  { code: '411001', city: 'Pune Camp', state: 'Maharashtra' },
  { code: '411014', city: 'Viman Nagar Pune', state: 'Maharashtra' },
  { code: '411057', city: 'Hinjewadi Pune', state: 'Maharashtra' },
  { code: '411038', city: 'Kothrud Pune', state: 'Maharashtra' },
  { code: '440001', city: 'Nagpur', state: 'Maharashtra' },
  { code: '422001', city: 'Nashik', state: 'Maharashtra' },

  // Bengaluru & Karnataka
  { code: '560001', city: 'Bangalore GPO', state: 'Karnataka' },
  { code: '560025', city: 'Richmond Town', state: 'Karnataka' },
  { code: '560034', city: 'Koramangala', state: 'Karnataka' },
  { code: '560038', city: 'Indiranagar', state: 'Karnataka' },
  { code: '560066', city: 'Whitefield', state: 'Karnataka' },
  { code: '560076', city: 'BTM Layout', state: 'Karnataka' },
  { code: '560100', city: 'Electronic City', state: 'Karnataka' },
  { code: '560102', city: 'HSR Layout', state: 'Karnataka' },
  { code: '570001', city: 'Mysore', state: 'Karnataka' },
  { code: '575001', city: 'Mangalore', state: 'Karnataka' },

  // Hyderabad & Telangana
  { code: '500001', city: 'Hyderabad GPO', state: 'Telangana' },
  { code: '500032', city: 'Gachibowli', state: 'Telangana' },
  { code: '500034', city: 'Banjara Hills', state: 'Telangana' },
  { code: '500081', city: 'HITEC City', state: 'Telangana' },
  { code: '500084', city: 'Kondapur', state: 'Telangana' },
  { code: '500072', city: 'Kukatpally', state: 'Telangana' },
  { code: '500003', city: 'Secunderabad', state: 'Telangana' },

  // Chennai & Tamil Nadu
  { code: '600001', city: 'Chennai GPO', state: 'Tamil Nadu' },
  { code: '600017', city: 'T. Nagar', state: 'Tamil Nadu' },
  { code: '600028', city: 'R.A. Puram', state: 'Tamil Nadu' },
  { code: '600040', city: 'Anna Nagar', state: 'Tamil Nadu' },
  { code: '600096', city: 'Perungudi OMR', state: 'Tamil Nadu' },
  { code: '600113', city: 'Thiruvanmiyur', state: 'Tamil Nadu' },
  { code: '641001', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: '625001', city: 'Madurai', state: 'Tamil Nadu' },

  // Kolkata & West Bengal
  { code: '700001', city: 'Kolkata GPO', state: 'West Bengal' },
  { code: '700019', city: 'Ballygunge', state: 'West Bengal' },
  { code: '700064', city: 'Salt Lake City', state: 'West Bengal' },
  { code: '700091', city: 'Sector V Salt Lake', state: 'West Bengal' },
  { code: '700156', city: 'New Town Action Area 1', state: 'West Bengal' },
  { code: '711101', city: 'Howrah', state: 'West Bengal' },

  // Other Major Metros
  { code: '380001', city: 'Ahmedabad', state: 'Gujarat' },
  { code: '380015', city: 'Satellite Ahmedabad', state: 'Gujarat' },
  { code: '395001', city: 'Surat', state: 'Gujarat' },
  { code: '390001', city: 'Vadodara', state: 'Gujarat' },
  { code: '302001', city: 'Jaipur', state: 'Rajasthan' },
  { code: '302017', city: 'Malviya Nagar Jaipur', state: 'Rajasthan' },
  { code: '226001', city: 'Lucknow GPO', state: 'Uttar Pradesh' },
  { code: '226010', city: 'Gomti Nagar Lucknow', state: 'Uttar Pradesh' },
  { code: '208001', city: 'Kanpur', state: 'Uttar Pradesh' },
  { code: '452001', city: 'Indore', state: 'Madhya Pradesh' },
  { code: '462001', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: '160017', city: 'Chandigarh Sector 17', state: 'Chandigarh' },
  { code: '160022', city: 'Chandigarh Sector 22', state: 'Chandigarh' },
  { code: '141001', city: 'Ludhiana', state: 'Punjab' },
  { code: '682001', city: 'Kochi', state: 'Kerala' },
  { code: '695001', city: 'Thiruvananthapuram', state: 'Kerala' },
  { code: '800001', city: 'Patna', state: 'Bihar' },
  { code: '834001', city: 'Ranchi', state: 'Jharkhand' },
  { code: '751001', city: 'Bhubaneswar', state: 'Odisha' },
  { code: '781001', city: 'Guwahati', state: 'Assam' },
  { code: '530001', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
];

async function seedPincodes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    for (const p of pincodes) {
      await Pincode.findOneAndUpdate(
        { code: p.code },
        { ...p, isActive: true },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${pincodes.length} pincodes successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Pincode seed failed:', err.message);
    process.exit(1);
  }
}

seedPincodes();
