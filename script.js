// variable que lleva el conteo del último número atendido
let ultimoNumeroAtendido = 39
let consultorioLuis = "1"
let consultorioLucia = "2"

function generarNumero(ultimoNumeroAtendido) {
  if (ultimoNumeroAtendido <= 99) {
    ultimoNumeroAtendido++
    return numeroPaciente = ultimoNumeroAtentido
  } else {
    ultimoNumeroAtendido = 39
    return null
  }
}

function eleccionMedico(numeroPaciente) {
    if (numeroPaciente % 2 === 0) {
        return medico = "Luis Rodriguez"
      } else {
        return medico = "Lucia Perez"
      }
}

function eleccionConsultorio(numeroPaciente) {
    if (numeroPaciente % 2 === 0) {
        return consultorio = consultorioLuis
      } else {
        return consultorio = consultorioLucia
      }
}

do {
  alert('Bienvenido/a al sistema de atención al paciente.')
  let continuar = true

  while (continuar) {
    let opcion = prompt('Seleccione una opción:\n1 - Sacar número\n2 - Consultar número actual\n3 - Médico asignado\n4 - Consultorio asignado\n5 - Salir')

    if (opcion === '1') {
      ultimoNumeroAtendido++
      let numeroPaciente = ultimoNumeroAtendido
      let medico = eleccionMedico(numeroPaciente)
      let consultorio = eleccionConsultorio(numeroPaciente)

      if (numeroPaciente <= 99) {
        alert("Su número de paciente es: " + numeroPaciente + ". Su médico asignado es " + medico + " y su consultorio asignado es el " + consultorio + ".")
      } else {
        alert('El sistema se detendrá porque ya no hay más números disponibles.')
        continuar = false
      }

    } else if (opcion === '2') {
        alert("El número actual es: " + ultimoNumeroAtendido)    
    } 
    
    else if (opcion === '3') {
        let numeroPaciente = ultimoNumeroAtendido
        let medico = eleccionMedico(numeroPaciente)
        alert("Su médico asignado es " + medico)
    }
    
    else if (opcion === '4') {
        let numeroPaciente = ultimoNumeroAtendido
        let consultorio = eleccionConsultorio(numeroPaciente)
        alert("Su consultorio asignado es el " + consultorio)
    }
    
    else if (opcion === '5') {
        alert('Gracias por utilizar el sistema de atención al paciente.')
        continuar = false
    }
    
    else {
        alert('Opción inválida. Intente de nuevo.')
    }
  }
} while (confirm('¿Desea volver a utilizar el sistema de atención al paciente?'))
