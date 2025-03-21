const global_strings = Object.freeze({
    "en": {
        email: "email",
        username: "username",
        mobile_phone: "mobile phone",
        password: "password",
        update: "update",
        close: "close",
        cancel: "cancel",
        submit: "submit",
        first_name: "First name",
        last_name: "Last name",
        middle_name: "Middle name",
        yup: {
            is_required: "is required.",
            integer_type_error: "Please enter only numbers",
            min_integer: "Please enter your {0} digit phone number",
            email_invalid: "Invalid email address",
        },
        // i18n for zxcvbn password strength checker
        zxcvbn: {
            "Use a few words, avoid common phrases": "Use a few words, avoid common phrases",
            "No need for symbols, digits, or uppercase letters": "No need for symbols, digits, or uppercase letters",
            "Add another word or two. Uncommon words are better.": "Add another word or two. Uncommon words are better.",
            "Straight rows of keys are easy to guess": "Straight rows of keys are easy to guess",
            "Short keyboard patterns are easy to guess": "Short keyboard patterns are easy to guess",
            "Use a longer keyboard pattern with more turns": "Use a longer keyboard pattern with more turns",
            "Repeats like \"aaa\" are easy to guess": "Repeats like \"aaa\" are easy to guess",
            "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"": "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"",
            "Avoid repeated words and characters": "Avoid repeated words and characters",
            "Sequences like abc or 6543 are easy to guess": "Sequences like abc or 6543 are easy to guess",
            "Avoid sequences": "Avoid sequences",
            "Recent years are easy to guess": "Recent years are easy to guess",
            "Avoid recent years": "Avoid recent years",
            "Avoid years that are associated with you": "Avoid years that are associated with you",
            "Dates are often easy to guess": "Dates are often easy to guess",
            "Avoid dates and years that are associated with you": "Avoid dates and years that are associated with you",
            "This is a top-10 common password": "This is a top-10 common password",
            "This is a top-100 common password": "This is a top-100 common password",
            "This is a very common password": "This is a very common password",
            "This is similar to a commonly used password": "This is similar to a commonly used password",
            "A word by itself is easy to guess": "A word by itself is easy to guess",
            "Names and surnames by themselves are easy to guess": "Names and surnames by themselves are easy to guess",
            "Common names and surnames are easy to guess": "Common names and surnames are easy to guess",
            "Capitalization doesn't help very much": "Capitalization doesn't help very much",
            "All-uppercase is almost as easy to guess as all-lowercase": "All-uppercase is almost as easy to guess as all-lowercase",
            "Reversed words aren't much harder to guess": "Reversed words aren't much harder to guess",
            "Predictable substitutions like '@' instead of 'a' don't help very much": "Predictable substitutions like '@' instead of 'a' don't help very much",
            "very": "very",
            "weak": "weak",
            "medium": "medium",
            "strong": "strong"
        }
    },
    "es": {
        email: "email",
        username: "nombre de usuario",
        mobile_phone: "teléfono móvil",
        password: "contraseña",
        update: "actualizar",
        close: "cerrar",
        cancel: "cancelar",
        submit: "entregar",
        first_name: "nombre de pila",
        last_name: "apellido",
        middle_name: "segundo nombre",

        yup: {
            is_required: "se requiere.",
            integer_type_error: "Por favor ingrese solo números.",
            min_integer: "Por favor ingrese su número de teléfono de {0} dígitos.",
            email_invalid: "Dirección de correo electrónico no válida."
        },

        // i18n for zxcvbn
        zxcvbn: {
            "This password is not very strong.": "Esta contraseña no es muy segura.",
            "Use a few words, avoid common phrases": "Utilice pocas palabras, evite frases comunes",
            "No need for symbols, digits, or uppercase letters": "No se necesitan símbolos, dígitos ni letras mayúsculas",
            "Add another word or two. Uncommon words are better.": "Añade una o dos palabras más. Las palabras poco comunes son mejores.",
            "Straight rows of keys are easy to guess": "Las filas rectas de teclas son fáciles de adivinar",
            "Short keyboard patterns are easy to guess": "Los patrones de teclado cortos son fáciles de adivinar",
            "Use a longer keyboard pattern with more turns": "Utilice un patrón de teclado más largo con más vueltas",
            "Repeats like \"aaa\" are easy to guess": "Las repeticiones como \"aaa\" son fáciles de adivinar",
            "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"": "Las repeticiones como \"abcabcabc\" son un poco más difíciles de adivinar que \"abc\"",
            "Avoid repeated words and characters": "Evite palabras y caracteres repetidos.",
            "Sequences like abc or 6543 are easy to guess": "Secuencias como abc o 6543 son fáciles de adivinar",
            "Avoid sequences": "Evite secuencias",
            "Recent years are easy to guess": "Los últimos años son fáciles de adivinar.",
            "Avoid recent years": "Evite los últimos años",
            "Avoid years that are associated with you": "Evite los años que estén asociados con usted.",
            "Dates are often easy to guess": "Las fechas suelen ser fáciles de adivinar",
            "Avoid dates and years that are associated with you": "Evite fechas y años que estén asociados con usted",
            "This is a top-10 common password": "Esta es una de las 10 contraseñas más comunes",
            "This is a top-100 common password": "Esta es una de las 100 contraseñas más comunes",
            "This is a very common password": "Esta es una contraseña muy común.",
            "This is similar to a commonly used password": "Esto es similar a una contraseña de uso común.",
            "A word by itself is easy to guess": "Una palabra por sí sola es fácil de adivinar.",
            "Names and surnames by themselves are easy to guess": "Los nombres y apellidos por sí solos son fáciles de adivinar",
            "Common names and surnames are easy to guess": "Los nombres y apellidos comunes son fáciles de adivinar.",
            "Capitalization doesn't help very much": "Las mayúsculas no ayudan mucho",
            "All-uppercase is almost as easy to guess as all-lowercase": "Todo en mayúsculas es casi tan fácil de adivinar como en minúsculas",
            "Reversed words aren't much harder to guess": "Las palabras invertidas no son mucho más difíciles de adivinar",
            "Predictable substitutions like '@' instead of 'a' don't help very much": "Las sustituciones predecibles como '@' en lugar de 'a' no ayudan mucho",
            "very": "muy",
            "weak": "debil",
            "medium": "medio",
            "strong": "fuerte"
        }
    }
});

export default global_strings;