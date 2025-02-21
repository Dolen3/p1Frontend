import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Button, Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./ReimbursementList.css";


interface Reimbursement {
    reimbursementId: number;
    description: string;
    status: string;
  }

export const ReimbursementListByUserId: React.FC = () => { 

    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

    
    useEffect(() => {
        if (userId) {
          axios
            .get(`http://localhost:8080/reimbursements/${parseInt(userId)}`, {
              withCredentials: true,
            })
            .then((response) => {
              setReimbursements(response.data);
            })
            .catch((error) => {
              console.error("Error fetching reimbursements for user:", error);
            });
        }
      }, [userId]);

      const updateStatus = async (id: number, newStatus: string) => {
        try {
            await axios.put(`http://localhost:8080/reimbursements/${id}/updateReimbursement`, newStatus, {withCredentials: true, headers: {
                "Content-Type": "text/plain",
              }, });
            setReimbursements((prev) =>
                prev.map((r) =>
                  r.reimbursementId === id ? { ...r, status: newStatus } : r
                )
              );
            } catch (error) {
              console.error("Error updating reimbursement status:", error);
            }
          };
          

    return(
        <Container>
      <h2>Reimbursements for UserID: {userId}</h2>
      <Table id = "ReimbursementListTable" striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reimbursements
            .sort((a, b) => (a.status === "PENDING" ? -1 : 1))
            .map((r) => (
              <tr key={r.reimbursementId}>
                <td>{r.description}</td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {r.status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => updateStatus(r.reimbursementId, "APPROVED")}>
                        APPROVED
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => updateStatus(r.reimbursementId, "DENIED")}>
                        DENIED
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Button onClick={ () => navigate(`/dashboard`)}>Back</Button>

    </Container>
  );
};