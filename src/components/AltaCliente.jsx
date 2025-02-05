import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from '../config';

function AltaCliente() {
  const [datos, setDatos] = useState({
    client_name: "",
    address: "",
    phone_number: "",
    email: "",
  });
  
  const [validacion, setValidacion] = useState({
    client_name: false,
    address: false,
    phone_number: false,
    email: false,
  });
  
  const navigate = useNavigate();

  const validarDatos = () => {
    let validado = true;
    const validacionAux = {
      client_name: false,
      address: false,
      phone_number: false,
      email: false,
    };

    if (datos.client_name.length < 3) {
      validacionAux.client_name = true;
      validado = false;
    }

    if (datos.address.length < 5) {
      validacionAux.address = true;
      validado = false;
    }

    const expPhone = /^\d{9}$/;
    if (!expPhone.test(datos.phone_number)) {
      validacionAux.phone_number = true;
      validado = false;
    }

    const expEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!expEmail.test(datos.email)) {
      validacionAux.email = true;
      validado = false;
    }

    setValidacion(validacionAux);
    return validado;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarDatos()) {
      return;
    }

    try {
      const response = await fetch(apiUrl + "/clientes", {
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
      } else {
        const data = await response.json();
        alert(data.mensaje);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
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
        Alta de clientes
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{
              mx: 2,
              backgroundColor: "#a2dff7", // Fondo blanco para el formulario
              padding: 2,
              borderRadius: 2,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              name="client_name"
              value={datos.client_name}
              onChange={handleChange}
              error={validacion.client_name}
              helperText={validacion.client_name && "Mínimo 3 caracteres"}
            />
            <TextField
              id="outlined-basic"
              label="Direccion"
              variant="outlined"
              name="address"
              value={datos.address}
              onChange={handleChange}
              error={validacion.address}
              helperText={
                validacion.address && "Direccion incorrecto. Mínimo 5 caracteres"
              }
            />
            <TextField
              id="outlined-basic"
              label="Telefono"
              variant="outlined"
              name="phone_number"
              value={datos.phone_number}
              onChange={handleChange}
              error={validacion.phone_number}
              helperText={
                validacion.phone_number && "Telefono incorrecto. Mínimo 9 números"
              }
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              value={datos.email}
              onChange={handleChange}
              error={validacion.email}
              helperText={
                validacion.email && "Email incorrecto. Debe parecerse a un email normal"
              }
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

export default AltaCliente;
