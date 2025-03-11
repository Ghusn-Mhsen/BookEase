import {
    useMutation,
} from "@tanstack/react-query";
import {
    signUp as signUpApi
} from "../../../services/apiAuth";

import toast from "react-hot-toast";

export function useSignUp() {
    const {
        mutate: signUp,
        isLoading
    } = useMutation({
        mutationFn: signUpApi,
        onSuccess: () => {
            toast.success("Account successfully created! please Verify your Email. ")
        },
        onError: (err) => {
            console.log("Error: ", err.message);
            toast.error("Error in SignUp");
        },
    });
    return {
        signUp,
        isLoading
    };
}