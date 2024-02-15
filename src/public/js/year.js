    // JavaScript para actualizar el año automáticamente
    const yearSpan = document.getElementById('copyright');
    const currentYear = new Date().getFullYear(); // Obtener el año actual
    yearSpan.textContent += currentYear; // Actualizar el texto con el año actual
