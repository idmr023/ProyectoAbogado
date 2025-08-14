import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChatbotWidget } from './ChatbotWidget';

const TimelineItem = ({ evento }) => (
    <div className="relative pl-8 pb-4">
        <div className="absolute left-0 top-1 w-4 h-4 bg-teal-400 rounded-full border-4 border-gray-900"></div>
        <div className="pl-4">
            <p className="text-sm text-gray-400">{new Date(evento.fecha_evento).toLocaleString()}</p>
            <p className="font-medium text-white">{evento.evento_descripcion}</p>
        </div>
    </div>
);

const DocumentoItem = ({ doc }) => (
    <a href={doc.url_almacenamiento} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700">
        <span>📄 {doc.nombre_archivo}</span>
        <span className="text-xs text-teal-400">Descargar</span>
    </a>
);

export function CasoDetallePage() {
    const { caso_id } = useParams();
    const [caso, setCaso] = useState(null);
    const [estaCargando, setEstaCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/casos/${caso_id}`)
            .then(response => {
                setCaso(response.data);
            })
            .catch(err => {
                console.error("Error al obtener detalle del caso:", err);
                setError("No se pudo cargar la información del caso.");
            })
            .finally(() => {
                setEstaCargando(false);
            });
    }, [caso_id]);

    if (estaCargando) return <div className="text-center p-10">Cargando detalles del caso...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!caso) return <div className="text-center p-10">Caso no encontrado.</div>;

    return (
        <div className="bg-[#17181A] min-h-screen p-6 text-white flex flex-col items-center gap-8">
            
            <div className="w-full max-w-5xl bg-gray-900 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold">{caso.caso_titulo}</h1>
                <p className="text-teal-400 font-mono">{caso.caso_id}</p>
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-400">Estado</p>
                        <p className="font-semibold text-lg">{caso.caso_estado}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Abogado Asignado</p>
                        <p className="font-semibold text-lg">{caso.nombre_abogado || 'No asignado'}</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Historial del Caso</h2>
                        <div className="relative border-l-2 border-gray-700 ml-2">
                            {caso.timeline && caso.timeline.length > 0 ? (
                                caso.timeline.map(evento => <TimelineItem key={evento.evento_id} evento={evento} />)
                            ) : <p className="pl-4 text-gray-500">No hay eventos registrados.</p>}
                        </div>
                    </div>
                    
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Documentos</h2>
                        <div className="space-y-3">
                           {caso.documentos && caso.documentos.length > 0 ? (
                                caso.documentos.map(doc => <DocumentoItem key={doc.doc_id} doc={doc} />)
                            ) : <p className="text-gray-500">No hay documentos adjuntos.</p>}
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: PANEL DE MANDO --- */}
                <div className="flex flex-col gap-8">
                    {/* --- Tarjeta para Subir Documentos --- */}
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Adjuntar Nuevo Documento</h2>
                        <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-700 rounded-lg">
                            <p className="text-gray-400 mb-4">Arrastra un archivo aquí o selecciónalo</p>
                            <input type="file" className="hidden" id="file-upload" />
                            <label 
                                htmlFor="file-upload" 
                                className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                            >
                                Seleccionar Archivo
                            </label>
                        </div>
                        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                            Subir Documento
                        </button>
                    </div>

                    {/* --- Tarjeta para Acciones Rápidas --- */}
                    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                        <div className="space-y-3">
                            <a 
                                // Asumimos que la API devuelve 'caso.abogado_telefono'
                                href={`https://wa.me/${caso.abogado_telefono}?text=Hola, te escribo sobre el caso ${caso.caso_id}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 text-lg bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                            >
                                <img src="https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-whatsapp-icon-png-image_6315990.png" alt="WhatsApp" className="w-6 h-6" />
                                Contactar a mi Abogado
                            </a>
                            
                            <a 
                                // Asumimos que la API devuelve 'caso.abogado_calendly'
                                href={caso.abogado_calendly_url}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 text-lg bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition"
                            >
                                🗓️ Agendar Reunión
                            </a>
                        </div>
                    </div>
                </div>

                <ChatbotWidget/>
            </div>
        </div>
    );
}