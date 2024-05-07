const axios = require("axios");
const { JSDOM } = require("jsdom");

// Function to fetch HTML content from API
async function fetchHtmlContent(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching HTML content:", error.message);
    return null;
  }
}
// Function to parse HTML content and extract structured data into JSON
function parseHtmlToJSON(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const jsonData = {
    title: {},
  };
  // Parse titles
  const titles = document.querySelectorAll("div.title");
  titles.forEach((titleDiv) => {
    const title = {
      id: titleDiv.id,
      title: titleDiv.querySelector("h1").textContent.trim(),
      subtitles: [],
    };
    jsonData.title = title;
  });

  // Parse Subtitles
  const subtitles = document.querySelectorAll("div.subtitle");
  subtitles.forEach((subtitleDiv) => {
    const subtitle = {
      id: subtitleDiv.id,
      title: subtitleDiv.querySelector("h2").textContent.trim(),
      parts: [],
    };
    //Parse parts
    const parts = document.querySelectorAll("div.part");
    for (let i = 0; i < parts.length; i++) {
      const part = {
        id: parts[i].id,
        title: parts[i].querySelector("h1").textContent.trim(),
        subparts: [],
      };
      if (i >= 2) {
        break;
      }

      // Find all div elements with class 'subpart'
      const subpartDivs = document.querySelectorAll("div.subpart");
      subpartDivs.forEach((subpartDiv) => {
        const subpart = {
          id: subpartDiv.id,
          title: subpartDiv.querySelector("h2").textContent.trim(),
          metadata: JSON.parse(
            subpartDiv.querySelector("h2").dataset.hierarchyMetadata
          ),
          sections: [],
        };

        // Find sections within the subpart
        const sectionDivs = subpartDiv.querySelectorAll("div.section");
        sectionDivs.forEach((sectionDiv) => {
          const section = {
            id: sectionDiv.id,
            title: sectionDiv.querySelector("h4").textContent.trim(),
            metadata: JSON.parse(
              sectionDiv.querySelector("h4").dataset.hierarchyMetadata
            ),
            paragraphs: [],
          };

          // Find paragraphs within the section
          const paragraphDivs = sectionDiv.querySelectorAll('div[id^="p-"]');
          paragraphDivs.forEach((paragraphDiv) => {
            const paragraph = {
              id: paragraphDiv.id,
              text: paragraphDiv.textContent.trim(),
              metadata: {
                title: paragraphDiv.querySelector("p").dataset.title,
              },
            };
            section.paragraphs.push(paragraph);
          });

          subpart.sections.push(section);
        });

        part.subparts.push(subpart);
      });

      subtitle.parts.push(part);
    }
    jsonData.title.subtitles.push(subtitle);
  });

  return jsonData;
}

// Function to start the extraction process
async function startExtraction(url) {
  try {
    // Fetch HTML content
    const htmlContent = await fetchHtmlContent(url);

    // Parse HTML and extract structured data into JSON
    const jsonData = parseHtmlToJSON(htmlContent);

    return jsonData;
  } catch (error) {
    console.error("Error fetching or parsing HTML content:", error);
  }
  return null;
}
module.exports = { startExtraction };
