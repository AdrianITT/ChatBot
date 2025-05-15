import React,{useEffect, useState} from 'react';
import {createServicioPreCotizacion, createPreCotizacion, getServicioData } from './api/Api';
import { Widget, addResponseMessage } from 'react-chat-widget-react-18';
import 'react-chat-widget-react-18/lib/styles.css';

function App() {
  const [step, setStep] = React.useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    empresa: '',
    fechaSolicitud: '',
    fechaCaducidad: '',
    servicios: [],
  });
  const [servicioActual, setServicioActual] = useState({});
  const hasGreeted = React.useRef(false);
  const [servicioTemporal, setServicioTemporal] = useState({ numero: null, cantidad: null });
  const [servicioAEditar, setServicioAEditar] = useState(null); // puede ser un índice
  const [campoAEditar, setCampoAEditar] = useState(null);
  const [pasoExtra, setPasoExtra] = useState(null); // variable temporal para saber que luego viene la cantidad



  React.useEffect(() => {
    if (!hasGreeted.current) {
      addResponseMessage('¡Hola! Soy un chatbot. ¿Quieres crear una cotización?');
      addResponseMessage('Para crear una cotización necesito algunos datos.');
      addResponseMessage("¿Cuál es tu nombre?");
      hasGreeted.current = true;
    }
  }, []);

  const validacionNombre = (nombre) => {
    const regex = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;
  return regex.test(nombre) && nombre.length <= 15;
  }
  const validacionApellido = (apellido) => {
    const regex = /^[A-Z][a-zA-Z]{0,13}$/;
    return regex.test(apellido);
  }
  const validacionCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  }
  const validacionTelefono = (telefono) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(telefono);
  }
  const validacionEmpresa = (empresa) => {
    const regex = /^[A-Z][a-zA-Z]{0,20}$/;
    return regex.test(empresa);
  }
  /*const validacionFecha = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fecha);
  } */
  const validacionServicio = (servicio) => {
    const regex = /^[0-9]{1,3}$/;
    return regex.test(servicio);
  }
  const validacionCantidad = (cantidad) => {
    const regex = /^[0-9]{1,3}$/;
    return regex.test(cantidad);
  }
  const mostrarResumenServicios = (servicios) => {
    if (!servicios || servicios.length === 0) {
      addResponseMessage('No hay servicios agregados.');
      return;
    }
  
    const resumen = servicios.map((s, i) =>
      `${i + 1}. Servicio #${s.numero}, Cantidad: ${s.cantidad}`
    ).join('\n');
  
    addResponseMessage('Resumen de servicios 2:');
    addResponseMessage(resumen);
    addResponseMessage('Escribe "OK" para continuar:');
  };
  

  const enviarDatos = async () => {
    try {
      const today = new Date();
      const fechaSolicitud = today.toISOString().split('T')[0]; // formato YYYY-MM-DD

      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);
      const fechaCaducidad = futureDate.toISOString().split('T')[0];
      // Crear la pre-cotización principal
      const preCotizacion = await createPreCotizacion({
        nombreCliente: formData.nombre,
        apellidoCliente: formData.apellido,
        correo: formData.correo,
        denominacion:"MXN",
        //telefono: formData.telefono,
        nombreEmpresa: formData.empresa,
        fechaSolicitud:fechaSolicitud,
        fechaCaducidad:fechaCaducidad,
        descuento:0,
        iva:1,
        organizacion:7,
        tipoMoneda:1,
        estado: 8,
      });
      //console.log("Pre-cotización creada:", preCotizacion);
      // Aquí puedes obtener el ID de la pre-cotización creada
      const idPreCotizacion = preCotizacion.data.id; // Ajusta según tu respuesta
      //console.log("ID de la pre-cotización:", idPreCotizacion);
      //console.log("Servicios a agregar:", formData.servicios);
      // Crear los servicios asociados
      for (const servicio of formData.servicios) {
        console.log("Servicio a agregar:", servicio);
        //console.log("Servicio a agregar cantidad:", servicio.cantidad);
        //console.log("Servicio a agregar numero", servicio.numero);
        await createServicioPreCotizacion({
          descripcion: "Sin descripción",
          precio:0,
          cantidad:    Number(servicio.cantidad)  || 0,
          preCotizacion: idPreCotizacion,
          servicio:    Number(servicio.numero),
          
        });
      }
  
      addResponseMessage("✅ ¡Cotización enviada exitosamente!");
      //console.log("Datos enviados:", formData);
    } catch (error) {
      console.error("Error al enviar datos:", error);
      addResponseMessage("❌ Hubo un error al enviar la cotización. Inténtalo de nuevo.");
    }
  };
        

  const handleNewUserMessage = (msg) => {
    if (campoAEditar !== null) {
      let valid = false;
      let nuevoFormData = { ...formData };
    
      switch (campoAEditar) {
        case 1:
          valid = validacionNombre(msg);
          if (valid) nuevoFormData.nombre = msg;
          break;
        case 2:
          valid = validacionApellido(msg);
          if (valid) nuevoFormData.apellido = msg;
          break;
        case 3:
          valid = validacionCorreo(msg);
          if (valid) nuevoFormData.correo = msg;
          break;
        case 4:
          valid = validacionTelefono(msg);
          if (valid) nuevoFormData.telefono = msg;
          break;
        case 5:
          valid = validacionEmpresa(msg);
          if (valid) nuevoFormData.empresa = msg;
          break;
          default:
            addResponseMessage('Opción no válida. Intenta de nuevo.');
            return;
      }
    
      if (!valid) {
        addResponseMessage('Dato inválido. Intenta de nuevo:');
        return;
      }
    
      setFormData(nuevoFormData);
      setCampoAEditar(null); // salimos del modo edición
    
      const resumen = `
    1. Nombre: ${nuevoFormData.nombre}
    2. Apellido: ${nuevoFormData.apellido}
    3. Correo: ${nuevoFormData.correo}
    4. Teléfono: ${nuevoFormData.telefono}
    5. Empresa: ${nuevoFormData.empresa}
      `;
      addResponseMessage('¡Dato actualizado!');
      addResponseMessage('Resumen actualizado:');
      addResponseMessage(resumen);
      addResponseMessage('¿Deseas editar otro dato? Escribe el número o "no" para continuar.');
    
      return;
    }
    
    switch (step) {
      case 0:
        if (!validacionNombre(msg)) {
          addResponseMessage('Por favor, ingresa un nombre válido (inicia con mayúscula y máximo 12 letras).');
          addResponseMessage("¿Cuál es tu nombre?");
          return;
        }
        setFormData({ ...formData, nombre: msg });
        addResponseMessage('¿Cuál es tu apellido paterno?');
        setStep(1);
        break;
      case 1:
        if(!validacionApellido(msg)) {
          addResponseMessage('Por favor, ingresa un apellido válido (inicia con mayúscula y máximo 13 letras).');
          addResponseMessage('¿Cuál es tu apellido paterno?');
          return;
        }
        setFormData({ ...formData, apellido: msg });
        addResponseMessage('¿Cuál es tu correo electrónico?');
        setStep(2);
        break;
      case 2:
        if (!validacionCorreo(msg)) {
          addResponseMessage('Por favor, ingresa un correo electrónico válido.');
          addResponseMessage('¿Cuál es tu correo electrónico?');
          return;
        }
        setFormData({ ...formData, correo: msg });
        addResponseMessage('¿Cuál es tu número telefónico?');
        setStep(3);
        break;
      case 3:
        if (!validacionTelefono(msg)) {
          addResponseMessage('Por favor, ingresa un número telefónico válido (10 dígitos).');
          addResponseMessage('¿Cuál es tu número telefónico?');
          return;
        }
        setFormData({ ...formData, telefono: msg });
        addResponseMessage('¿Cuál es el nombre de la empresa?');
        setStep(4);
        break;
      case 4:
        if (!validacionEmpresa(msg)) {
          addResponseMessage('Por favor, ingresa un nombre de empresa válido (inicia con mayúscula y máximo 20 letras).');
          addResponseMessage('¿Cuál es el nombre de la empresa?');
          return;
        }
        const nuevoFormData = { ...formData, empresa: msg };
        setFormData(nuevoFormData);
        addResponseMessage('¡Gracias por completar el formulario!');
          console.log('Datos finales del formulario:', formData);
      
          // Mostrar resumen para edición
          const resumen = `
      1. Nombre: ${nuevoFormData.nombre}
      2. Apellido: ${nuevoFormData.apellido}
      3. Correo: ${nuevoFormData.correo}
      4. Teléfono: ${nuevoFormData.telefono}
      5. Empresa: ${nuevoFormData.empresa}
          `;
          addResponseMessage('¿Deseas editar algún dato antes de enviar? Escribe el número del campo que deseas editar o "no" para continuar.');
          addResponseMessage(resumen);
          setStep(111);
        //addResponseMessage('Ahora comenzaras a agregar los servicios');
        //addResponseMessage('Escribe el número de servicio:');
        
        //setStep(6);
        break;
      case 5:
        if (!validacionEmpresa(msg)) {
          addResponseMessage('Por favor, ingresa un nombre de empresa válido (inicia con mayúscula y máximo 20 letras).');
          addResponseMessage('¿Cuál es el nombre de la empresa?');
          return;
        }
        //setFormData({ ...formData, empresa: msg });
         addResponseMessage('Ahora comenzaras a agregar los servicios');
        addResponseMessage('Escribe el número de servicio:');
    
        break;

      case 111:
        //console.log('Campo a editar msg:', msg);
        if (msg.toLowerCase() === 'no') {
          //enviarDatos();
          //addResponseMessage('Datos enviados correctamente. ¿Deseas crear otra cotización? (sí/no)');
          addResponseMessage('Ahora comenzaras a agregar los servicios');
          addResponseMessage('Escribe el número de servicio:');
          setStep(7);
        } else {
          const opcion = parseInt(msg);
          if (isNaN(opcion) || opcion < 1 || opcion > 5) {
            addResponseMessage('Por favor, escribe un número válido entre 1 y 5, o "no" para continuar.');
          } else {
            console.log('Campo a editar:', opcion);
            setCampoAEditar(opcion); // regresa al paso correspondiente
            console.log('Campo a editar:', campoAEditar);
            const preguntas = [
              '¿Cuál es tu nombre?',
              '¿Cuál es tu apellido paterno?',
              '¿Cuál es tu correo electrónico?',
              '¿Cuál es tu número telefónico?',
              '¿Cuál es el nombre de la empresa?'
            ];
            addResponseMessage(`Vamos a corregir el campo ${opcion}:`);
            addResponseMessage(preguntas[opcion -1]);

          }
        }
        //setStep(6);
        break;
      
      case 6:
        addResponseMessage('Ahora comenzaras a agregar los servicios');
        addResponseMessage('Escribe el número de servicio:');
        setStep(7);
        return;
        //break;
      case 7:
              // Entrada de varios números de servicio
        const numeros = msg.split(',').map(num => parseInt(num.trim())).filter(n => !isNaN(n));
        if (numeros.length === 0) {
          addResponseMessage('Por favor, ingresa al menos un número válido separado por comas.');
          return;
        }
        setServicioTemporal({ ...servicioTemporal, numeros }); // guarda varios
        addResponseMessage('¿Cuántos necesita de cada uno? Ingresa las cantidades separadas por comas en el mismo orden.');
        console.log('Paso actual:', step);

        setStep(8);
        console.log('Paso actual:', step);

        break;
      case 8:
        // Entrada de varias cantidades
        const cantidades = msg.split(',').map(c => parseInt(c.trim())).filter(c => !isNaN(c));
        if (cantidades.length !== servicioTemporal.numeros.length) {
          addResponseMessage('El número de cantidades no coincide con el número de servicios. Intenta de nuevo.');
          return;
        }

        const nuevosServicios = servicioTemporal.numeros.map((numero, index) => ({
          numero,
          cantidad: cantidades[index]
        }));

        setFormData(prev => ({
          ...prev,
          servicios: [...prev.servicios, ...nuevosServicios]
        }));
        setServicioTemporal({ numeros: [] });
        addResponseMessage('¿Quieres agregar más servicios? (sí/no)');
        setStep(9);
        break;
        case 9:
          if (msg.toLowerCase() === 'sí' || msg.toLowerCase() === 'si') {
            if (formData.servicios.length === 0) {
              addResponseMessage('No hay servicios que editar.');
              addResponseMessage('¿Deseas agregar nuevos servicios? (sí/no)');
              setStep(6);
            } else {
              // Mostrar resumen solo si el usuario dijo "sí"
              /*let resumenServicios = formData.servicios.map((s, i) =>
                `${i + 1}. Servicio #${s.numero}, Cantidad: ${s.cantidad}`
              ).join('\n');
        
              addResponseMessage('Estos son los servicios agregados:');
              addResponseMessage(resumenServicios);
              addResponseMessage('¿Deseas editar alguno? Escribe el número del servicio en la lista o "no" para continuar.');
              setStep(91); */
            }
          } else if (msg.toLowerCase() === 'no') {
            // El usuario no quiere editar nada, pasa directo a enviar
            /*addResponseMessage('¡Gracias por completar el formulario!');
            enviarDatos();
            setStep(999);
            console.log('Datos finales del formulario:', formData);
            addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
            setStep(10); */
            let resumenServicios = formData.servicios.map((s, i) =>
              `${i + 1}. Servicio #${s.numero}, Cantidad: ${s.cantidad}`
            ).join('\n');
      
            addResponseMessage('Estos son los servicios agregados:');
            addResponseMessage(resumenServicios);
            addResponseMessage('¿Deseas editar alguno? Escribe el número del servicio en la lista o "no" para continuar.');
            setStep(91);
          } else {
            addResponseMessage('Por favor responde con "sí" o "no".');
          }
          break;
        

        case 91:
            if (msg.toLowerCase() === 'no') {
            enviarDatos();
            setStep(999);
            addResponseMessage('¡Cotización enviada!');
            addResponseMessage('¿Deseas crear otra cotización? (sí/no)');
            setStep(10);
            return;
            }

            const indice = parseInt(msg) - 1;
            if (!isNaN(indice) && formData.servicios[indice]) {
            setServicioAEditar(indice);
            addResponseMessage(`¿Qué deseas editar del servicio #${formData.servicios[indice].numero}? (escribe: número o cantidad )`);
            setStep(92);
            } else {
            addResponseMessage('Entrada no válida. Escribe el número del servicio a editar o "no" para continuar.');
            }
            break;

        case 92:
          const opcion = msg.toLowerCase();
          if (opcion === 'número' || opcion === 'numero') {
            addResponseMessage('Escribe el nuevo número del servicio:');
            setStep(93);
          } else if (opcion === 'cantidad') {
            addResponseMessage('Escribe la nueva cantidad del servicio:');
            setStep(94);
          } else if (opcion === 'ambos') {
            setPasoExtra('cantidad'); // variable temporal para saber que luego viene la cantidad
            addResponseMessage('Escribe el nuevo número del servicio:');
            setStep(93);
          } else {
            addResponseMessage('Opción no válida. Escribe: número, cantidad o ambos.');
          }
          
          break;
        case 93:
          const nuevoNumero = parseInt(msg);
          console.log('Nuevo número:', nuevoNumero);
          if (isNaN(nuevoNumero) || nuevoNumero <= 0) {
            addResponseMessage('Número inválido. Ingresa un número mayor a 0.');
            return;
          }
          console.log('Servicio a editar1:', servicioAEditar);
          if (
            servicioAEditar === null ||
            isNaN(servicioAEditar) ||
            servicioAEditar < 0 ||
            servicioAEditar >= formData.servicios.length
          ) {
            addResponseMessage('Error interno: no se pudo identificar el servicio a editar.');
            setStep(91); // volver a lista de servicios
            return;
          }
          console.log('Servicio a editar2:', servicioAEditar);
          const serviciosEditados = [...formData.servicios];
          serviciosEditados[servicioAEditar] = {
            ...serviciosEditados[servicioAEditar],
            numero: nuevoNumero,
          };
          console.log('Servicios editados3:', serviciosEditados);
          setFormData({ ...formData, servicios: serviciosEditados });
          console.log('Servicios editados4:', serviciosEditados);  
          if (pasoExtra === 'cantidad') {
            setPasoExtra(null);
            setStep(94);
            addResponseMessage('Escribe la nueva cantidad del servicio:');
          } else {
            setServicioAEditar(null);
            addResponseMessage('¡Servicio actualizado!1');
            mostrarResumenServicios(serviciosEditados);
            setStep(91);
          }

          break;
        
        case 94:
          const nuevaCantidad = parseInt(msg);
          if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            addResponseMessage('Cantidad inválida. Ingresa un número mayor a 0.');
            return;
          }

          const serviciosActualizados = [...formData.servicios];
          serviciosActualizados[servicioAEditar].cantidad = nuevaCantidad;
          setFormData({ ...formData, servicios: serviciosActualizados });

          setServicioAEditar(null);
          addResponseMessage('¡Cantidad actualizada!');
          mostrarResumenServicios(serviciosActualizados);
          setStep(91);

          break;

        
      case 10:
        if (msg.toLowerCase() === 'sí' || msg.toLowerCase() === 'si') {
          setFormData({
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            empresa: '',
            fechaSolicitud: '',
            fechaCaducidad: '',
            servicios: [],
          });
          setServicioActual({});
          addResponseMessage("Perfecto. ¿Cuál es tu nombre?");
          setStep(0);
        } else {
          addResponseMessage('¡Gracias por usar nuestro servicio!');
          setStep(999);
        }
        break;
      default:
        addResponseMessage('Ya hemos terminado. ¡Gracias!');
    }
  };

  return (
    <div className="App">
      <h1>Mi App con Chat</h1>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Chat De Cotizacion"
        subtitle="Estamos para ayudarte"
      />
    </div>
  );
}

export default App;
