import { useEffect } from "react";
import { useUser } from "../features/authentication/hooks/useUser";
import FullyPage from "../ui/FullyPage";
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";


export default function ProtectedRoute({ children }) {

    const { user, isLoading, isAuthenticated } = useUser();
    const navigate = useNavigate();


    useEffect(function () {
        if (!isAuthenticated && !isLoading) navigate("/login")
    }, [isAuthenticated, isLoading, navigate])

    if (isLoading) return <FullyPage>
        <Spinner />
    </FullyPage>
    if (isAuthenticated)
        return children;

}
