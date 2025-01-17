import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import crearUsuario from '@salesforce/apex/PruebaUsuarioCRUD.crearUsuario';

export default class CrearUsuario extends LightningElement {
    @api isOpen = false; // Controla la visibilidad del modal
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

    nuevoUsuario() {
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

        if (!this.isValidEmail(this.email)) {
            // Si el valor no es un email válido, no guardar
            this.mostrarMensaje('El email no es valido', 'error');
            return;
        }

        const usuario = {
            name: this.name,
            username: this.username,
            email: this.email,
            phone: this.phone,
        };

        const address = {
            street: this.street,
            suite: this.suite,
            city: this.city,
            zipcode: this.zipcode,
        };

        crearUsuario({ usuario, address })
            .then(() => {
                this.name = '';
                this.username = '';
                this.email = '';
                this.phone = '';
                this.street = '';
                this.suite = '';
                this.city = '';
                this.zipcode = '';
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