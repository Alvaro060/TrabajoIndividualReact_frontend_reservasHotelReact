import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { apiUrl } from "../config";
import { useNavigate } from "react-router";

function ListadoReservas() {
  const [rows, setRows] = useState([]);
  const [filterDates, setFilterDates] = useState({
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();

  // Función para obtener las reservas desde la API
  useEffect(() => {
    async function getReservas() {
      let response = await fetch(apiUrl + "/reservas");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }

    getReservas();
  }, []);

  // Función para manejar el cambio en las fechas de filtro
  const handleChange = (e) => {
    setFilterDates({
      ...filterDates,
      [e.target.name]: e.target.value,
    });
  };

  // Filtrar las reservas por las fechas
  const filteredRows = rows.filter((row) => {
    const checkIn = new Date(row.check_in_date);
    const checkOut = new Date(row.check_out_date);

    const startDate = new Date(filterDates.startDate);
    const endDate = new Date(filterDates.endDate);

    if (filterDates.startDate && checkIn < startDate) return false;
    if (filterDates.endDate && checkOut > endDate) return false;

    return true;
  });

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Listado de reservas parametrizado por fecha
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", marginTop: 3 }}
      >
        <TextField
          label="Fecha Inicio"
          type="date"
          name="startDate"
          value={filterDates.startDate}
          onChange={handleChange}
          sx={{ width: 200 }}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          name="endDate"
          value={filterDates.endDate}
          onChange={handleChange}
          sx={{ width: 200 }}
        />
      </Stack>

      <Grid
        container
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <Stack
            sx={{
              mx: 2,
              backgroundColor: "#a2dff7",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>ID Reserva</th>
                  <th>Cliente</th>
                  <th>Fecha Entrada</th>
                  <th>Fecha Salida</th>
                  <th>Número Habitación</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.reservation_id}>
                    <td>{row.reservation_id}</td>
                    <td>{row.client_id}</td>
                    <td>{row.check_in_date}</td>
                    <td>{row.check_out_date}</td>
                    <td>{row.room_number}</td>
                    <td>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ListadoReservas;
