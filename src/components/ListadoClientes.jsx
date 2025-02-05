import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TextField, Box, Button } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function ListadoClientes() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getClientes() {
      let response = await fetch(apiUrl + "/clientes");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
        setFilteredRows(data.datos);  // Inicialmente mostramos todos los clientes
      }
    }

    getClientes();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleDelete = async (client_id) => {
    let response = await fetch(apiUrl + "/clientes/" + client_id, {
      method: "DELETE",
    });

    if (response.ok) {
      // Filtra el cliente eliminado de la lista
      const clientesTrasBorrado = rows.filter(
        (cliente) => cliente.client_id !== client_id
      );
      setRows(clientesTrasBorrado);
      setFilteredRows(clientesTrasBorrado);  // Actualiza el listado filtrado
    }
  };

  const handleSearch = async (e) => {
    setSearchId(e.target.value);

    if (e.target.value === "") {
      setFilteredRows(rows);
      return;
    }

    let response = await fetch(apiUrl + "/clientes/" + e.target.value);

    if (response.ok) {
      let data = await response.json();
      if (data.datos) {
        setFilteredRows([data.datos]);
      } else {
        setFilteredRows([]);
      }
    } else {
      setFilteredRows([]);
    }
};


  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de clientes
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Buscar por Cliente ID"
          variant="outlined"
          value={searchId}
          onChange={handleSearch}
          sx={{ width: "300px", backgroundColor: "#a2dff7", borderRadius: 2 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mx: 2,
          backgroundColor: "#a2dff7", // Fondo para el formulario
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">CLIENTE ID</TableCell>
              <TableCell>NOMBRE</TableCell>
              <TableCell>DIRECCION</TableCell>
              <TableCell align="right">TELEFONO</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>ELIMINAR</TableCell>
              <TableCell>EDITAR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.client_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.client_id}</TableCell>
                <TableCell>{row.client_name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell align="right">{row.phone_number}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(row.client_id)}
                    color="error"
                    sx={{ marginRight: 1 }}
                  >
                    <DeleteForeverIcon fontSize="small" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate("/modificarcliente/" + row.client_id)
                    }
                  >
                    <EditNoteIcon fontSize="small" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListadoClientes;
