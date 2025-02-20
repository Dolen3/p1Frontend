import axios from "axios"
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";

export const Register:React.FC = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    //Hardcoding a new user registration with axios 
    //axios is a way to send HTTP requests from React
    const register = async () => {
        
        if (!username || !password) {
            alert("Username and password cannot be empty!");
            return;
        }


        try {
            const response = await axios.post("http://localhost:8080/users/register", {
        username,
        password,
      });


      console.log("Registration successful:", response.data);
      alert("Account created successfully!");
      localStorage.setItem("user", JSON.stringify({ 
        userId: response.data.userId, 
        username, 
        role: response.data.role 
    }));
      navigate("/dashboard");

        } catch(error) {
            console.error("Error registering user:", error);
            alert("Failed to register. Please try again.");
        }
    }

    return(

        <Container>
          <div>
              <h1>Create an account:</h1>

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

              <div>
                <Button onClick={register}>Create Account</Button>
              </div>
          </div>
      </Container>
  )

}