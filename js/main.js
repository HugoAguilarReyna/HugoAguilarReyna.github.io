/*
* main.js
* Mastering Data Visualization with D3.js
*/

// Nueva variable de estado global: guarda el producto seleccionado (null por defecto)
let selectedProduct = null; 

// Función auxiliar para manejar el clic en cualquier gráfico (Donut, Bar, Bubble)
function handleProductClick(d) {
    // Maneja el formato de datos del Bar/Bubble (d.producto) vs. Donut (d.data.producto)
    const productClicked = d.producto || d.data.producto; 
    
    // Si el producto clickeado ya estaba seleccionado, se deselecciona (se resetea el filtro)
    // El usuario utiliza 1 para sí y 0 para no (Instrucción recordada: [2025-08-16] De ahora en adelante, diré 1 para sí y 0 para no.)
    if (selectedProduct === productClicked) {
        selectedProduct = null; 
    } else {
        selectedProduct = productClicked; // Seleccionar el nuevo producto
    }
    updateGraph(); // Vuelve a llamar a la función de actualización para repintar
}


// --- DIMENSIONES Y MARGENES (Gráfico 1: Barras) ---
const MARGIN = { LEFT: 120, RIGHT: 250, TOP: 50, BOTTOM: 130 };
const WIDTH = 700 - MARGIN.LEFT - 100;
const TOTAL_WIDTH_BAR = WIDTH + MARGIN.LEFT + MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM; 

// 1. CONFIGURACIÓN DEL SVG y GRUPO PRINCIPAL (Gráfico 1: Barras)
const svg = d3.select("#chart-area").append("svg")
      .attr("width", TOTAL_WIDTH_BAR) 
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM); 

const g = svg.append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// MODERNIZACIÓN: Definir un filtro SVG para la sombra (Drop Shadow)
const defs = svg.append("defs");
defs.append("filter")
    .attr("id", "dropshadow")
    .append("feDropShadow")
    .attr("dx", 1).attr("dy", 1).attr("stdDeviation", 1.5).attr("flood-opacity", 0.4); 

// Tooltip (sin cambios)
const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0).style("background-color", "white").style("border", "solid").style("border-width", "1px").style("border-radius", "5px").style("padding", "10px").style("position", "absolute");

// Preparar elementos de Ejes, Títulos (Gráfico de Barras)
const xAxisGroup = g.append("g").attr("class", "x axis").attr("transform", `translate(0, ${HEIGHT})`);
const yAxisGroup = g.append("g").attr("class", "y axis");
g.append("text").attr("class", "x axis-label").attr("x", WIDTH / 2).attr("y", HEIGHT + 50).attr("font-size", "22px").attr("text-anchor", "middle").text("Mes");
g.append("text").attr("class", "y axis-label").attr("x", - (HEIGHT / 2)).attr("y", -80).attr("font-size", "22px").attr("text-anchor", "middle").attr("transform", "rotate(-90)").text("Ventas (Unidades)"); 
g.append("text").attr("class", "title").attr("x", WIDTH / 2).attr("y", -20).attr("font-size", "20px").attr("text-anchor", "middle");
const legendBar = g.append("g").attr("transform", `translate(${WIDTH + 20}, 20)`); 


// --- DIMENSIONES Y MARGENES (Gráfico 2: Burbujas) ---
const BUBBLE_MARGIN = { LEFT: 120, RIGHT: 150, TOP: 50, BOTTOM: 100 };
const BUBBLE_TOTAL_HEIGHT = 550; 
const BUBBLE_TOTAL_WIDTH = 850; 
const BUBBLE_WIDTH = BUBBLE_TOTAL_WIDTH - BUBBLE_MARGIN.LEFT - BUBBLE_MARGIN.RIGHT; 
const BUBBLE_HEIGHT = BUBBLE_TOTAL_HEIGHT - BUBBLE_MARGIN.TOP - BUBBLE_MARGIN.BOTTOM; 

// 2. CONFIGURACIÓN DEL SVG y GRUPO PRINCIPAL (Gráfico 2: Burbujas)
const svgBubble = d3.select("#bubble-chart-area").append("svg")
      .attr("width", BUBBLE_TOTAL_WIDTH) 
      .attr("height", BUBBLE_TOTAL_HEIGHT); 

const gBubble = svgBubble.append("g")
      .attr("transform", `translate(${BUBBLE_MARGIN.LEFT}, ${BUBBLE_MARGIN.TOP})`);

// Preparar elementos de Ejes y Títulos (Gráfico 2: Burbujas)
const xAxisGroupBubble = gBubble.append("g").attr("class", "x axis").attr("transform", `translate(0, ${BUBBLE_HEIGHT})`);
const yAxisGroupBubble = gBubble.append("g").attr("class", "y axis");
gBubble.append("text").attr("class", "x axis-label").attr("x", BUBBLE_WIDTH / 2).attr("y", BUBBLE_HEIGHT + 65).attr("font-size", "22px").attr("text-anchor", "middle").text("Producto"); 
gBubble.append("text").attr("class", "y axis-label").attr("x", - (BUBBLE_HEIGHT / 2)).attr("y", -80).attr("font-size", "22px").attr("text-anchor", "middle").attr("transform", "rotate(-90)").text("Ventas (Unidades)"); 
gBubble.append("text").attr("class", "title").attr("x", BUBBLE_WIDTH / 2).attr("y", -20).attr("font-size", "20px").attr("text-anchor", "middle");

const legendBubble = gBubble.append("g").attr("transform", `translate(${BUBBLE_WIDTH + 20}, 20)`);


// --- DIMENSIONES Y MARGENES (Gráfico 3: Donut) ---
const DONUT_MARGIN = { LEFT: 10, RIGHT: 10, TOP: 50, BOTTOM: 10 }; 
const DONUT_HEIGHT = 360; 

// Responsividad - Obtener el ancho del contenedor.
const CONTAINER_WIDTH = parseInt(d3.select("#donut-chart-area").style("width"), 10);

const AVAILABLE_SPACE = CONTAINER_WIDTH - DONUT_MARGIN.LEFT - DONUT_MARGIN.RIGHT; 

const DONUT_LEGEND_WIDTH = 150; 
const MIN_DIAMETER = 200;

// Ajustar el espacio restado para el diámetro.
const DONUT_CHART_DIAMETER = Math.max(MIN_DIAMETER, AVAILABLE_SPACE - DONUT_LEGEND_WIDTH - 30); 


const DONUT_RADIUS = DONUT_CHART_DIAMETER / 2; 
const DONUT_INNER_RADIUS = DONUT_RADIUS * 0.6; 

// 3. CONFIGURACIÓN DEL SVG y GRUPO PRINCIPAL (Gráfico 3: Donut)
const svgDonut = d3.select("#donut-chart-area").append("svg")
    // Definir explícitamente el ancho del SVG en el tamaño total del contenedor
    .attr("width", CONTAINER_WIDTH) 
    .attr("height", DONUT_HEIGHT); 

// Asegurar que el grupo G esté centrado en el espacio reservado para el Donut.
const gDonut = svgDonut.append("g")
    .attr("transform", `translate(${DONUT_MARGIN.LEFT + DONUT_CHART_DIAMETER / 2}, ${DONUT_HEIGHT / 2})`); 

// Contenedor para la Leyenda del Donut
// Posición: DONUT_MARGIN.LEFT + DONUT_CHART_DIAMETER (final del gráfico) + 30 (separación)
const gLegendDonut = svgDonut.append("g")
    .attr("transform", `translate(${DONUT_MARGIN.LEFT + DONUT_CHART_DIAMETER + 30}, ${DONUT_MARGIN.TOP})`);


// Contenedor para las métricas clave (KPIs)
const kpiContainer = d3.select("#kpi-summary");


// --- FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN ---
function updateGraph() {
      
    console.log("Función updateGraph() ejecutada. Producto Seleccionado: " + (selectedProduct || "Ninguno")); 

    // Define el orden canónico de los meses
    const ordenMesesCanonica = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Usar un timestamp para asegurar que el navegador no use la versión en caché del JSON
    const cacheBuster = `?_=${Date.now()}`;
    
    d3.json(`data/productos.json${cacheBuster}`) // <--- URL con parámetro anti-caché
        .then(data => {
            
            if (!data || data.length === 0) {
                console.error("ERROR: El archivo JSON está vacío o no contiene datos.");
                kpiContainer.html('<div style="padding: 20px; text-align: center; color: red;">Error al cargar los datos.</div>');
                g.selectAll(".month-group").remove();
                gBubble.selectAll(".bubble-group").remove();
                gDonut.selectAll("path").remove();
                gLegendDonut.selectAll(".legend-item-donut").remove(); // Limpia la leyenda
                return;
            }

            // Conversión de tipo (Añadimos la columna 'ingresos')
            data.forEach(d => { 
                d.ventas = Number(d.ventas); 
                d.ingresos = Number(d.ingresos); // Convertir ingresos a número
            });
            
            // --- CÁLCULO DE DATOS COMUNES (Base sin filtrar) ---
            const productos = Array.from(new Set(data.map(d => d.producto))); // Productos totales
            
            const mesesConDatos = Array.from(new Set(data.map(d => d.mes)))
                .sort((a, b) => ordenMesesCanonica.indexOf(a) - ordenMesesCanonica.indexOf(b)); 
            
            // Ventas e Ingresos por Producto (para Donut y Burbujas) - Base sin filtrar
            // Usamos d3.group para calcular ambas agregaciones
            let ventasPorProducto = Array.from(d3.group(data, d => d.producto), 
                ([producto, values]) => ({
                    producto: producto,
                    ventasTotales: d3.sum(values, d => d.ventas),
                    ingresosTotales: d3.sum(values, d => d.ingresos) // Total de Ingresos
                })
            );
            
            // Venta total general
            const totalVentasGeneral = d3.sum(data, d => d.ventas);
            // Ingreso total general
            const totalIngresosGeneral = d3.sum(data, d => d.ingresos); 
            
            const totalMeses = mesesConDatos.length;

            // --- FILTRADO DE DATOS CONDICIONAL ---
            let filteredDataBarras = data;
            let filteredVentasPorProducto = ventasPorProducto; 
            
            if (selectedProduct) {
                filteredDataBarras = data.filter(d => d.producto === selectedProduct);
                filteredVentasPorProducto = ventasPorProducto.filter(d => d.producto === selectedProduct);
            }

            // Variables Clave para KPIs y Donut Center Text
            const currentVentasPorProducto = selectedProduct ? filteredVentasPorProducto : ventasPorProducto;
            const currentTotalVentas = selectedProduct ? d3.sum(filteredVentasPorProducto, d => d.ventasTotales) : totalVentasGeneral; 
            // Ingresos Totales (filtrado o general)
            const currentTotalIngresos = selectedProduct ? d3.sum(filteredVentasPorProducto, d => d.ingresosTotales) : totalIngresosGeneral; 
            
            const currentTotalMeses = selectedProduct 
                ? Array.from(new Set(filteredDataBarras.map(d => d.mes))).length 
                : totalMeses;
            const selectedProductSales = ventasPorProducto.find(p => p.producto === selectedProduct)?.ventasTotales || 0;


            // --- ESCALAS ---
            // Escala de color para todos los gráficos
            const color = d3.scaleOrdinal().domain(productos).range(d3.schemeSet1); 
            const t = d3.transition().duration(500);

            // ===========================================
            // GRÁFICO 1: BARRAS
            // ===========================================
            const dominioX = mesesConDatos;
            
            const x0 = d3.scaleBand().domain(dominioX).range([0, WIDTH]).paddingInner(0.1);
            const productosEnBarra = selectedProduct ? [selectedProduct] : productos;

            const x1 = d3.scaleBand().domain(productosEnBarra).range([0, x0.bandwidth()]).padding(0.05);
            
            const y = d3.scaleLinear().domain([0, d3.max(data, d => d.ventas) * 1.10]).range([HEIGHT, 0]);
            
            // Ejes Barras
            const xAxisCall = d3.axisBottom(x0);
            xAxisGroup.transition(t).call(xAxisCall).selectAll("text").attr("y", "10").attr("x", "0").attr("text-anchor", "middle").attr("transform", "rotate(0)");
            const yAxisCall = d3.axisLeft(y).ticks(5).tickSize(-WIDTH).tickFormat(d3.format(".2s"));
            yAxisGroup.transition(t).call(yAxisCall).select(".domain").remove();
            yAxisGroup.selectAll(".tick line").attr("stroke-opacity", 0.4);

            const dataByMonth = d3.groups(filteredDataBarras, d => d.mes);
            const dataMap = new Map(dataByMonth);
            
            let monthGroups = g.selectAll(".month-group").data(dominioX, d => d);
            monthGroups.exit().remove();
            const monthEnter = monthGroups.enter().append("g").attr("class", "month-group");
            
            monthGroups = monthEnter.merge(monthGroups)
                .attr("transform", d => `translate(${x0(d)}, 0)`);
            
            const bars = monthGroups.selectAll(".bar").data(d => dataMap.get(d) || [], d => d.producto);

            bars.exit().transition(t).attr("y", HEIGHT).attr("height", 0).remove();

            bars.enter().append("rect").attr("class", "bar").attr("y", HEIGHT).attr("height", 0)
                .merge(bars)
                .attr("x", d => x1(d.producto))
                .attr("width", x1.bandwidth())
                .attr("fill", d => color(d.producto))
                .style("filter", d => selectedProduct === d.producto ? "url(#dropshadow)" : "none")
                .style("opacity", d => selectedProduct && selectedProduct !== d.producto ? 0.3 : 1.0)
                .on("click", (event, d) => handleProductClick(d))
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", .9); 
                    tooltip.html(`Mes: <strong>${d.mes}</strong><br>Producto: <strong>${d.producto}</strong><br>Ventas: <strong>${d.ventas.toLocaleString()}</strong>`)
                        .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px"); 
                })
                .on("mouseout", (event, d) => {
                    tooltip.transition().duration(500).style("opacity", 0); 
                })
                .transition(t)
                .attr("y", d => y(d.ventas))
                .attr("height", d => HEIGHT - y(d.ventas));

            // Leyenda Barras 
            const legendItemBar = legendBar.selectAll(".legend-item").data(productos, d => d); 
            legendItemBar.exit().remove();
            const legendEnterBar = legendItemBar.enter().append("g").attr("class", "legend-item")
                .merge(legendItemBar)
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .style("opacity", d => (selectedProduct && selectedProduct !== d) ? 0.3 : 1.0); 
            legendEnterBar.selectAll("rect").data(d => [d]).join("rect").attr("width", 10).attr("height", 10).attr("fill", d => color(d));
            legendEnterBar.selectAll("text").data(d => [d]).join("text").attr("x", 15).attr("y", 9).attr("font-size", "14px").attr("fill", "#333").text(d => d);


            // ===========================================
            // GRÁFICO 2: BURBUJAS
            // ===========================================
            const tBubble = d3.transition().duration(750);
            
            // Escalas Burbujas (Dominio siempre sobre el total para que el eje Y no cambie)
            const xBubble = d3.scaleBand().domain(productos).range([0, BUBBLE_WIDTH]).padding(0.4); 
            // El dominio del eje Y sigue basándose en ventasTotales
            const yBubble = d3.scaleLinear().domain([0, d3.max(ventasPorProducto, d => d.ventasTotales) * 1.15]).range([BUBBLE_HEIGHT, 0]);
            const maxVentas = d3.max(ventasPorProducto, d => d.ventasTotales);
            
            // Aumentar el rango máximo del radio (de 30 a 50)
            const rBubble = d3.scaleLinear().domain([0, maxVentas]).range([5, 50]); 

            // Ejes Burbujas
            const xAxisCallBubble = d3.axisBottom(xBubble);
            xAxisGroupBubble.transition(tBubble).call(xAxisCallBubble)
                .select(".domain").remove()
                .selectAll("text")
                .attr("y", "10")
                .attr("x", "0")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(0)")
                .attr("font-size", "14px"); 

            const yAxisCallBubble = d3.axisLeft(yBubble).ticks(5).tickSize(-BUBBLE_WIDTH).tickFormat(d3.format(".2s")); 
            yAxisGroupBubble.transition(tBubble).call(yAxisCallBubble).select(".domain").remove();
            yAxisGroupBubble.selectAll(".tick line").attr("stroke-opacity", 0.4); 

            // GRUPO DE ELEMENTOS (Círculo + Etiqueta de Texto)
            let bubbleGroups = gBubble.selectAll(".bubble-group").data(ventasPorProducto, d => d.producto);
            bubbleGroups.exit().transition(tBubble).remove(); 
            const bubbleEnter = bubbleGroups.enter().append("g").attr("class", "bubble-group");

            bubbleGroups = bubbleEnter.merge(bubbleGroups)
                .attr("transform", d => `translate(${xBubble(d.producto) + xBubble.bandwidth() / 2}, 0)`)
                .style("opacity", d => selectedProduct && selectedProduct !== d.producto ? 0.3 : 1.0)
                .style("pointer-events", d => selectedProduct && selectedProduct !== d.producto ? "none" : "all"); 
            
            // 1. DIBUJO DE CIRCULOS
            bubbleGroups.selectAll("circle").data(d => [d]).join(
                enter => enter.append("circle").attr("class", "bubble").attr("cy", BUBBLE_HEIGHT).attr("r", 0),
                update => update,
                exit => exit.transition(tBubble).attr("r", 0).remove()
            )
                .attr("fill", d => color(d.producto)).attr("opacity", 0.8).attr("filter", "url(#dropshadow)").style("cursor", "pointer")
                .on("mouseover", (event, d) => { 
                    // Incluir Ingresos Totales en el tooltip de Burbujas
                    const formattedIngresos = d3.format("$,.2f")(d.ingresosTotales);
                    
                    tooltip.transition().duration(200).style("opacity", .9); 
                    tooltip.html(`Producto: <strong>${d.producto}</strong><br>Ventas Totales: <strong>${d3.format(",")(d.ventasTotales)}</strong><br>Ingresos Totales: <strong>${formattedIngresos}</strong>`)
                        .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px"); 
                    
                    d3.select(event.currentTarget).attr("stroke", d3.color(color(d.producto)).darker(0.5)).attr("stroke-width", 3).style("opacity", 1.0); 
                })
                .on("mouseout", (event, d) => { tooltip.transition().duration(500).style("opacity", 0); d3.select(event.currentTarget).attr("stroke", "none").attr("stroke-width", 0).style("opacity", 0.8); })
                .on("click", (event, d) => handleProductClick(d))
                .transition().duration(1500).ease(d3.easeElasticOut)
                .attr("cy", d => yBubble(d.ventasTotales)) 
                .attr("r", d => rBubble(d.ventasTotales));

            // 2. ETIQUETAS DE TEXTO (Valor de Venta en la Burbuja)
            bubbleGroups.selectAll("text").data(d => [d]).join(
                enter => enter.append("text").attr("text-anchor", "middle").attr("font-size", "12px").attr("fill", "white").attr("y", BUBBLE_HEIGHT + 5), 
                update => update,
                exit => exit.remove()
            )
                .transition().duration(1500).ease(d3.easeElasticOut)
                .attr("y", d => yBubble(d.ventasTotales) + 5) 
                // Usar formato de número entero
                .text(d => d3.format(",")(d.ventasTotales)); 

            // Leyenda Burbujas
            const legendItemBubbleFinal = legendBubble.selectAll(".legend-item-bubble").data(productos, d => d); 
            legendItemBubbleFinal.exit().remove();
            const legendEnterBubble = legendItemBubbleFinal.enter().append("g").attr("class", "legend-item-bubble")
                .merge(legendItemBubbleFinal)
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .style("opacity", d => (selectedProduct && selectedProduct !== d) ? 0.3 : 1.0); 
            legendEnterBubble.selectAll("circle").data(d => [d]).join("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", d => color(d));
            legendEnterBubble.selectAll("text").data(d => [d]).join("text").attr("x", 15).attr("y", 9).attr("font-size", "14px").attr("fill", "#333").text(d => d);


            // ===========================================
            // GRÁFICO 3: DONUT
            // ===========================================
            
            const pie = d3.pie().sort(null).value(d => d.ventasTotales);
            const arc = d3.arc().innerRadius(DONUT_INNER_RADIUS).outerRadius(DONUT_RADIUS);

            let dataDonut = pie(ventasPorProducto);
            
            // 1. Dibujar/Actualizar los Arcos (Paths)
            const paths = gDonut.selectAll("path").data(dataDonut, d => d.data.producto);
            paths.exit().transition(t).attr("fill", "#ccc").remove();

            paths.enter().append("path")
                .attr("stroke", "white").attr("stroke-width", "2px")
                .attr("d", arc) 
                .merge(paths)
                .attr("fill", d => color(d.data.producto))
                .style("opacity", d => selectedProduct && selectedProduct !== d.data.producto ? 0.3 : 1.0)
                .on("click", (event, d) => handleProductClick(d))
                .on("mouseover", (event, d) => {
                    // LÓGICA DE TOOLTIP AÑADIDA
                    d3.select(event.currentTarget).attr("stroke-width", "4px").attr("stroke", d3.color(color(d.data.producto)).darker(0.5));
                    
                    tooltip.transition().duration(200).style("opacity", .9); 
                    const totalVentasProducto = d3.format(",")(d.data.ventasTotales);
                    const porcentaje = d3.format(".1%")(d.data.ventasTotales / totalVentasGeneral);
                    
                    tooltip.html(`Producto: <strong>${d.data.producto}</strong><br>Ventas Totales: <strong>${totalVentasProducto}</strong><br>Participación: <strong>${porcentaje}</strong>`)
                        .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px"); 
                })
                .on("mouseout", (event, d) => {
                    // OCULTAR TOOLTIP
                    d3.select(event.currentTarget).attr("stroke-width", "2px").attr("stroke", "white");
                    tooltip.transition().duration(500).style("opacity", 0); 
                })
                .transition(d3.transition().duration(1000).ease(d3.easeExp))
                .attrTween("d", function(d) {
                    const i = d3.interpolate(this._current, d);
                    this._current = i(0); 
                    return function(t) {
                        return arc(i(t));
                    };
                });

            // 2. Dibujar/Actualizar Etiquetas de Porcentaje
            const arcLabels = gDonut.selectAll(".arc-label").data(dataDonut, d => d.data.producto);
            arcLabels.exit().remove();

            arcLabels.enter().append("text").attr("class", "arc-label").attr("text-anchor", "middle")
                .merge(arcLabels)
                .transition(t)
                .style("opacity", d => selectedProduct && selectedProduct !== d.data.producto ? 0.3 : 1.0)
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("fill", "white")
                .text(d => d3.format(".1%")(d.data.ventasTotales / totalVentasGeneral));
            
            // Texto central (Muestra el valor de venta del producto seleccionado o el Total General)
            // 3. Texto central - Valor
            const centerTextValue = gDonut.selectAll(".center-text-value").data([selectedProduct]);
            centerTextValue.exit().remove();

            centerTextValue.enter().append("text").attr("class", "center-text-value")
                .attr("text-anchor", "middle")
                .attr("font-size", "22px")
                .attr("y", -5)
                .merge(centerTextValue)
                .text(d => d ? d3.format(",")(selectedProductSales) : d3.format(",")(totalVentasGeneral));

            // 3.1. Texto central - Etiqueta
            const centerTextLabel = gDonut.selectAll(".center-text-label").data([selectedProduct]);
            centerTextLabel.exit().remove();

            centerTextLabel.enter().append("text").attr("class", "center-text-label")
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("fill", "#666")
                .attr("y", 20)
                .merge(centerTextLabel)
                .text(d => d ? d : "Venta Total");


            // 4. Dibujar la Leyenda del Donut
            const legendDonutItem = gLegendDonut.selectAll(".legend-item-donut").data(productos, d => d); 
            legendDonutItem.exit().remove();

            const legendEnterDonut = legendDonutItem.enter().append("g").attr("class", "legend-item-donut")
                .merge(legendDonutItem)
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .style("opacity", d => (selectedProduct && selectedProduct !== d) ? 0.3 : 1.0)
                .on("click", (event, d) => handleProductClick({ producto: d })); // Simula el clic

            legendEnterDonut.selectAll("rect").data(d => [d]).join("rect")
                .attr("width", 10).attr("height", 10)
                .attr("fill", d => color(d));

            legendEnterDonut.selectAll("text").data(d => [d]).join("text")
                .attr("x", 15).attr("y", 9).attr("font-size", "14px").attr("fill", "#333")
                .text(d => d);


            // ===========================================
            // OPCIÓN 4: TABLA DE RESUMEN (KPIs)
            // ===========================================
            
            // Lógica del promedio mensual usa el currentTotalVentas corregido.
            const avgVentaMensual = currentTotalVentas / (currentTotalMeses > 0 ? currentTotalMeses : 1);
            // Promedio de Ingreso Mensual
            const avgIngresoMensual = currentTotalIngresos / (currentTotalMeses > 0 ? currentTotalMeses : 1);
            
            let nombreProductoTop;
            let valorProductoTop;

            if (selectedProduct) {
                // Si hay producto seleccionado, el KPI Top es ese producto
                nombreProductoTop = selectedProduct;
                valorProductoTop = selectedProductSales; 
            } else {
                // Si no hay selección, encontramos el producto más vendido en general
                const productoTopGeneral = d3.max(ventasPorProducto, d => d.ventasTotales);
                nombreProductoTop = ventasPorProducto.find(d => d.ventasTotales === productoTopGeneral)?.producto || "N/A";
                valorProductoTop = productoTopGeneral;
            }
            
            // Formato del valor del KPI Top
            const formattedTopValue = `${nombreProductoTop} (${d3.format(",")(valorProductoTop)})`;


            const kpis = [
                { 
                    id: 'total', 
                    label: selectedProduct ? `VENTA TOTAL (${selectedProduct.toUpperCase()})` : 'VENTA TOTAL GENERAL', 
                    value: currentTotalVentas, 
                    class: 'kpi-total',
                        format: 'number'
                },
                // Ingresos Totales
                { 
                    id: 'ingresosTotal', 
                    label: selectedProduct ? `INGRESOS TOTALES (${selectedProduct.toUpperCase()})` : 'INGRESOS TOTALES GENERALES', 
                    value: currentTotalIngresos, 
                    class: 'kpi-ingresos-total',
                        format: 'currency'
                },
                // ❌ ELIMINADO POR SOLICITUD
                /*
                { 
                    id: 'avg', 
                    label: selectedProduct ? `PROMEDIO MENSUAL DE ${selectedProduct.toUpperCase()}` : 'VENTA PROMEDIO MENSUAL GENERAL', 
                    value: avgVentaMensual, 
                    class: 'kpi-average',
                        format: 'decimal'
                },
                */
                // Promedio de Ingreso Mensual
                { 
                    id: 'avgIngreso', 
                    label: selectedProduct ? `PROMEDIO DE INGRESO MENSUAL DE ${selectedProduct.toUpperCase()}` : 'INGRESO PROMEDIO MENSUAL GENERAL', 
                    value: avgIngresoMensual, 
                    class: 'kpi-ingreso-average',
                        format: 'currency-decimal'
                },
                { 
                    id: 'top', 
                    label: selectedProduct ? `PRODUCTO SELECCIONADO` : 'PRODUCTO TOP', 
                    value: formattedTopValue, // Usar el texto combinado
                    class: 'kpi-top', 
                    isText: true,
                    colorProduct: nombreProductoTop // Usar el nombre para el color
                }
            ];

// 2. Dibujar los KPIs
            kpiContainer.html(''); // Limpiar el contenedor antes de dibujar
            
            kpis.forEach(kpi => {
                const card = kpiContainer.append('div')
                    .attr('class', `kpi-card ${kpi.class}`);
                
                card.append('div')
                    .attr('class', 'kpi-label')
                    .text(kpi.label);
                
                let formattedValue;
                
                if (kpi.isText) {
                    formattedValue = kpi.value; // Texto combinado (Nombre y Valor)
                } else if (kpi.format === 'currency') {
                    formattedValue = d3.format("$,.0f")(kpi.value); // Moneda sin decimales
                } else if (kpi.format === 'currency-decimal') {
                    formattedValue = d3.format("$,.2f")(kpi.value); // Moneda con 2 decimales
                } else if (kpi.format === 'decimal') {
                    formattedValue = d3.format(".1f")(kpi.value); // Promedio con un decimal (sin símbolo)
                } else {
                    formattedValue = d3.format(",")(kpi.value); // Valor total
                }
                
                // Lógica de color para los KPIs
                let kpiColor = '#007bff'; // Color predeterminado (azul) para KPIs no filtrados
                
                if (selectedProduct) {
                    // Si hay un producto seleccionado, TODOS los KPIs usan el color del producto seleccionado.
                    kpiColor = color(selectedProduct);
                } else if (kpi.id === 'top' && kpi.colorProduct) {
                    // Si NO hay selección, el KPI TOP usa el color de su producto (el más vendido)
                    kpiColor = color(kpi.colorProduct); 
                }

                card.append('div')
                    .attr('class', 'kpi-value')
                    .text(formattedValue)
                    .style("color", kpiColor); // Aplicar el color calculado
            });


        }) // Cierre de .then(data => {...})
        .catch(error => {
            console.error("Error al cargar o procesar los datos JSON:", error);
            kpiContainer.html('<div style="padding: 20px; text-align: center; color: red;">Error al cargar los datos. Verifique el archivo `productos.json`.</div>');
        });

} // Cierre de updateGraph()

// Evento de clic en el botón de actualización (por si se recarga la data)
d3.select("#update-btn").on("click", updateGraph);

// Inicializar la visualización al cargar la página
updateGraph();