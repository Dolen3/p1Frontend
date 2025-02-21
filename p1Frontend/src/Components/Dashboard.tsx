import { useEffect, useState } from "react"
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserList } from "./UserList";
import { ReimbursementList } from "./ReimbursementList";

export const Dashboard:React.FC = () => {
    
const navigate = useNavigate();
const [role, setRole] = useState<string>("")



useEffect(() => {

    const user = localStorage.getItem("user");
    if(user) {
        const userData = JSON.parse(user);
        setRole(userData.role);
    } else{
        navigate("/login");
    }

}, [navigate]);

if (!role) {
  return <div>Loading...</div>;
}


    return(
        <Container>

             {role === "EMPLOYEE" && <ReimbursementList/>} 
            {role === "MANAGER" && <UserList/>} 



        </Container>
    )
}
