/**
 * Procesa y envía respuestas HTTP estandarizadas basadas en el resultado de las operaciones de la base de datos o las operaciones del servidor.
 * Este método maneja tanto errores como datos exitosos, formateando la respuesta adecuada.
 *
 * @param {Object} res - El objeto de respuesta Express que se utiliza para enviar la respuesta al cliente.
 * @param {Object} err - El objeto de error que puede haber sido generado durante la operación.
 * @param {Object} data - Los datos resultantes de la operación, que pueden incluir detalles de la operación como filas afectadas.
 *                        Si no hay error y la operación fue exitosa, estos datos se serializarán y enviarán.
 */
export function handleResponse(res, err, data = null) {
    if (err) {
        console.error("Error al procesar la solicitud:", err);

        switch (err.code) {
            case 'ER_DUP_ENTRY':
                res.status(409).json({ error: true, message: "Entrada duplicada, por favor verifica tus datos." });
                break;
            case 'ER_BAD_DB_ERROR':
                res.status(500).json({ error: true, message: "Problemas de conexión con la base de datos." });
                break;
            case 'AUTH_REQUIRED':
                res.status(403).json({ error: true, message: "No autorizado." });
                break;
            default:
                res.status(500).json({ error: true, message: err.message || "Error desconocido." });
        }
    } else if (data && data.affectedRows === 0) {
        res.status(404).json({ error: true, message: "El registro solicitado no fue encontrado o no se modificó." });
    } else {
        const serializedData = serializeData(data);
        res.status(200).json({ error: false, data: serializedData });
    }
}

/**
 * Serializa los datos proporcionados antes de enviarlos como respuesta HTTP. 
 * Este proceso incluye la conversión de estructuras de datos complejas en formatos adecuados para la transmisión HTTP.
 * Si los datos son un array, se serializará cada elemento del array. Si no, se serializará el único objeto de datos.
 *
 * @param {Object|Array} data - Los datos a serializar, que pueden ser un objeto único o un array de objetos.
 * @returns {Object|Array} - Los datos serializados, listos para ser enviados en una respuesta HTTP.
 */
function serializeData(data) {
    if (Array.isArray(data)) {
        return data.map(item => serializeItem(item));
    } else {
        return serializeItem(data);
    }
}

/**
 * Serializa un único elemento de datos, eliminando campos sensibles y convirtiendo formatos de datos específicos.
 * Por ejemplo, cualquier campo de fecha se convierte a ISO 8601, y campos sensibles como contraseñas o correos electrónicos son eliminados.
 *
 * @param {Object} item - El objeto de datos que se va a serializar.
 * @returns {Object} - El objeto serializado, con campos sensibles eliminados y formatos de datos ajustados si es necesario.
 */
function serializeItem(item) {
    ['password', 'email'].forEach(propiedad => {
        if (item.hasOwnProperty(propiedad)) {
            delete item[propiedad];
        }
    });

    if (item.hasOwnProperty('dateField') && item.dateField.toISOString) {
        item.dateField = item.dateField.toISOString();
    }
    return item;
}

/**
 * Valida que los campos especificados estén presentes y no sean nulos en el objeto proporcionado.
 *
 * Este método itera sobre una lista de nombres de campos esperados y verifica si cada uno de estos
 * campos existe y tiene un valor válido en el objeto dado. Un campo se considera inválido si no existe
 * o su valor es `undefined` o `null`. Este método es útil para asegurar que los datos de entrada en una
 * solicitud contengan todos los campos necesarios para procesarla correctamente.
 *
 * @param {Object} obj - El objeto que se va a validar.
 * @param {Array<string>} campos - Una lista de cadenas que representan los nombres de los campos que se deben validar en el objeto.
 * @returns {Array<string>} Una lista de mensajes de error para cada campo faltante o inválido. Si todos los campos son válidos, devuelve un array vacío.
 */
export function validateFields(obj, campos) {
    let errores = [];

    campos.forEach(campo => {
        if (obj[campo] === undefined || obj[campo] === null) {
            errores.push(`falta el campo ${campo}`);
        }
    });

    return errores;
}

/**
 * Valida que el identificador proporcionado sea un número válido y no esté vacío.
 *
 * Este método verifica que el identificador dado no sea nulo, indefinido, o una cadena vacía, y además asegura
 * que pueda convertirse a un número entero válido. Es útil para asegurar que los identificadores usados en operaciones
 * como búsquedas en bases de datos o manipulación de objetos cumplan con un formato adecuado para evitar errores en tiempo de ejecución.
 *
 * @param {*} id - El identificador a validar.
 * @returns {string|null} Devuelve un mensaje de error si el ID es inválido o no ha sido proporcionado, de lo contrario devuelve null.
 */
export function validateId(id) {
  const trimmedId = String(id).trim();

  if (!trimmedId || isNaN(Number(trimmedId))) {
    return 'ID inválido o no proporcionado.';
  }
  
  return null;
}

/**
 * Determina si el argumento proporcionado es una función.
 *
 * Este método evalúa si el parámetro dado es de tipo función. Utiliza el método `toString` del objeto global
 * para comparar el tipo del parámetro con la cadena '[object Function]', que es el identificador de tipo para las funciones
 * en JavaScript. Este método es útil para validaciones de tipo donde se necesita asegurar que una variable puede ser ejecutada como función.
 *
 * @param {*} functionToCheck - El objeto que se va a evaluar para determinar si es una función.
 * @returns {boolean} Devuelve `true` si el argumento es una función, de lo contrario devuelve `false`.
 */
export function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export const maskEmail = (email) => {
  const [user, domain] = email.split('@');
  const maskedUser = user[0] + user.slice(1).replace(/./g, '*');
  return `${maskedUser}@${domain}`;
};
