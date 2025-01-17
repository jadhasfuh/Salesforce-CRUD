import { LightningElement, wire } from 'lwc';
import eliminarTodo from '@salesforce/apex/PruebaUsuarioCRUD.eliminarTodo';

export default class Crear extends LightningElement {

    async handleEliminarTodo() {

        try {


             // Llama al método Apex para eliminar los registros
             await eliminarTodo();
             console.log('Todos los registros han sido eliminados.');
 
             // Emite el evento de eliminación
             const eliminado = new CustomEvent('eliminado', {
                 detail: { message: 'Todos los registros han sido eliminados.' }
             });
             this.dispatchEvent(eliminado);

        } catch (error) {

            console.log(`Error: ${error.message}`);

        }
    }

}