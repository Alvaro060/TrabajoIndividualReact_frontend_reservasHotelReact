import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function ListadoPaginadoClientes() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    async function getClientes() {
      let response = await fetch(apiUrl + "/clientes");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
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
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Listado paginado de clientes
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          mx: 2,
          backgroundColor: "#a2dff7",
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
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
        <TablePagination
          rowsPerPageOptions={Array.from(
            { length: rows.length },
            (_, i) => i + 1
          )}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>
    </Box>
  );
}

export default ListadoPaginadoClientes;
