import LoginForm from "@/components/common/LoginForm"

const Login = () => {   

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <LoginForm redirectTo="/Dashboard" />
        </div>
    )
}

export default Login