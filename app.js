function populateDropdown(){
    var select = d3.select("#selDataset");

    d3.json('samples.json').then((data) => {
        var names = data.names;

        names.forEach((id) =>{
            select.append("option")
            .text(id)
            .property("value", id)
        });

    });
    
    demInfo('940');
    buildGraph('940');
    
}

function optionChanged(idNumber){
    console.log(idNumber)
    demInfo(idNumber);
    buildGraph(idNumber);
}

function demInfo (idNumber) {
    var demList = d3.select("#sample-metadata");
    d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        var cleanedData = metadata.filter(d => d.id == idNumber);
        cleanedData = cleanedData[0];
        demList.html("");
        Object.entries(cleanedData).forEach(([key,value]) => {
            demList.append("h6").text(`${key} : ${value}`);
        });
    });
}

function buildGraph (idNumber) {
    d3.json('samples.json').then((data) => {
        var sampleData = data.samples;
        var cleanedData = sampleData.filter(d => d.id == idNumber);
        var otuIds = cleanedData[0]['otu_ids'];
        var sampleValues = cleanedData[0]['sample_values']
        var otuLabels = cleanedData[0]['otu_labels']

        var barTrace = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.map(otu_ids => `OTU ${otu_ids}`).slice(0,10).reverse(),
            type: 'bar',
            orientation: "h",
            text: otuLabels.slice(0,10).reverse(),
            marker: {
              color: 'rgb(112, 148, 219)'
            }
        };
        var barData = [barTrace];
        var barLayout = {
            title: "Instances of Bacteria per Belly Button",
            xaxis: {title: "Sample Value Size"},
            yaxis: {title: "OTU ID's"}
        };

        Plotly.newPlot('bar', barData, barLayout);

        var bubbleTrace = {
            x: otuIds,
            y: sampleValues,
            mode: 'markers',
            text: otuLabels,
            marker: {
              size: sampleValues,
              color: otuIds,
              colorscale: "Earth"
            }
          };

        var bubbleData = [bubbleTrace];
        var bubbleLayout = {
            title: "Bacteria Population per Belly Button",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Value Size"}
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout)

    });

}

populateDropdown();