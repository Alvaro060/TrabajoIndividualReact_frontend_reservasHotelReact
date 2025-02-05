import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function AltaReserva() {
  const [datos, setDatos] = useState({
    client_id: "",
    check_in_date: "",
    check_out_date: "",
    room_number: "",
    price: "",
  });

  const [validacion, setValidacion] = useState({
    client_id: false,
    check_in_date: false,
    check_out_date: false,
    room_number: false,
    price: false,
  });

  const navigate = useNavigate();

  const validarCliente = async (clientId) => {
    try {
      const response = await fetch(`${apiUrl}/clientes/${clientId}`);
      return response.ok;
    } catch (error) {
      console.error("Error al verificar el cliente:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!await validarDatos()) {
      return; // Detener el envío si la validación falla
    }

    try {
      const response = await fetch(apiUrl + "/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const respuesta = await response.json();
        alert(respuesta.mensaje);
        if (respuesta.ok) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  const validarDatos = async () => {
    let validado = true;
    let validacionAux = {
      client_id: false,
      check_in_date: false,
      check_out_date: false,
      room_number: false,
      price: false,
    };

    // Validación client_id
    if (!datos.client_id || !await validarCliente(datos.client_id)) {
      validacionAux.client_id = true;
      validado = false;
    }

    // Validación fechas
    const expDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!datos.check_in_date || !expDate.test(datos.check_in_date)) {
      validacionAux.check_in_date = true;
      validado = false;
    }
    if (!datos.check_out_date || !expDate.test(datos.check_out_date)) {
      validacionAux.check_out_date = true;
      validado = false;
    }
    if (datos.check_in_date && datos.check_out_date) {
      const checkIn = new Date(datos.check_in_date);
      const checkOut = new Date(datos.check_out_date);
      if (checkOut < checkIn) {
        validacionAux.check_out_date = true;
        validado = false;
      }
    }

    // Validación número de habitación
    const expRoomNumber = /^\d+$/;
    if (!datos.room_number || !expRoomNumber.test(datos.room_number) || parseInt(datos.room_number) <= 0) {
      validacionAux.room_number = true;
      validado = false;
    }

    // Validación precio
    const expPrice = /^\d+(\.\d{1,2})?$/;
    if (!datos.price || !expPrice.test(datos.price) || parseFloat(datos.price) <= 0) {
      validacionAux.price = true;
      validado = false;
    }

    setValidacion(validacionAux);
    return validado;
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de reservas
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ mx: 2, backgroundColor: "#a2dff7", padding: 2, borderRadius: 2 }}
          >
            <TextField
              label="Cliente Id"
              variant="outlined"
              name="client_id"
              value={datos.client_id}
              onChange={handleChange}
              error={validacion.client_id}
              helperText={validacion.client_id && "Id incorrecto o inexistente."}
            />
            <TextField
              label="Fecha De Entrada"
              variant="outlined"
              type="date"
              name="check_in_date"
              value={datos.check_in_date}
              onChange={handleChange}
              error={validacion.check_in_date}
              helperText={validacion.check_in_date && "Fecha de Entrada incorrecta."}
            />
            <TextField
              label="Fecha De Salida"
              variant="outlined"
              type="date"
              name="check_out_date"
              value={datos.check_out_date}
              onChange={handleChange}
              error={validacion.check_out_date}
              helperText={validacion.check_out_date && "Fecha de Salida incorrecta."}
            />
            <TextField
              label="Numero De Habitacion"
              variant="outlined"
              name="room_number"
              value={datos.room_number}
              onChange={handleChange}
              error={validacion.room_number}
              helperText={validacion.room_number && "Habitación incorrecta. Debe ser mayor que 0"}
            />
            <TextField
              label="Precio"
              variant="outlined"
              name="price"
              value={datos.price}
              onChange={handleChange}
              error={validacion.price}
              helperText={validacion.price && "Precio incorrecto. Debe ser mayor que 0"}
            />
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AltaReserva;
