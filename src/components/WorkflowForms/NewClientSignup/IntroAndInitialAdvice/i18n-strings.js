import LocalizedStrings from "react-localization";
import mva_utils from "../../../../utilities/functions.jsx";
import global_strings from "../../../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Introduction and Initial Advice",
        buttonNext: "Next",
        advicePoints: [
            "The first thing we are going to do is get the police report to find out who the insurance company is for the person at fault",
            "Then we are going to send the insurance company a Letter of representation (Meaning that we send the letter to the insurance company letting them know that we are the attorney for your case)",
            "We are then going to find out who is the adjuster for your case and the adjuster for the property damage, because these are separate individuals and separate settlements.",
            "We want you to keep track of any changes that occur with your body, for example: when you wash your hair, you can't move your arm easily, you can't have sex because of the pain on your back, you can't lift your child because something hurts. This will help us to describe what you went thru after the accident and it gives value to the Letter that we send asking for a settlement",
            "Explain that if they miss work because they have pain, it has to be excused by the doctor. If it is not excused by the doctor the insurance company will not pay any lost wages.",
            "It's important for you to get your car out of the impound lot, because they charge you per day and they take that out of the property damage settlement, this means less money for you to fix your car or for you to buy a new car.",
            "Use your health insurance when possible, we will negotiate with them to the lowest amount, so that you can get a better settlement.",
            "Do not miss appointments, the insurance companies look for any reason to not pay you and if you don't attend the appointments they can say that you were not hurting enough and lower your settlement",
            "After you are done with your treatment, we will gather all of your medical records, it is VITAL for you to inform us of every single doctor, treatment, medication that you get, we only are able to put into the demand letter what is provided to us. After the settlement occurs, we can not change the settlement because you found a new bill and that bill will be your responsibility.",
            "Do not accept any insurance calls, but to instead refer such calls to the firm. Unless, the property damage adjuster calls you. Do not talk about your physical injuries with him or anyone in the insurance company.",
            "Inform him/her to get the car out of impound lot, because they charge a lot.",
            "When we have gathered all of the medical bills, your diary and documentation we will send the demand letter to the adjuster. They have 30 days to review the demand and then give us an offer."
        ]
    },
    "es": {
        title: "Introducción y Asesoramiento Inicial",
        buttonNext: "Siguiente",
        advicePoints: [
            "Lo primero que haremos es obtener el informe policial para averiguar quién es la compañía de seguros de la persona culpable.",
            "Luego enviaremos a la compañía de seguros una Carta de Representación (lo que significa que enviamos la carta a la compañía de seguros informándoles que somos los abogados de su caso).",
            "Luego averiguaremos quién es el ajustador para su caso y el ajustador para el daño a la propiedad, porque son individuos separados y acuerdos separados.",
            "Queremos que lleve un registro de cualquier cambio que ocurra en su cuerpo, por ejemplo: cuando se lava el cabello, no puede mover el brazo fácilmente, no puede tener relaciones sexuales por el dolor de espalda, no puede levantar a su hijo porque algo le duele. Esto nos ayudará a describir por lo que pasó después del accidente y le da valor a la Carta que enviamos solicitando un acuerdo.",
            "Explicar que si faltan al trabajo porque tienen dolor, debe ser justificado por el médico. Si no está justificado por el médico, la compañía de seguros no pagará ningún salario perdido.",
            "Es importante que saque su automóvil del depósito de vehículos confiscados, porque le cobran por día y eso lo deducen del acuerdo por daños a la propiedad, lo que significa menos dinero para que usted arregle su automóvil o compre uno nuevo.",
            "Use su seguro de salud cuando sea posible, negociaremos con ellos la cantidad más baja, para que pueda obtener un mejor acuerdo.",
            "No falte a las citas, las compañías de seguros buscan cualquier motivo para no pagarle y si no asiste a las citas pueden decir que no estaba lo suficientemente adolorido y reducir su acuerdo.",
            "Una vez que termine su tratamiento, recopilaremos todos sus registros médicos, es VITAL que nos informe de cada médico, tratamiento, medicamento que reciba, solo podemos incluir en la carta de demanda lo que se nos proporciona. Después de que ocurra el acuerdo, no podemos cambiarlo porque encontró una nueva factura y esa factura será su responsabilidad.",
            "No acepte ninguna llamada de seguros, sino remita dichas llamadas a la firma. A menos que le llame el ajustador de daños a la propiedad. No hable sobre sus lesiones físicas con él ni con nadie de la compañía de seguros.",
            "Infórmele que saque el coche del depósito, porque cobran mucho.",
            "Cuando hayamos recopilado todas las facturas médicas, su diario y documentación, enviaremos la carta de demanda al ajustador. Tienen 30 días para revisar la demanda y luego darnos una oferta."
        ]
    }
};

const merged = mva_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;