import axios from "axios";
import "./ReimbursementList.css";
import { useEffect, useState } from "react";
import { Container, Table, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Reimbursement {
    reimbursementId: number;
    description: string;
    status: string;
}

export const ReimbursementList: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const [role, setRole] = useState<string>("");
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
    const [showPending, setShowPending] = useState<boolean>(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const userData = JSON.parse(user);
            setRole(userData.role);
            setUserId(userData.userId);
            console.log("User ID set to:", userData.userId);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (role) {
            axios.get(`http://localhost:8080/reimbursements/${userId}`, {
                    withCredentials: true,
                })
                .then((response) => {
                    console.log("Fetched reimbursements:", response.data);
                    setReimbursements(response.data);
                })
                .catch((error) => {
                    console.error("There was an error fetching the reimbursements!", error);
                });
        }
    }, [role, userId]);

    const updateDescription = async (id: number, newDescription: string) => {
        if (!id || isNaN(id)) {
            console.error("Invalid ID provided:", id);
            return;
        }
        try {
            const response = await axios.put(
                `http://localhost:8080/reimbursements/${id}/updateDescription`,
                newDescription,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            );
            setReimbursements(
                reimbursements.map((r) =>
                    r.reimbursementId === id ? { ...r, description: response.data.description } : r
                )
            );
        } catch (error) {
            console.error("There was an error updating the description!", error);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await axios.put(
                `http://localhost:8080/reimbursements/${id}/updateReimbursement`,
                status,
                { withCredentials: true }
            );
            setReimbursements(
                reimbursements.map((r) => (r.reimbursementId === id ? { ...r, status } : r))
            );
        } catch (error) {
            console.error("There was an error updating the status!", error);
        }
    };

    // Filter reimbursements if showPending is true
    const filteredReimbursements = showPending
        ? reimbursements.filter(r => r.status === "PENDING")
        : reimbursements;

    return (
        <Container>
            <h1>Reimbursements</h1>
            <div style={{ marginBottom: "10px" }}>
                <Button style={{ margin: '5px' }} onClick={() => navigate("/createReimbursement")}>
                    Create New Reimbursement
                </Button>
                <Button
                    style={{ margin: '5px' }}
                    onClick={() => setShowPending(prev => !prev)}
                >
                    {showPending ? "Show All" : "Show Pending Only"}
                </Button>
            </div>
            <Table id="ReimbursementListTable" striped bordered hover>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Actions</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReimbursements
                        .sort((a, b) => (a.status === "PENDING" ? -1 : 1))
                        .map((r) => (
                            <tr key={r.reimbursementId}>
                                <td>{r.description}</td>
                                <td>
                                    {role === "EMPLOYEE" ? (
                                        <Button
                                            onClick={() =>
                                                updateDescription(
                                                    r.reimbursementId,
                                                    prompt("Enter new description:", r.description) || r.description
                                                )
                                            }
                                        >
                                            Edit Description
                                        </Button>
                                    ) : (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                Update Status
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={() => updateStatus(r.reimbursementId, "APPROVED")}
                                                >
                                                    Approve
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => updateStatus(r.reimbursementId, "DENIED")}
                                                >
                                                    Deny
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </td>
                                <td>{r.status}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
};