import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './UserList.css';

interface User {
    userId: number;
    username: string;
    role: string;
}

export const UserList:React.FC = () => {  
    
    const navigate = useNavigate();
    const [role, setRole] = useState<string>("");  
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if(user) {
            const userData = JSON.parse(user);
            setRole(userData.role);
            console.log("User role set to:", userData.role);
        } else{
            console.log("No user found, navigating to login");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        console.log("Role in second useEffect:", role);
        if (role === "MANAGER") {
            console.log("Fetching users...");
            axios.get("http://localhost:8080/users", {
                withCredentials: true
            })
                .then(response => {
                    console.log("Users fetched:", response.data);
                    setUsers(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the users!", error);
                });
        }
    }, [role]);




    const deleteUser = async (userId: number) => {
        console.log(`Attempting to delete user with ID: ${userId}`);
        try {
            await axios.delete(`http://localhost:8080/users/${userId}`, {
                withCredentials: true
            });
            setUsers(users.filter(user => user.userId !== userId));
            console.log(`User with ID ${userId} deleted successfully.`);
        } catch (error) {
            console.error("There was an error deleting the user!", error);
        }
    };
    
    //TODO: Implement this function
    const viewUser = (userId: number) => {
        navigate(`/reimbursements/${userId}`);
    }; 

    const promoteUser = async (userId: number) => {
        try {
            await axios.put(`http://localhost:8080/users/${userId}/role`, "MANAGER", {
                withCredentials: true,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
            setUsers(users.map(u => u.userId === userId ? { ...u, role: "MANAGER" } : u));
        } catch (error) {
            console.error("There was an error promoting the user!", error);
        }
    };

    if (role !== "MANAGER") {
        return <div>Access denied. Only managers can view this page.</div>;
    }

    return(
        <Container>
            <h1>Users</h1>
            <Table id="UserListTable" striped bordered hover>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.userId}</td>
                            <td>
                                <Button style={{ margin: '5px' }} variant="primary" onClick={() => viewUser(user.userId)}>View</Button>
                                <Button style={{ margin: '5px' }} variant="success" onClick={() => promoteUser(user.userId)}>Promote</Button>
                                <Button style={{ margin: '5px' }} variant="danger" onClick={() => deleteUser(user.userId)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}