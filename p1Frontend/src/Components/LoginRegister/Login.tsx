import axios from "axios"
import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export const Login:React.FC = () => {

    //we can use the useNavigate hook to navigate between components programatically
        //(no more manual URL changing)
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const login = async () => {
        
        if (!username || !password) {
            alert("Username and password cannot be empty!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/users/login", {
                username,
                password,
            } , { withCredentials: true });

            if (response.status === 200) {
                console.log("Login successful:", response.data);
                alert("Login successful!");
                localStorage.setItem("user", JSON.stringify({ 
                userId: response.data.userId, 
                username, 
                role: response.data.role 
            }));
                navigate("/dashboard"); // Navigate to a different page after successful login
            } else {
                alert("Login failed. Please check your credentials and try again.");
            }

        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.error("Error logging in user:", error.response?.data || error.message);
                alert(`Failed to login: ${error.response?.data?.message || error.message}`);
            } else {
                console.error("Unexpected error:", error);
                alert("Failed to login. Please try again.");
            }
        }
    }

    return(
        /*Bootstrap gives us this Container element that does some default padding and centering*/
        <Container> 

            <h1>Welcome</h1>
                <h3>Please Log In:</h3>
                
                <div>
                    <Form.Control
                        type="text"
                        placeholder="username"
                        value = {username}
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <Form.Control
                        type="password"
                        placeholder="password"
                        value = {password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                

            <Button className="btn-success m-1" onClick={login}>Login</Button>
            <Button className="btn-dark" onClick={()=>navigate("/register")}>Register</Button>
        </Container>
    )


}