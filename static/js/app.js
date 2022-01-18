d3.json("./data/samples.json").then((data) => {

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

function DemographicMetadata(newName) {
  d3.json("./data/samples.json").then((data) => {

    var meta = data.metadata;
    meta = meta.filter((Filt) => Filt.id == newName)[0];
    var demPan = d3.select("#sample-metadata");
    demPan.html("");
    Object.entries(meta).forEach(([key, value]) => {
      demPan.append("h2").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function charts(newName) {
  d3.json("./data/samples.json").then((data) => {
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
  });
}

function optionChanged(newTestSubject) {

  DemographicMetadata(newTestSubject);
  charts(newTestSubject);
}

