import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function ListadoReservas() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getReservas() {
      let response = await fetch(apiUrl + "/reservas");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }

    getReservas();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleDelete = async (reservation_id) => {
    let response = await fetch(apiUrl + "/reservas/" + reservation_id,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Utilizando filter creo un array sin el plato borrado
      const reservasTrasBorrado = rows.filter(
        (reserva) => reserva.reservation_id != reservation_id
      );
      // Establece los datos de nuevo para provocar un renderizado
      setRows(reservasTrasBorrado);
    }
  };

  

  return (
    <>
      <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
        <Typography variant="h4" align="center" sx={{ mt: 2 }}>
          Listado de reservas
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            mx: 2,
            backgroundColor: "#a2dff7", // Fondo blanco para el formulario
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">RESERVAS ID</TableCell>
                <TableCell>CLIENTE ID</TableCell>
                <TableCell>NOMBRE CLIENTE</TableCell>
                <TableCell>FECHA DE ENTRADA</TableCell>
                <TableCell>FECHA DE SALIDA</TableCell>
                <TableCell align="right">HABITACION</TableCell>
                <TableCell align="right">PRECIO</TableCell>
                <TableCell>ELIMINAR</TableCell>
                <TableCell>EDITAR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.client_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{row.reservation_id}</TableCell>
                  <TableCell align="right">{row.client_id}</TableCell>
                  <TableCell>{row.client_id_cliente.client_name}</TableCell>
                  <TableCell>{row.check_in_date}</TableCell>
                  <TableCell>{row.check_out_date}</TableCell>
                  <TableCell align="right">{row.room_number}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(row.reservation_id)}
                      color="error"
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate("/modificarreserva/" + row.reservation_id)
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
    </>
  );
}

export default ListadoReservas;
