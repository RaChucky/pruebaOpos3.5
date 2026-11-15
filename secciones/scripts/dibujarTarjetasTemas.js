(() => {
    const contenedorGlobal = document.getElementById('lista-temas');

    function renderizarTemas() {
        contenedorGlobal.innerHTML = '';

        // 1. Creamos la barra del índice flotante arriba
        const navIndice = document.createElement('div');
        navIndice.className = 'indice-alfabetico'; 
        contenedorGlobal.appendChild(navIndice);

        // 2. Creamos el contenedor ÚNICO de columnas para que todas las tarjetas estén juntas
        const contenedorColumnas = document.createElement('div');
        contenedorColumnas.className = 'bloque-columnas-alfabetico';
        contenedorGlobal.appendChild(contenedorColumnas);

        // Función auxiliar para extraer el número del título
        const obtenerNumeroTema = (texto) => {
            const coincidencia = texto.match(/\d+/);
            return coincidencia ? parseInt(coincidencia, 10) : 0;
        };

        // 3. Ordenamos todos los temas numéricamente de menor a mayor
        listadoTemas.sort((a, b) => obtenerNumeroTema(a.titulo) - obtenerNumeroTema(b.titulo));

        // 4. Recorremos los datos para dibujar el menú y las tarjetas juntas
        listadoTemas.forEach(tema => {
            const numeroActual = obtenerNumeroTema(tema.titulo);
            const idTarjeta = `tarjeta-tema-${numeroActual}`;

            // Creamos el botón del índice para esta tarjeta concreta
            const enlaceTema = document.createElement('a');
            enlaceTema.href = `#${idTarjeta}`;
            enlaceTema.textContent = numeroActual;
            enlaceTema.className = 'enlace-indice';
            navIndice.appendChild(enlaceTema);

            // Creamos la tarjeta del tema
            const div = document.createElement('div');
            div.className = 'item-tema';
            div.id = idTarjeta;
            div.style.cursor = 'pointer';
            
            // Separamos "Tema X" del resto del nombre del tema
            const partesTitulo = tema.titulo.split(':');
            const etiquetaTema = partesTitulo[0].trim();
            const nombreTema = partesTitulo[1] ? partesTitulo[1].trim() : '';

            // Construcción del HTML base de la tarjeta (con o sin imagen)
            let contenidoHTML = '';

            if (tema.imagen) {
                contenidoHTML += `
                    <div class="tarjeta-media">
                        <img src="${tema.imagen}" alt="${nombreTema}" class="tarjeta-imagen" loading="lazy">
                        <span class="etiqueta-tema etiqueta-sobre-imagen">${etiquetaTema}</span>
                    </div>
                `;
            } else {
                contenidoHTML += `<span class="etiqueta-tema">${etiquetaTema}</span>`;
            }

            contenidoHTML += `
                <dt>${nombreTema}</dt>
                <dd>${tema.definicion}</dd>
            `;

            // Renderizado dinámico de los botones de enlaces si existen
            if (tema.enlaces && Array.isArray(tema.enlaces) && tema.enlaces.length > 0) {
                // Filtramos solo los enlaces que tengan una URL rellena
                const enlacesActivos = tema.enlaces.filter(enlace => enlace.url && enlace.url.trim() !== '');

                if (enlacesActivos.length > 0) {
                    contenidoHTML += `<div class="contenedor-botones-tarjeta">`;
                    enlacesActivos.forEach(enlace => {
                        // Si es un enlace interno de secciones (ej: "../secciones/test/t_rep_11.html")
                        if (enlace.url.includes('secciones/')) {
                            // Extraemos "test/t_rep_11" para pasárselo a cargarSeccion()
                            const rutaSeccion = enlace.url.split('secciones/')[1].replace('.html', '');
                            contenidoHTML += `
                                <a href="#" class="boton-tarjeta" data-seccion="${rutaSeccion}">
                                    ${enlace.texto}
                                </a>`;
                        } else {
                            // Si es una web externa (http...), la abre en pestaña nueva
                            contenidoHTML += `
                                <a href="${enlace.url}" target="_blank" rel="noopener noreferrer" class="boton-tarjeta">
                                    ${enlace.texto}
                                </a>`;
                        }
                    });
                    contenidoHTML += `</div>`;
                }
            }

    
            div.innerHTML = contenidoHTML;

            // Modificamos el evento click para evitar conflictos al pulsar los botones internos
            div.addEventListener('click', (evento) => {
                // Si el usuario hace clic específicamente en uno de los botones inferiores,
                // permitimos que el enlace funcione normalmente sin forzar el hash en la tarjeta.
                if (!evento.target.closest('.boton-tarjeta')) {
                    window.location.hash = idTarjeta;
                }
            });
            
            contenedorColumnas.appendChild(div);
        });
    }

    // Inicializamos la sección
    renderizarTemas();

})();