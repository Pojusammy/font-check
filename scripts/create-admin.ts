/**
 * Creates an admin user in the Supabase database.
 * Usage: npx tsx scripts/create-admin.ts <email> <password>
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
  process.exit(1);
}

if (password.length < 12) {
  console.error("Password must be at least 12 characters");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const password_hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("admin_users")
    .upsert(
      { email: email.toLowerCase().trim(), password_hash, role: "super_admin" },
      { onConflict: "email" }
    )
    .select("id, email, role")
    .single();

  if (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }

  console.log("Admin user created/updated:");
  console.log(`  Email: ${data.email}`);
  console.log(`  Role:  ${data.role}`);
  console.log(`  ID:    ${data.id}`);
}

main();
