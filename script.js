document.addEventListener("DOMContentLoaded", function () {
  const btnVideoGame = document.querySelector("#videogame");
  const btnMovies = document.querySelector("#movies");
  const btnKickstarter = document.querySelector("#kickstarter");

  let url =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

  fetchData(url);
  d3.select("#description").text(
    "Top 100 Most Sold Video Games Grouped by Platform"
  );

  btnKickstarter.addEventListener("click", () => {
    url =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
    fetchData(url);
    d3.select("#description").text(
      "Top 100 Most Sold Video Games Grouped by Platform"
    );
  });

  btnMovies.addEventListener("click", () => {
    url =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
    fetchData(url);
    d3.select("#description").text(
      "Top 100 Highest Grossing Movies Grouped By Genre"
    );
  });

  btnVideoGame.addEventListener("click", () => {
    url =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
    fetchData(url);
    d3.select("#description").text(
      "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category"
    );
  });

  const w = 1200;
  const h = 700;

  const svg = d3.select("#chart").attr("width", w).attr("height", h);
  const legend = d3.select("#legend").attr("width", 1000);

  function fetchData(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        d3.select("#title").text(data.name);

        const treemap = d3.treemap().size([w, h]);

        const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.height - a.height || b.value - a.value);

        treemap(root);

        svg.selectAll(".tile").remove();

        const colors = [
          "#CF5C36",
          "#890620",
          "#1985A1",
          "#B6465F",
          "#65743A",
          "#F4FDAF",
          "#D4B2D8",
          "#8E7DBE",
          "#D88C9A",
          "#7CDEDC",
          "#61FF7E",
          "#301014",
          "#57B8FF",
          "#FE6847",
          "#61C9A8",
          "#4C3B4D",
          "#282B28",
          "#00A6A6",
        ];

        const categoryColorMap = {};

        const tiles = svg
          .selectAll(".tile")
          .data(root.leaves())
          .enter()
          .append("g");

        tiles
          .append("rect")
          .attr("class", "tile")
          .attr("x", (d) => d.x0)
          .attr("y", (d) => d.y0)
          .attr("width", (d) => d.x1 - d.x0)
          .attr("height", (d) => d.y1 - d.y0)
          .attr("fill", (d) => getColorCategory(d.data.category))
          .attr("stroke", "black")
          .attr("data-name", (d) => d.data.name)
          .attr("data-category", (d) => d.data.category)
          .attr("data-value", (d) => d.data.value)
          .on("mouseover", (e, d) => {
            const tooltip = d3
              .select("#tooltip")
              .style("display", "block")
              .html(`Category: ${d.data.category}<br>Value: ${d.data.value}`)
              .style("left", `${e.pageX}px`)
              .style("top", `${e.pageY}px`)
              .attr('data-value', d.data.value)
          })
          .on("mouseout", () => {
            d3.select("#tooltip").style("display", "none");
          });

        tiles
          .append("text")
          .attr("x", (d) => Math.min(d.x0 + 5, w - 10))
          .attr("y", (d) => Math.min(d.y0 + 15, h - 10))
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "central")
          .attr("font-size", "10px")
          .html((d) => d.data.name);

        legend.selectAll("*").remove();

        const legendItems = legend
          .selectAll(".legend-item")
          .data(Object.keys(categoryColorMap))
          .enter()
          .append("g");

        legendItems
          .append("rect")
          .attr("class", "legend-item")
          .attr("width", 10)
          .attr("height", 10)
          .attr("x", (d, i) => i * 60)
          .attr("y", 40)
          .style("fill", (d, i) => categoryColorMap[d]);

        legendItems
          .append("text")
          .attr("class", "legend-text")
          .attr("width", 20)
          .attr("height", 20)
          .attr("x", (d, i) => i * 60 + 10)
          .attr("y", (d, i) => 1 * 50)
          .text((d) => d);

        function getColorCategory(category) {
          if (!categoryColorMap[category]) {
            categoryColorMap[category] =
              colors[Object.keys(categoryColorMap).length % colors.length];
          }
          return categoryColorMap[category];
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
});
