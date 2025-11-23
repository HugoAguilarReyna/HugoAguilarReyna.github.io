/*
 * main.js
 * Mastering Data Visualization with D3.js
 */

// Nueva variable de estado global: guarda el producto seleccionado (null por defecto)
let selectedProduct = null;

// --- VARIABLES GLOBALES PARA GOOGLE CHARTS ---
const GOOGLE_CHART_CONTAINER_ID = 'chart-area'; 
let googleChartsReady = false;
// CAMBIO: La variable global ahora se llamará googleChart en general, y no LineChart
let googleChart = null; 

// Función auxiliar para manejar el clic en cualquier gráfico (Donut, Bar, Bubble)
function handleProductClick(d) {
    const productClicked = d.producto || d.data.producto;
    if (selectedProduct === productClicked) {
        selectedProduct = null;
    } else {
        selectedProduct = productClicked;
    }
    updateGraph();
}

// --------------------------------------------------------
// 🔥 CONFIGURACIÓN DE GOOGLE CHARTS (GRÁFICO DE BARRAS - BarChart)
// --------------------------------------------------------
function drawGoogleChart(data, options) {
    if (!googleChart) {
        // CAMBIO: Se inicializa un BarChart de Google Charts
        googleChart = new google.visualization.BarChart(document.getElementById(GOOGLE_CHART_CONTAINER_ID));
    }
    googleChart.draw(data, options);
}

function initCharts() {
    console.log("Google Charts está listo. Iniciando D3.js y gráficos.");
    googleChartsReady = true;
    updateGraph();
}

// CORRECCIÓN/AJUSTE: Asegurar que google y google.charts existan antes de llamar a load.
// En el caso de que el script ya se haya cargado (lo que causaría que el typeof no sea 'undefined'),
// podemos proceder a cargar y registrar el callback. 
if (typeof google !== 'undefined' && typeof google.charts !== 'undefined') {
    // Nota: El paquete 'corechart' soporta BarChart, LineChart, AreaChart, etc.
    google.charts.load('current', {'packages':['corechart']}); 
    google.charts.setOnLoadCallback(initCharts);
} else {
    // Esto generalmente solo se ejecuta si el script de Google Charts no está en el HTML
    console.warn("El script de Google Charts no se ha cargado. Verifique index.html");
    // Inicializa D3 después de un breve retraso en caso de que Google Charts falle
    setTimeout(updateGraph, 1000); 
}


// [ ... El resto del código D3.js (Gráfico 1, 2, 3) permanece igual ... ]
const MARGIN = { LEFT: 60, RIGHT: 180, TOP: 50, BOTTOM: 130 };
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

// 1. OBTENER ANCHO DEL CONTENEDOR DINÁMICAMENTE
const CONTAINER_BAR_WIDTH = parseInt(d3.select("#bar-chart-area").style("width"), 10);
const WIDTH = CONTAINER_BAR_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const TOTAL_WIDTH_BAR = CONTAINER_BAR_WIDTH; // El ancho total del SVG es el ancho del contenedor

// 1. CONFIGURACIÓN DEL SVG y GRUPO PRINCIPAL (Gráfico 1: Barras D3.js)
const svg = d3.select("#bar-chart-area").append("svg") 
      .attr("width", TOTAL_WIDTH_BAR) // Usar ancho total del contenedor
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
// AJUSTE: Mover etiqueta Y más cerca ya que el margen izquierdo es más pequeño (60px)
g.append("text").attr("class", "y axis-label").attr("x", - (HEIGHT / 2)).attr("y", -40).attr("font-size", "22px").attr("text-anchor", "middle").attr("transform", "rotate(-90)").text("Ventas (Unidades)"); 
g.append("text").attr("class", "title").attr("x", WIDTH / 2).attr("y", -20).attr("font-size", "20px").attr("text-anchor", "middle");
// AJUSTE: Mover la leyenda de la barra más cerca al borde derecho (ya que WIDTH es ahora dinámico)
const legendBar = g.append("g").attr("transform", `translate(${WIDTH + 5}, 20)`); 


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

const CONTAINER_WIDTH = parseInt(d3.select("#donut-chart-area").style("width"), 10);

const AVAILABLE_SPACE = CONTAINER_WIDTH - DONUT_MARGIN.LEFT - DONUT_MARGIN.RIGHT;

const DONUT_LEGEND_WIDTH = 150;
const MIN_DIAMETER = 200;

const DONUT_CHART_DIAMETER = Math.max(MIN_DIAMETER, AVAILABLE_SPACE - DONUT_LEGEND_WIDTH - 30);


const DONUT_RADIUS = DONUT_CHART_DIAMETER / 2;
const DONUT_INNER_RADIUS = DONUT_RADIUS * 0.6;

// 3. CONFIGURACIÓN DEL SVG y GRUPO PRINCIPAL (Gráfico 3: Donut)
const svgDonut = d3.select("#donut-chart-area").append("svg")
    .attr("width", CONTAINER_WIDTH)
    .attr("height", DONUT_HEIGHT);

const gDonut = svgDonut.append("g")
    .attr("transform", `translate(${DONUT_MARGIN.LEFT + DONUT_CHART_DIAMETER / 2}, ${DONUT_HEIGHT / 2})`);

const gLegendDonut = svgDonut.append("g")
    .attr("transform", `translate(${DONUT_MARGIN.LEFT + DONUT_CHART_DIAMETER + 30}, ${DONUT_MARGIN.TOP})`);


const kpiContainer = d3.select("#kpi-summary");


// --- FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN ---
function updateGraph() {

    console.log("Función updateGraph() ejecutada. Producto Seleccionado: " + (selectedProduct || "Ninguno"));

    const ordenMesesCanonica = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    // Añadir cache buster para forzar la recarga del archivo JSON
    const cacheBuster = `?_=${Date.now()}`; 

    d3.json(`data/productos.json${cacheBuster}`)
        .then(data => {

            if (!data || data.length === 0) {
                console.error("ERROR: El archivo JSON está vacío o no contiene datos.");
                kpiContainer.html('<div style="padding: 20px; text-align: center; color: red;">Error al cargar los datos.</div>');
                d3.select("#bar-chart-area").html('<div style="padding: 20px; text-align: center; color: red;">No hay datos para el gráfico de barras.</div>');
                d3.select("#chart-area").html('<div style="padding: 20px; text-align: center; color: red;">No hay datos para el gráfico de Ingresos.</div>');
                return;
            }

            data.forEach(d => {
                d.ventas = Number(d.ventas);
                d.ingresos = Number(d.ingresos);
            });

            // --- CÁLCULO DE DATOS COMUNES ---
            const productos = Array.from(new Set(data.map(d => d.producto)));
            const mesesConDatos = Array.from(new Set(data.map(d => d.mes)))
                .sort((a, b) => ordenMesesCanonica.indexOf(a) - ordenMesesCanonica.indexOf(b));
            let ventasPorProducto = Array.from(d3.group(data, d => d.producto),
                ([producto, values]) => ({
                    producto: producto,
                    ventasTotales: d3.sum(values, d => d.ventas),
                    ingresosTotales: d3.sum(values, d => d.ingresos)
                })
            );
            const totalVentasGeneral = d3.sum(data, d => d.ventas);
            const totalIngresosGeneral = d3.sum(data, d => d.ingresos);
            const totalMeses = mesesConDatos.length;

            // --- FILTRADO DE DATOS CONDICIONAL ---
            let filteredData = data;
            let filteredVentasPorProducto = ventasPorProducto;

            if (selectedProduct) {
                filteredData = data.filter(d => d.producto === selectedProduct);
                filteredVentasPorProducto = ventasPorProducto.filter(d => d.producto === selectedProduct);
            }

            const currentTotalVentas = selectedProduct ? d3.sum(filteredVentasPorProducto, d => d.ventasTotales) : totalVentasGeneral;
            const currentTotalIngresos = selectedProduct ? d3.sum(filteredVentasPorProducto, d => d.ingresosTotales) : totalIngresosGeneral;
            const currentTotalMeses = selectedProduct
                ? Array.from(new Set(filteredData.map(d => d.mes))).length
                : totalMeses;
            const selectedProductSales = ventasPorProducto.find(p => p.producto === selectedProduct)?.ventasTotales || 0;


            // --- ESCALAS ---
            const color = d3.scaleOrdinal().domain(productos).range(d3.schemeSet1);
            const t = d3.transition().duration(500);

            // ===========================================
            // GRÁFICO 1: BARRAS AGRUPADAS D3.js (Actualizado con ancho dinámico)
            // ===========================================
            
            // Re-calcular WIDTH dinámicamente en cada actualización
            const currentContainerBarWidth = parseInt(d3.select("#bar-chart-area").style("width"), 10);
            const currentWidth = currentContainerBarWidth - MARGIN.LEFT - MARGIN.RIGHT;
            const currentTotalWidthBar = currentContainerBarWidth;

            // Ajustar el SVG al ancho total del contenedor
            svg.attr("width", currentTotalWidthBar);
            
            // Ajustar la posición del título y la leyenda
            g.select(".x.axis-label").attr("x", currentWidth / 2);
            g.select(".title").attr("x", currentWidth / 2);
            legendBar.attr("transform", `translate(${currentWidth + 5}, 20)`);
            
            
            const dominioX = mesesConDatos;
            const x0 = d3.scaleBand().domain(dominioX).range([0, currentWidth]).paddingInner(0.1);
            const productosEnBarra = selectedProduct ? [selectedProduct] : productos;
            const x1 = d3.scaleBand().domain(productosEnBarra).range([0, x0.bandwidth()]).padding(0.05);
            const y = d3.scaleLinear().domain([0, d3.max(data, d => d.ventas) * 1.10]).range([HEIGHT, 0]);

            // Ejes Barras
            const xAxisCall = d3.axisBottom(x0);
            xAxisGroup.transition(t).call(xAxisCall).selectAll("text").attr("y", "10").attr("x", "0").attr("text-anchor", "middle").attr("transform", "rotate(0)");
            
            // AJUSTE: El tickSize debe coincidir con el nuevo ancho interno (currentWidth)
            const yAxisCall = d3.axisLeft(y).ticks(5).tickSize(-currentWidth).tickFormat(d3.format(".2s")); 
            yAxisGroup.transition(t).call(yAxisCall).select(".domain").remove();
            yAxisGroup.selectAll(".tick line").attr("stroke-opacity", 0.4);

            const dataByMonth = d3.groups(filteredData, d => d.mes);
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

            // Leyenda Barras (Reutilizando la lógica anterior, pero con la posición ajustada por WIDTH)
            const legendItemBar = legendBar.selectAll(".legend-item").data(productos, d => d);
            legendItemBar.exit().remove();
            const legendEnterBar = legendItemBar.enter().append("g").attr("class", "legend-item")
                .merge(legendItemBar)
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .style("opacity", d => (selectedProduct && selectedProduct !== d) ? 0.3 : 1.0);
            legendEnterBar.selectAll("rect").data(d => [d]).join("rect").attr("width", 10).attr("height", 10).attr("fill", d => color(d));
            legendEnterBar.selectAll("text").data(d => [d]).join("text").attr("x", 15).attr("y", 9).attr("font-size", "14px").attr("fill", "#333").text(d => d);


            // ===========================================
            // GRÁFICO 2: BURBUJAS (Sin cambios)
            // ===========================================
            const tBubble = d3.transition().duration(750);
            const xBubble = d3.scaleBand().domain(productos).range([0, BUBBLE_WIDTH]).padding(0.4);
            const yBubble = d3.scaleLinear().domain([0, d3.max(ventasPorProducto, d => d.ventasTotales) * 1.15]).range([BUBBLE_HEIGHT, 0]);
            const maxVentas = d3.max(ventasPorProducto, d => d.ventasTotales);
            const rBubble = d3.scaleLinear().domain([0, maxVentas]).range([5, BUBBLE_WIDTH / 15]);

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

            let bubbleGroups = gBubble.selectAll(".bubble-group").data(ventasPorProducto, d => d.producto);
            bubbleGroups.exit().transition(tBubble).remove();
            const bubbleEnter = bubbleGroups.enter().append("g").attr("class", "bubble-group");

            bubbleGroups = bubbleEnter.merge(bubbleGroups)
                .attr("transform", d => `translate(${xBubble(d.producto) + xBubble.bandwidth() / 2}, 0)`)
                .style("opacity", d => selectedProduct && selectedProduct !== d.producto ? 0.3 : 1.0)
                .style("pointer-events", d => selectedProduct && selectedProduct !== d.producto ? "none" : "all");

            bubbleGroups.selectAll("circle").data(d => [d]).join(
                enter => enter.append("circle").attr("class", "bubble").attr("cy", BUBBLE_HEIGHT).attr("r", 0),
                update => update,
                exit => exit.transition(tBubble).attr("r", 0).remove()
            )
                .attr("fill", d => color(d.producto)).attr("opacity", 0.8).style("cursor", "pointer")
                .on("mouseover", (event, d) => {
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

            bubbleGroups.selectAll("text").data(d => [d]).join(
                enter => enter.append("text").attr("text-anchor", "middle").attr("font-size", "12px").attr("fill", "white").attr("y", BUBBLE_HEIGHT + 5),
                update => update,
                exit => exit.remove()
            )
                .transition().duration(1500).ease(d3.easeElasticOut)
                .attr("y", d => yBubble(d.ventasTotales) + 5)
                .text(d => d3.format(",")(d.ventasTotales));

            const legendItemBubbleFinal = legendBubble.selectAll(".legend-item-bubble").data(productos, d => d);
            legendItemBubbleFinal.exit().remove();
            const legendEnterBubble = legendItemBubbleFinal.enter().append("g").attr("class", "legend-item-bubble")
                .merge(legendItemBubbleFinal)
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .style("opacity", d => (selectedProduct && selectedProduct !== d) ? 0.3 : 1.0);
            legendEnterBubble.selectAll("circle").data(d => [d]).join("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", d => color(d));
            legendEnterBubble.selectAll("text").data(d => [d]).join("text").attr("x", 15).attr("y", 9).attr("font-size", "14px").attr("fill", "#333").text(d => d);


            // ===========================================
            // GRÁFICO 3: DONUT (Sin cambios)
            // ===========================================
            const pie = d3.pie().sort(null).value(d => d.ventasTotales);
            const arc = d3.arc().innerRadius(DONUT_INNER_RADIUS).outerRadius(DONUT_RADIUS);
            let dataDonut = pie(ventasPorProducto);
            const paths = gDonut.selectAll("path").data(dataDonut, d => d.data.producto);
            paths.exit().transition(t).attr("fill", "#ccc").remove();

            paths.enter().append("path")
                .attr("stroke", "white").attr("stroke-width", "2px")
                .attr("d", arc)
                .each(function(d) { this._current = d; })
                .merge(paths)
                .attr("fill", d => color(d.data.producto))
                .style("opacity", d => selectedProduct && selectedProduct !== d.data.producto ? 0.3 : 1.0)
                .on("click", (event, d) => handleProductClick(d))
                .on("mouseover", (event, d) => {
                    d3.select(event.currentTarget).attr("stroke-width", "4px").attr("stroke", d3.color(color(d.data.producto)).darker(0.5));
                    tooltip.transition().duration(200).style("opacity", .9);
                    const totalVentasProducto = d3.format(",")(d.data.ventasTotales);
                    const porcentaje = d3.format(".1%")(d.data.ventasTotales / totalVentasGeneral);
                    tooltip.html(`Producto: <strong>${d.data.producto}</strong><br>Ventas Totales: <strong>${totalVentasProducto}</strong><br>Participación: <strong>${porcentaje}</strong>`)
                        .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", (event, d) => {
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

            const arcLabels = gDonut.selectAll(".arc-label").data(dataDonut, d => d.data.producto);
            arcLabels.exit().remove();
            arcLabels.enter().append("text").attr("class", "arc-label").attr("text-anchor", "middle")
                .merge(arcLabels)
                .transition(t)
                .style("opacity", d => selectedProduct && selectedProduct !== d.data.producto ? 0.3 : 1.0)
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("fill", "white")
                .text(d => d3.format(".1%")(d.data.ventasTotales / totalVentasGeneral));

            const centerTextValue = gDonut.selectAll(".center-text-value").data([selectedProduct]);
            centerTextValue.exit().remove();
            centerTextValue.enter().append("text").attr("class", "center-text-value")
                .attr("text-anchor", "middle").attr("font-size", "22px").attr("y", -5)
                .merge(centerTextValue)
                .text(d => d ? d3.format(",")(selectedProductSales) : d3.format(",")(totalVentasGeneral));

            const centerTextLabel = gDonut.selectAll(".center-text-label").data([selectedProduct]);
            centerTextLabel.exit().remove();
            centerTextLabel.enter().append("text").attr("class", "center-text-label")
                .attr("text-anchor", "middle").attr("font-size", "14px").attr("fill", "#666").attr("y", 20)
                .merge(centerTextLabel)
                .text(d => d ? d : "Venta Total");


            const legendDonutItem = gLegendDonut.selectAll(".legend-item-donut").data(productos, d => d);
            legendDonutItem.exit().remove();
            const legendEnterDonut = legendDonutItem.enter().append("g").attr("class", "legend-item-donut")
                .merge(legendDonutItem)
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .style("opacity", d => (selectedProduct && selectedProduct !== d) ? 0.3 : 1.0)
                .on("click", (event, d) => handleProductClick({ producto: d }));
            legendEnterDonut.selectAll("rect").data(d => [d]).join("rect")
                .attr("width", 10).attr("height", 10).attr("fill", d => color(d));
            legendEnterDonut.selectAll("text").data(d => [d]).join("text")
                .attr("x", 15).attr("y", 9).attr("font-size", "14px").attr("fill", "#333")
                .text(d => d);


            // ===========================================
            // GRÁFICO 4: GOOGLE CHART (Ingresos por Mes - Ahora BarChart)
            // ===========================================

            if (googleChartsReady) { 
                const ingresosPorMes = Array.from(d3.group(filteredData, d => d.mes),
                    ([mes, values]) => ({
                        mes: mes,
                        ingresos: d3.sum(values, d => d.ingresos)
                    })
                ).sort((a, b) => ordenMesesCanonica.indexOf(a.mes) - ordenMesesCanonica.indexOf(b.mes));

                const dataArray = [['Mes', 'Ingresos']];
                ingresosPorMes.forEach(d => {
                    dataArray.push([d.mes, d.ingresos]);
                });

                const dataGoogle = google.visualization.arrayToDataTable(dataArray);
                const chartColor = selectedProduct ? color(selectedProduct) : '#1f77b4';
                const titleText = selectedProduct
                    ? `Ingresos Mensuales del Producto: ${selectedProduct}`
                    : "Ingresos Mensuales Totales";

                const options = {
                    title: titleText,
                    height: 400,
                    width: '100%', 
                    legend: { position: 'none' },
                    colors: [chartColor],
                    chartArea: { left: 120, width: '75%', height: '70%' },
                    // CAMBIO: Ajustar la configuración de los ejes para BarChart (ejes intercambiados)
                    hAxis: { // Eje Horizontal (Valores/Ingresos)
                        format: 'currency', 
                        title: 'Ingresos', 
                        titleTextStyle: { italic: false, fontSize: 16 }
                    },
                    vAxis: { // Eje Vertical (Meses)
                        title: 'Mes', 
                        titleTextStyle: { italic: false, fontSize: 16 }
                    },
                    // Desactivar algunas opciones que son específicas de AreaChart/LineChart
                    // curveType: 'none', 
                    // areaOpacity: 0.0, 
                };
                
                drawGoogleChart(dataGoogle, options); 
            }
            // ===========================================
            // OPCIÓN 5: TABLA DE RESUMEN (KPIs)
            // ===========================================
            const avgVentaMensual = currentTotalVentas / (currentTotalMeses > 0 ? currentTotalMeses : 1);
            const avgIngresoMensual = currentTotalIngresos / (currentTotalMeses > 0 ? currentTotalMeses : 1);
            let nombreProductoTop;
            let valorProductoTop;

            if (selectedProduct) {
                nombreProductoTop = selectedProduct;
                valorProductoTop = selectedProductSales;
            } else {
                const productoTopGeneral = d3.max(ventasPorProducto, d => d.ventasTotales);
                nombreProductoTop = ventasPorProducto.find(d => d.ventasTotales === productoTopGeneral)?.producto || "N/A";
                valorProductoTop = productoTopGeneral;
            }

            const formattedTopValue = `${nombreProductoTop} (${d3.format(",")(valorProductoTop)})`;

            const kpis = [
                {
                    id: 'total',
                    label: selectedProduct ? `VENTA TOTAL (${selectedProduct.toUpperCase()})` : 'VENTA TOTAL GENERAL',
                    value: currentTotalVentas,
                    class: 'kpi-total',
                        format: 'number'
                },
                {
                    id: 'ingresosTotal',
                    label: selectedProduct ? `INGRESOS TOTALES (${selectedProduct.toUpperCase()})` : 'INGRESOS TOTALES GENERALES',
                    value: currentTotalIngresos,
                    class: 'kpi-ingresos-total',
                        format: 'currency'
                },
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
                    value: formattedTopValue,
                    class: 'kpi-top',
                    isText: true,
                    colorProduct: nombreProductoTop
                }
            ];

            kpiContainer.html('');

            kpis.forEach(kpi => {
                const card = kpiContainer.append('div')
                    .attr('class', `kpi-card ${kpi.class}`);
                card.append('div')
                    .attr('class', 'kpi-label')
                    .text(kpi.label);

                let formattedValue;
                if (kpi.isText) {
                    formattedValue = kpi.value;
                } else if (kpi.format === 'currency') {
                    formattedValue = d3.format("$,.0f")(kpi.value);
                } else if (kpi.format === 'currency-decimal') {
                    formattedValue = d3.format("$,.2f")(kpi.value);
                } else if (kpi.format === 'decimal') {
                    formattedValue = d3.format(".1f")(kpi.value);
                } else {
                    formattedValue = d3.format(",")(kpi.value);
                }

                let kpiColor = '#007bff';
                if (selectedProduct) {
                    kpiColor = color(selectedProduct);
                } else if (kpi.id === 'top' && kpi.colorProduct) {
                    kpiColor = color(kpi.colorProduct);
                }

                card.append('div')
                    .attr('class', 'kpi-value')
                    .text(formattedValue)
                    .style("color", kpiColor);
            });

        }) // Fin d3.json .then
        .catch(error => {
            console.error("Error al cargar o procesar los datos:", error);
            kpiContainer.html('<div style="padding: 20px; text-align: center; color: red;">Error crítico al cargar los datos JSON.</div>');
            d3.select("#bar-chart-area").html('<div style="padding: 20px; text-align: center; color: red;">Error crítico al cargar los datos.</div>');
            d3.select("#chart-area").html('<div style="padding: 20px; text-align: center; color: red;">Error crítico al cargar los datos.</div>');
        });
}



// --------------------------------------------------------
//  GESTIÓN DE EVENTOS DEL BOTÓN DE ACTUALIZACIÓN 
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener la referencia al botón usando el ID 'update-button' del HTML
    const updateButton = document.getElementById('update-button');

    // 2. Adjuntar el evento 'click' para recargar los gráficos
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            console.log("Botón de Actualizar presionado. Recargando datos con cache buster.");
            updateGraph(); // Llama a la función principal que recarga el JSON
        });
    } else {
        console.warn("ADVERTENCIA: No se encontró el botón con ID 'update-button'.");
    }
});
