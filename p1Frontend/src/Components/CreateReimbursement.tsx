import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const CreateReimbursement: React.FC = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState<string>("");
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const userData = JSON.parse(user);
            setUserId(userData.userId); // Ensure the correct property is accessed
            console.log("User ID set to:", userData.userId);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const createNewReimbursement = async () => {
        if (!description || !userId) {
            console.error("Description or userId is missing");
            return;
        }

        const newReimbursement = {
            description,
            userId
        };

        try {
            await axios.post("http://localhost:8080/reimbursements/create", newReimbursement, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            navigate("/dashboard");
        } catch (error) {
            console.error("There was an error creating the reimbursement!", error);
        }
    };

    return (
        <Container>
            <h1>Create New Reimbursement</h1>
            <Form>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={createNewReimbursement}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
};