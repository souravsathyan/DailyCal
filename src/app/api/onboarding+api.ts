// Note: You must run `expo-router` API endpoints using an Express wrapper or via EAS / local server start.
// This is a simple mock endpoint for the onboarding submission.

import { ExpoRequest } from 'expo-router/server';
// import { supabase } from '@/lib/supabase'; // Uncomment when DB is ready

export async function POST(req: ExpoRequest) {
  try {
    const body = await req.json();
    const { height, weight, age, gender, activityLevel } = body;
    
    // Server-side Validation
    if (!height || !weight || !age || !gender || !activityLevel) {
       return Response.json({ error: 'Missing required onboarding fields' }, { status: 400 });
    }

    console.log("Onboarding Data Received:", body);

    // TODO: Insert into Supabase table if user is logged in
    // For progressive onboarding where the user isn't logged in yet, we usually simply return success,
    // and rely on the frontend state `useOnboardingStore` + `useAuthStore` to save this to Supabase during the actual OAuth/Email signup.

    // If you intend for onboarding to happen AFTER signup, uncomment:
    /*
    const authHeader = req.headers.get('Authorization');
    // ... verify token and extract user id
    const { error } = await supabase.from('profiles').update(body).eq('id', user.id);
    if (error) throw error;
    */
    
    return Response.json({ success: true, message: 'Onboarding completed' }, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
