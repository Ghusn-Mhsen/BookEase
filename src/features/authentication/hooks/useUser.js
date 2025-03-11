import {
    useQuery
} from "@tanstack/react-query";
import {
    getCurrentUser
} from "../../../services/apiAuth";

export function useUser() {
    const {
        data: user,
        isLoading,
        error
    } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        onError: (err) => {
            console.error("Failed to fetch user:", err);
        },
    });
    return {
        user,
        isLoading,
        error,
        isAuthenticated: user?.role === 'authenticated',
    };
}