import { useNavigate } from "react-router";
import { useState } from "react";
import { postSession, postUser } from "../../auth/services/authAPI";

export default function useForm(formType) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nav = useNavigate()

    async function handleSubmit(e) {
        // prevent default page refresh on submit
        e.preventDefault();

        //prevent duplicate request
        if(isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            const data = Object.fromEntries(new FormData(e.target));
            if(formType === 'login') await postSession(data)
            if(formType === 'signup') await postUser(data);

            nav('/home')
        } catch (error){
            alert(error.message)
            setIsSubmitting(false);
        }
    }

    return { handleSubmit }
}