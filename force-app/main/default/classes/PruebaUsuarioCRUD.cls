public with sharing class PruebaUsuarioCRUD {
    
    @AuraEnabled
    public static void editarUsuario(Map<String, Object> usuario) {
        
        // Busca el registro existente
        String usuarioId = (String) usuario.get('id');
        Usuario_Prueba__c usuarioRegistro = [SELECT Id, Name, Username__c, Email__c, Phone__c, Adress__Street__s, Suite__c, Adress__City__s, Adress__PostalCode__s FROM Usuario_Prueba__c WHERE Id = :usuarioId];
        System.debug('Usuario entrante = ' + usuario);
        System.debug('Usuario encontrado = ' + usuarioRegistro);
        
        // Asignar los valores enviados solo si no están vacíos
        if (usuario.containsKey('name') && String.isNotBlank((String) usuario.get('name'))) {
            usuarioRegistro.Name = (String) usuario.get('name');
        }
        if (usuario.containsKey('username') && String.isNotBlank((String) usuario.get('username'))) {
            usuarioRegistro.Username__c = (String) usuario.get('username');
        }
        if (usuario.containsKey('email') && String.isNotBlank((String) usuario.get('email'))) {
            usuarioRegistro.Email__c = (String) usuario.get('email');
        }
        if (usuario.containsKey('phone') && String.isNotBlank((String) usuario.get('phone'))) {
            usuarioRegistro.Phone__c = (String) usuario.get('phone');
        }
        if (usuario.containsKey('street') && String.isNotBlank((String) usuario.get('street'))) {
            usuarioRegistro.Adress__Street__s = (String) usuario.get('street');
        }
        if (usuario.containsKey('suite') && String.isNotBlank((String) usuario.get('suite'))) {
            usuarioRegistro.Suite__c = (String) usuario.get('suite');
        }
        if (usuario.containsKey('city') && String.isNotBlank((String) usuario.get('city'))) {
            usuarioRegistro.Adress__City__s = (String) usuario.get('city');
        }
        if (usuario.containsKey('zipcode') && String.isNotBlank((String) usuario.get('zipcode'))) {
            usuarioRegistro.Adress__PostalCode__s = (String) usuario.get('zipcode');
        }
        
        System.debug('Usuario final = ' + usuarioRegistro);

        // Actualizar el registro solo si se ha modificado alguno de los campos
        update usuarioRegistro;

        System.debug('Usuario final = ' + usuarioRegistro);
    }
    
    
    
    @AuraEnabled
    public static void crearUsuario(Map<String, Object> usuario, Map<String, Object> address) {
        Usuario_Prueba__c nuevoUsuario = new Usuario_Prueba__c();
        nuevoUsuario.Name = (String) usuario.get('name');
        nuevoUsuario.Username__c = (String) usuario.get('username');
        nuevoUsuario.Email__c = (String) usuario.get('email');
        nuevoUsuario.Phone__c = (String) usuario.get('phone');
        nuevoUsuario.Adress__Street__s = (String) address.get('street');
        nuevoUsuario.Suite__c = (String) address.get('suite');
        nuevoUsuario.Adress__City__s = (String) address.get('city');
        nuevoUsuario.Adress__PostalCode__s = (String) address.get('zipcode');
        
        System.debug('Usuario creado = ' + nuevoUsuario);
        
        insert nuevoUsuario;
    }
    
    @AuraEnabled
    public static void eliminarSeleccionados(List<Usuario_Prueba__c> seleccionados) {
        try {
            delete seleccionados;
        } catch (Exception e) {
            throw new AuraHandledException('Error al eliminar los registros: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static List<Usuario_Prueba__c> obtenerUsuarios() {
        List<Usuario_Prueba__c> listaUsuarios = [SELECT Id, Name, Username__c, Email__c, Adress__Street__s, Suite__c, Adress__City__s, Adress__PostalCode__s, Phone__c FROM Usuario_Prueba__c];
        System.debug(listaUsuarios);
        return listaUsuarios;
    }
    
    @AuraEnabled
    public static void eliminarTodo() {
        try {
            List<Usuario_Prueba__c> listaUsuarios = [SELECT Id, Name, Username__c, Email__c, Adress__c, Phone__c FROM Usuario_Prueba__c];
            delete listaUsuarios;
        } catch (Exception e) {
            throw new AuraHandledException('Error al eliminar los datos: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static String insertarAPI(String usuarios){
        try {
            List<Usuario_Prueba__c> listaUsuarios = new List<Usuario_Prueba__c>();
            // Conversion de JSON a Lista de Objetos
            List<Object> listaObjetosUsuario = (List<Object>) JSON.deserializeUntyped(usuarios);
            // Conversion de Objetos a Mapas
            List<Map<String, Object>> listaUsuariosJSON = new List<Map<String, Object>>();
            for (Object objetoUsuario : listaObjetosUsuario) {
                listaUsuariosJSON.add((Map<String, Object>) objetoUsuario);
            }
            
            System.debug(listaUsuariosJSON);
            
            for (Map<String, Object> usuario : listaUsuariosJSON) {
                Usuario_Prueba__c nuevoUsuario = new Usuario_Prueba__c();
                nuevoUsuario.Name = (String) usuario.get('name');
                nuevoUsuario.Username__c = (String) usuario.get('username');
                nuevoUsuario.Email__c = (String) usuario.get('email');
                nuevoUsuario.Phone__c = (String) usuario.get('phone');
                
                // Address fields (optional, if you have fields for this in your custom object)
                Map<String, Object> address = (Map<String, Object>) usuario.get('address');
                if (address != null) {
                    nuevoUsuario.Adress__Street__s = (String) address.get('street');
                    nuevoUsuario.Suite__c = (String) address.get('suite');
                    nuevoUsuario.Adress__City__s = (String) address.get('city');
                    nuevoUsuario.Adress__PostalCode__s = (String) address.get('zipcode');
                }
                
                // Add to the list
                listaUsuarios.add(nuevoUsuario);
            }
            
            if (!listaUsuarios.isEmpty()) {
                insert listaUsuarios;
                return 'Usuarios creados de forma exitosa.';
            }else {
                return 'Error al conectar con API.';
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}