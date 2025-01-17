import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import editarUsuario from '@salesforce/apex/PruebaUsuarioCRUD.editarUsuario';

export default class EditarUsuario extends LightningElement {

    @api isOpen = false; // Controla la visibilidad del modal
    @api usuario = {}; // Carga info
    @track name = '';
    @track username = '';
    @track email = '';
    @track phone = '';
    @track street = '';
    @track suite = '';
    @track city = '';
    @track zipcode = '';

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    closeModal() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('close')); // Notifica al componente padre
    }

    modificarUsuario() {
        // Validar campos obligatorios
        const allInputs = this.template.querySelectorAll('lightning-input');
        let isValid = true;

        allInputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity(); // Muestra un mensaje de error si no es válido
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        if (this.email != '' && !this.isValidEmail(this.email)) {
            // Si el valor no es un email válido, no guardar
            this.mostrarMensaje('El email no es valido', 'error');
            return;
        }
        
        const usuarioEdicion = {
            id: this.usuario.Id,
            name: this.name,
            username: this.username,
            email: this.email,
            phone: this.phone,
            street: this.street,
            suite: this.suite,
            city: this.city,
            zipcode: this.zipcode,
        };

        console.log(`Datos: ${usuarioEdicion}`);
        console.log(`Datos: ${usuarioEdicion.name}`);

        editarUsuario({ usuario: usuarioEdicion})
            .then(() => {
                this.closeModal();
                this.dispatchEvent(new CustomEvent('success')); // Notifica al componente padre
            })
            .catch(error => {
                this.mostrarMensaje('Error al crear el usuario: ' + error.body.message, 'error');
            });
    }

    mostrarMensaje(message, variant) {
        const event = new ShowToastEvent({
            title: 'Resultado',
            message,
            variant,
        });
        this.dispatchEvent(event);
    }

    isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

}