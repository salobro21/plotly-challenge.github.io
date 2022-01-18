//Read in the data
d3.json("./StarterCode/samples.json").then((data) => {
  // Grab values from the response json object to build the plots
  var Selector = d3.select("#selDataset");
  data.names.forEach((element) => {
    Selector.append("option").text(element).property("value", element);
  });
  console.log("im running");
  var name = data.names[0];
  charts(name);
  DemographicMetadata(name);
});
function optionChanged(newName) {
  DemographicMetadata(newName);
}

//Build Function to display the sample metadata, i.e., an individual's demographic information.
function DemographicMetadata(newName) {
  d3.json("./StarterCode/samples.json").then((data) => {
    // Grab values from the response json object to build the plots
    var meta = data.metadata;
    meta = meta.filter((Filt) => Filt.id == newName)[0];
    var demPan = d3.select("#sample-metadata");
    demPan.html("");
    Object.entries(meta).forEach(([key, value]) => {
      demPan.append("h2").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart

function charts(newName) {
  d3.json("./StarterCode/samples.json").then((data) => {
    var info = data.samples.filter((sampleObj) => sampleObj.id == newName)[0];
    var otu_ids = info.otu_ids;
    var otu_labels = info.otu_labels;
    var sample_values = info.sample_values;

    var yticks = otu_ids
      .slice(0, 10)
      .map((otuID) => `OTU ${otuID}`)
      .reverse();

    var layout = {
      title: "Bacteria",
      xaxis: {
        title: "OTU",
      },
      hovermode: "closest",
    };

    var trace = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
      },
    };

    data = [trace];
    Plotly.newPlot("bubble", data, layout);

    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      },
    ];
    var barLayout = {
      title: "Top 10 Bacteria",
    };
    Plotly.newPlot("bar", barData, barLayout);
  }); //D3.json
}

function optionChanged(newTestSubject) {
  // Fetch new data each time a new sample is selected
  DemographicMetadata(newTestSubject);
  charts(newTestSubject);
}
// 2.Create a bubble chart that displays each sample.
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.

// 3.Display the sample metadata, i.e., an individual's demographic information.

//Advanced: Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ to plot the weekly washing frequency of the individual.
