import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import obtenerUsuarios from '@salesforce/apex/PruebaUsuarioCRUD.obtenerUsuarios';
import eliminarSeleccionados from '@salesforce/apex/PruebaUsuarioCRUD.eliminarSeleccionados';

export default class TablaUsuarios extends LightningElement {

    @track usuariosEncontrados = [];
    @track usuariosAMostrar = [];
    @track paginaActual = 1;
    @track totalPaginas = 1;
    @track isModalOpenCreacion = false;
    @track isModalOpenEdicion = false;
    @track usuario = {};
    @track filasSeleccionadas = [];
    @track palabraFiltro = '';
    rowsNumero = 5;

    // Carga inicial de los datos
    connectedCallback() {
        console.log('Componente inicializado. Intentando cargar cuentas...');
        this.obtenerUsuarios();
    }

    // Boton de editar
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'editar') {
            // Modal de edicion apertura
            this.usuarioSeleccionado = { ...row };
            console.log(JSON.stringify(this.usuarioSeleccionado));
            // Convertir string a objeto
            this.usuario = JSON.parse(JSON.stringify(this.usuarioSeleccionado));
            this.isModalOpenEdicion = true;
            console.log(`\n Id: ${this.usuario.Id} Nombre: ${this.usuario.Name}`);
        }
    }

    // Modal de edicion cierre
    handleCloseModalEdicion() {
        this.isModalOpenEdicion = false;
    }

    // Modal de edicion mensajes
    handleSuccessEditado() {
        this.isModalOpenEdicion = false;
        this.cambioRealizado('Guardado!', 'Usuario editado exitosamente', 'success');
    }

    handleErrorEditado(event) {
        const error = event.detail;
        this.cambioRealizado('Error', 'Error al guardar el usuario: ' + error.body.message, 'error');
    }

    // Modal de creacion apertura
    openModalCreacion() {
        this.isModalOpenCreacion = true;
    }

    // Modal de creacion cierre
    handleCloseModalCreacion() {
        this.isModalOpenCreacion = false;
    }

    // Modal de creacion mensajes
    handleSuccessCreado() {
        this.isModalOpenCreacion = false;
        this.cambioRealizado('Usuario creado!', 'Usuario creado exitosamente', 'success');
    }

    handleErrorCreado(event) {
        const error = event.detail;
        this.cambioRealizado('Error', 'Error al crear el usuario: ' + error.body.message, 'error');
    }

    // Cuando se insertan registros mock
    handleInsertado() {
        this.cambioRealizado('Usuarios insertados!', 'Usuarios mock cargados desde API', 'success');
    }

    // Cuando se eliminan todos los registros
    handleEliminado() {
        this.cambioRealizado('Usuarios eliminados!', 'Se han eliminado todos los usuarios', 'warning');
    }

    // Columnas de la tabla
    columnas = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Username', fieldName: 'Username__c', type: 'text' },
        { label: 'Email', fieldName: 'Email__c', type: 'email' },
        { label: 'Adress', fieldName: 'fullAddress', type: 'text'  },
        { label: 'Phone', fieldName: 'Phone__c', type: 'phone'  },
        {
            type: 'button',
            typeAttributes: {
                label: 'Editar',
                name: 'editar',
                variant: 'brand',
                iconName: 'utility:edit',
                class: 'slds-button_margin-left-small'
            }
        }
    ];

    async obtenerUsuarios() {
        this.usuariosEncontrados = [];
        this.usuariosAMostrar = [];
        this.paginaActual = 1;
        this.totalPaginas = 1;
        this.usuario = {};
        try {
            const result = await obtenerUsuarios();
            this.usuariosEncontrados = result;
            console.log('Se obtienen usuarios: ', JSON.stringify(this.usuariosEncontrados));
            this.updateUsuariosAMostrar();
            this.error = undefined;
        } catch (error) {
            this.error = error;
            this.usuariosEncontrados = [];
            this.cambioRealizado('Error', 'Error al cargar los registros', 'error');
            console.error('Error al obtener usuarios: ', error);
        }
    }    

    // Actualiza tabla por filtro
    handlePalabraFiltro(event) {
        this.palabraFiltro = event.target.value.toLowerCase();
        this.filasSeleccionadas = [];
        this.updateUsuariosAMostrar();
    }

    // Actualizar tabla
    updateUsuariosAMostrar() {
        this.filasSeleccionadas = [];
        const indexInicio = (this.paginaActual - 1) * this.rowsNumero;
        const indexFin = indexInicio + this.rowsNumero;
        let usuariosFiltrados = this.usuariosEncontrados;

        if (this.palabraFiltro !== '') {
            usuariosFiltrados = this.usuariosEncontrados.filter(usuarioEncontrado =>
                usuarioEncontrado.Name.toLowerCase().includes(this.palabraFiltro)
            );
        }

        this.totalPaginas = Math.ceil(usuariosFiltrados.length / this.rowsNumero);
        this.esPrimeraPagina = this.paginaActual === 1;
        this.esUltimaPagina = this.paginaActual === this.totalPaginas;
        const usuariosTemp = usuariosFiltrados.slice(indexInicio, indexFin);
        // Map fullAddress 
        this.usuariosAMostrar = usuariosTemp.map(objeto => ({
            ...objeto,               // Copia todas las propiedades del objeto original
            fullAddress: `${objeto.Adress__Street__s || ''}, ${objeto.Suite__c || ''}, ${objeto.Adress__City__s || ''}, ${objeto.Adress__PostalCode__s || ''}`
        }));

        console.log('Usuarios a mostrar: ', JSON.stringify(this.usuariosAMostrar));

    }

    // Handle paginacion
    handleAnterior() {
        if (this.paginaActual > 1) {
            this.paginaActual--;
            this.filasSeleccionadas = [];
            this.updateUsuariosAMostrar();
        }
    }

    // Handle para boton siguiente
    handleSiguiente() {
        if (this.paginaActual < this.totalPaginas) {
            this.paginaActual++;
            this.filasSeleccionadas = [];
            this.updateUsuariosAMostrar();
        }
    }

    // Handle selección de filas
    handleSeleccion(evento) {
        this.filasSeleccionadas = evento.detail.selectedRows;
        console.log('Filas seleccionadas: ', JSON.stringify(this.filasSeleccionadas));
    }

    // Handle boton eliminación de registros seleccionados
    handleSeleccionados() {
        if (this.filasSeleccionadas.length > 0) {
            eliminarSeleccionados({ seleccionados: this.filasSeleccionadas })
                .then(result => {
                    // Convertir string a objeto
                    const jsonObject = JSON.parse(JSON.stringify(this.filasSeleccionadas));
                    const listaEliminados = jsonObject.map(record => `\n Id: ${record.Id} Nombre: ${record.Name}`);
                    console.log('Usuarios eliminados: ', listaEliminados.toString());
                    this.cambioRealizado('Seleccion eliminada!', 'Los usuarios seleccionados se han eliminado', 'success');
                    // Recargar tabla
                    this.obtenerUsuarios();
                })
                .catch(error => {
                    console.error('Error al eliminar los registros', error);
                    this.cambioRealizado('Error', 'Error al eliminar los registros', 'error');
                });
        }
    }

    // Notificacion de cambio realizado
    cambioRealizado(titulo, mensaje, variante) {
        const notificar = new ShowToastEvent({
          title: titulo,
          message: mensaje,
          variant: variante,
        });
        this.dispatchEvent(notificar);
        // Recargar tabla
        this.obtenerUsuarios();
    }

}