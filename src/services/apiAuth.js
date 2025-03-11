import {
    data
} from 'react-router-dom';
import supabase, {
    supabaseUrl
} from './supabase'
export async function signUp({
    fullName,
    email,
    password
}) {

    const {
        data,
        error
    } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: ""
            },
        },
    });
    if (error) throw new Error(error.message)
    return data
}
export async function login({
    email,
    password
}) {
    let {
        data,
        error
    } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) throw new Error(error.message)
    return data
}

export async function getCurrentUser() {
    const {
        data: session
    } = await supabase.auth.getSession()
    if (!session) return null
    const {
        data,
        error
    } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return data?.user
}

export async function logout() {
    const {
        error
    } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
}



export async function updateCurrentUser({
    password,
    fullName,
    avatar
}) {
    try {
        let updatedData = {};
        if (password) updatedData.password = password;
        if (fullName) updatedData.data = {
            fullName
        };

        const {
            data,
            error
        } = await supabase.auth.updateUser(updatedData);
        if (error) throw new Error(error.message);

        if (!avatar) return data;

        if (!(avatar instanceof File)) {
            throw new Error("Invalid avatar file.");
        }

        // Upload avatar to Supabase Storage
        const fileName = `avatar-${data.user.id}-${Math.random()}`;
        const {
            error: storageError
        } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatar);

        if (storageError) throw new Error(storageError.message);

        // Update user with the new avatar URL
        const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
        const {
            data: updatedUser,
            error: error_user
        } = await supabase.auth.updateUser({
            data: {
                avatar: avatarUrl
            },
        });

        if (error_user) throw new Error(error_user.message);

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw error;
    }
}