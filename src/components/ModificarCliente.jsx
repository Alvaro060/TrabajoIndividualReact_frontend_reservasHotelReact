import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

function ModificarCliente() {
  const params = useParams();
  const [datos, setDatos] = useState({
    client_id: params.client_id,
    client_name: "",
    address: "",
    phone_number: "",
    email: "",
  });
  const [validacion, setValidacion] = useState({
    client_name: false, // true si hay error
    address: false,
    phone_number: false,
    email: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function getClienteById() {
      let response = await fetch(apiUrl + "/clientes/" + datos.client_id);
      if (response.ok) {
        let data = await response.json();
        setDatos(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/"); // Volver a la página principal por ruta erronea
      }
    }

    getClienteById();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleSubmit = async (e) => {
    // No hacemos submit
    e.preventDefault();
    console.log("Vamos a validar");
    if (validarDatos()) {
      // Enviamos los datos mediante fetch
      try {
        console.log("Vamos a hacer fetch");
        const response = await fetch(apiUrl + "/clientes/" + datos.client_id, {
          method: "PUT", // "PATCH"
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos), // JSON.stringify({blocked: true})
        });

        if (response.ok) {
          // 204 No content
          alert("Actualización correcta");
          navigate(-1); // Volver a la ruta anterior
        } else {
          // 404 Not Found cliente no modificado o no encontrado
          const data = await response.json();
          alert(data.mensaje);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error:", error);
      }
    }
  };

  function validarDatos() {
    // En principio, damos por bueno el formulario
    let validado = true;
    // Estado de la validación auxiliar
    let validacionAux = {
      client_name: false, // true si hay error
      address: false,
      phone_number: false,
      email: false,
    };

    if (datos.client_name.length < 3) {
      // Error en el nombre
      validacionAux.client_name = true;
      // Formulario invalido
      validado = false;
    }

    if (datos.address.length < 5) {
      validacionAux.address = true;
      validado = false;
    }

    let expPhone_number = /^\d{9}$/;
    if (expPhone_number.test(datos.phone_number)) {
      // El número de teléfono tiene el formato correcto (9 dígitos)
    } else {
      validacionAux.phone_number = true;
      validado = false;
    }

    let expEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (expEmail.test(datos.email)) {
      // El email tiene el formato correcto
    } else {
      validacionAux.email = true;
      validado = false;
    }

    // Actualizo el estado de la validacion de los Textfields
    setValidacion(validacionAux);
    console.log("Formulario valido:", validado);
    return validado;
  }

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Modificar cliente
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
              helperText={
                validacion.client_name && "Nombre incorrecto. Mínimo 3 caracteres"
              }
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

export default ModificarCliente;
