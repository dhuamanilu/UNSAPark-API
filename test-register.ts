// Script para probar el registro sin Postman
const testRegister = async () => {
  const url = 'http://localhost:3000/api/auth/register';
  
  // Datos de prueba (Simulando lo que enviaría el celular)
  const payload = {
    email: `admin${Date.now()}@gmail.com`, // Email único cada vez
    password: "Admin123",
    nombreCompleto: "ADMINISTRADOR",
    dni: "", // DNI aleatorio
    telefono: "",
    datosPersonales: {
      dependencia: "",
      cargo: "",
      fechaIngreso: new Date(),
      condicionLaboral: ""
    },
    vehiculo: {
      marca: "",
      modelo: "",
      placa: ``, // Placa aleatoria
      color: ""
    },
    documentos: {
      dniUrl: "",
      licenciaUrl: ""
    }
  };

  try {
    console.log("📤 Enviando datos de prueba al servidor...");
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("\n📥 Respuesta del Servidor:");
    console.log(JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log("\n✅ ¡PRUEBA EXITOSA! El administrador se registró en la nube.");
    } else {
      console.log("\n❌ Error en el registro.");
    }

  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
};

testRegister();