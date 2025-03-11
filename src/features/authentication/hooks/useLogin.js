import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import {
    login as loginApi
} from "../../../services/apiAuth";
import {
    useNavigate
} from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        mutate: login,
        isLoading
    } = useMutation({
        mutationFn: ({
                email,
                password
            }) =>
            loginApi({
                email,
                password,
            }),
        onSuccess: (user) => {
            // Update the cached data for the "user" query
            queryClient.setQueryData(["user"], user.user);
            navigate("/dashboard", {
                replace: true
            })
        },
        onError: (err) => {
            console.log("Error: ", err);
            toast.error("Provider Email or Password incorrect");
        },
    });
    return {
        login,
        isLoading
    };
}