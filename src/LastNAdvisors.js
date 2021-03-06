import React, { useState } from "react";
import {
  Link,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TableHead
} from "@material-ui/core";
import Form from "./Form";
import TextField from "./TextField";

const fetchAdvisors = `
  query LastNAdvisors($limit: Int!) {
    advisors(limit: $limit) {
      id
      demographic {
        firstName
        lastName
      }
      emails {
        address
      }
      phones {
        number
      }
    }
  }
`;

export default function LastNAdvisors({ children, submitQuery }) {
  const [advisors, setAdvisors] = useState([]);
  const [data, setData] = useState({});

  const handleChange = (name, value) =>
    setData((d) => ({ ...d, [name]: value }));

  return (
    <div>
      <Form
        onSubmit={async () => {
          const response = await submitQuery(fetchAdvisors, {
            variables: { limit: parseInt(data.limit, 10) }
          });
          if (response) setAdvisors(response.advisors);
        }}
        submitText={
          data.limit
            ? `Query the last ${data.limit} advisors`
            : "Query advisors"
        }
      >
        {children}
        <TextField
          name="limit"
          label="Limit"
          onChange={handleChange}
          required
          type="number"
        />
      </Form>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Link</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone #</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advisors.length ? (
              advisors.map((advisor) => (
                <TableRow key={advisor.id}>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={`https://www.agencieshq.com/advisors/${advisor.id}`}
                    >
                      {advisor.demographic.firstName}{" "}
                      {advisor.demographic.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{advisor.demographic.firstName}</TableCell>
                  <TableCell>{advisor.demographic.lastName}</TableCell>
                  <TableCell>
                    {advisor.phones.map((p) => p.number).join(", ")}
                  </TableCell>
                  <TableCell>
                    {advisor.emails.map((p) => p.address).join(", ")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  No advisors
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
