"use client";

import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function useSignout() {
    const router = useRouter();

    const handleSignout = async function signOut(){
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Signed out successfully!");
                },
                onError: () => {
                    toast.error("Failed signing out");
                },
            }
        })
    }

    return handleSignout;
}