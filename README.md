# CRUD en Salesforce con LWC y Apex

Ejemplo mínimo y completo de un CRUD en Salesforce: cuatro Lightning Web
Components que crean, consultan, editan y borran registros, contra una clase
Apex con sus pruebas.

| Componente | Qué hace |
|---|---|
| `crearUsuario` | Formulario de alta, valida y llama a Apex |
| `editarUsuario` | Carga un registro y guarda los cambios |
| `eliminarTodo` | Borrado masivo con confirmación |
| `PruebaUsuarioCRUD.cls` | La clase Apex y sus pruebas unitarias |

Cada componente lleva su carpeta `__tests__` con pruebas de Jest, que es la
parte que casi nunca se enseña en los ejemplos de CRUD.

## Correr

```bash
sf org create scratch -f config/project-scratch-def.json -a crud
sf project deploy start -o crud
sf org open -o crud
npm test          # las pruebas de los LWC
```

## Para qué sirve

Es la plantilla de referencia que uso al empezar cualquier cosa en
Salesforce: la estructura de carpetas de SFDX, el trato entre LWC y Apex,
los metadatos y las pruebas en su sitio.

---

Hecho por [Adrián Ceja Rentería](https://ayotl.dev/acerca) · [ayotl.dev](https://ayotl.dev)
