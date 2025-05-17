import SignUpForm from '@/components/sign-up-form.tsx'

const RegistrationPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignUpForm />
            </div>
        </div>
    )
}

export default RegistrationPage