import { supabaseClient } from './supabase.js';

export async function login(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message, user: null };
    }

    return { error: null, user: data.user };
  } catch (err) {
    return { error: err.message, user: null };
  }
}

export async function signup(name, email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null, user: data.user };
  } catch (err) {
    return { error: err.message };
  }
}

export async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session?.user || null;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}
