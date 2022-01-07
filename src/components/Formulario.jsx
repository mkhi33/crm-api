import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup';
import Alerta from './Alerta';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const Formulario = ({cliente, cargando}) => {

    const navigate = useNavigate()

    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
                    .min(3, 'El nombre es muy corto')
                    .max(20, 'El nombre es muy largo')
                    .required('El nombre del cliente es obligatorio'),
        empresa: Yup.string()
                    .required('El nombre de la empresa es obligatorio')
        ,
        email:  Yup.string()
                        .email('Email no válido')
                        .required('El email es obligatorio')
        ,
        telefono:Yup.number()
                        .integer('Número no válido')
                        .positive('Número no válido')
                        .typeError('El número no es válido')
        ,                       
        notas:''       
    })
    const handleSubmit = async (valores) => {
        try {
            let contenido;
            let respuesta;
            if(cliente.id){
                // Editando un registro
                contenido = {
                    method: 'PUT',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type' : 'application/json'
    
                    }
                }
                const url =`${import.meta.env.VITE_API_URL}/${cliente.id}`
                respuesta = await fetch(url, contenido)


            }else{
                //Nuevo registro
                contenido = {
                    method: 'POST',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type' : 'application/json'
    
                    }
                }
                const url =import.meta.env.VITE_API_URL
                respuesta = await fetch(url, contenido)

            }
            const resultado = await respuesta.json();
            navigate('/clientes')
        } catch (error) {
            console.log(error)
        }

    }

    return (
        cargando ? <Spinner /> :(
        <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
            <h1 className='text-gray-600 font-bold text-xl uppercase  text-center'>{cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}</h1>
            <Formik
                initialValues={{
                    nombre:cliente?.nombre ?? '',
                    empresa:cliente?.empresa ?? '',
                    email: cliente?.email ?? '',
                    telefono: cliente?.telefono ?? '',
                    notas: cliente?.notas ?? ''
                }}
                enableReinitialize={true}
                onSubmit={ async (values, {resetForm}) => {
                    await handleSubmit(values)
                    resetForm()
                }}
                validationSchema={nuevoClienteSchema}
            
            >

                { ({errors, touched}) => (

                    <Form
                        className='mt-10'
                    >
                        
                        <div className='mb-4'>
                            <label 
                                className='text-gray-800'    
                                htmlFor="nombre"
                            >Nombre</label>

                            <Field
                                id='nombre'
                                className="mt-2 block w-full p-3 bg-gray-50"
                                type="text" 
                                placeholder='Nombre Del Cliente'
                                name="nombre"
                            />
                            {errors.nombre && touched.nombre 
                            ?
                                <Alerta>{errors.nombre}</Alerta>
                            : null
                            }
                        </div>
                        <div className='mb-4'>
                            <label 
                                htmlFor="empresa"
                                className='text-gray-800'    
                            >Empresa:</label>
                            <Field
                                id="empresa"
                                className="mt-2 block w-full p-3 bg-gray-50"
                                type="text"
                                placeholder="Empresa Del Cliente"
                                name="empresa"
                            />
                            {errors.empresa && touched.empresa 
                            ?
                                <Alerta>{errors.empresa}</Alerta>
                            : null
                            }
                        </div>
                        <div className='mb-4'>
                            <label 
                                htmlFor="email"
                                className='text-gray-800'    
                            >E-mail:</label>
                            <Field
                                id="email"
                                className="mt-2 block w-full p-3 bg-gray-50"
                                type="email"
                                placeholder="Email Del Cliente"
                                name="email"
                            />
                            {errors.email && touched.email 
                            ?
                                <Alerta>{errors.email}</Alerta>
                            : null
                            }
                        </div>
                        <div className='mb-4'>
                            <label 
                                htmlFor="telefono"
                                className='text-gray-800'    
                            >Teléfono:</label>
                            <Field
                                id="telefono"
                                className="mt-2 block w-full p-3 bg-gray-50"
                                type="tel"
                                placeholder="Teléfono Del Cliente"
                                name="telefono"
                            />
                            {errors.telefono && touched.telefono 
                            ?
                                <Alerta>{errors.telefono}</Alerta>
                            : null
                            }
                        </div>
                        <div className='mb-4'>
                            <label 
                                htmlFor="notas"
                                className='text-gray-800'    
                            >Notas:</label>
                            <Field
                                id="notas"
                                as="textarea"
                                className="mt-2 block w-full p-3 bg-gray-50 h-40"
                                type="text"
                                placeholder="Notas Del Cliente"
                                name="notas"
                            />

                        </div>
                        <input 
                            type="submit"
                            value={cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
                            className='mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg'
                        />
                    </Form>
                )}
            </Formik>
        </div>
        )
    )
}

Formulario.defaultProps = {
    cliente: {},
    cargando:false
}

export default Formulario
