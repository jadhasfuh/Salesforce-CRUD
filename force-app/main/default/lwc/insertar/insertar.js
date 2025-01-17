import { LightningElement } from 'lwc';
import insertarAPI from '@salesforce/apex/PruebaUsuarioCRUD.insertarAPI';

export default class Insertar extends LightningElement {

    async handleObtenerUsuarios() {
        try {
            // Traer datos de la API
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Error al traer datos de la API.');
            }
            const users = await response.json();

            // Insertar mediante Apex
            await insertarAPI({ usuarios: JSON.stringify(users) });

            // Emite el evento de creacion
            const insertado = new CustomEvent('insertado', {
                detail: { message: 'Registros mock insertados.' }
            });
            this.dispatchEvent(insertado);

        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

}