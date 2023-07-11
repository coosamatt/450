import { Router } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import cheerio from "cheerio";
import axios from "axios";

const router = Router();

// Install middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan("dev"));

function getFormattedDates() {
  const startDate = new Date("2022-05-01");
  const endDate = new Date(); // Current date

  const dates = [];

  while (startDate <= endDate) {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${year}/${month}`;

    dates.push(formattedDate);

    startDate.setMonth(startDate.getMonth() + 1);
  }

  return dates;
}

//routes
router.get("/scrapdata", async (req, res) => {
  try {
    // const baseUrl = "https://queue-times.com/en-US/parks/6/calendar";

    const dates = getFormattedDates();

    const scrapedDataArray = await Promise.all(
      dates.map(async (item) => {
        const url = `/en-US/parks/6/calendar/${item}`;

        const monthResponse = await axios.get(`https://queue-times.com${url}`); // Replace with the actual base URL
        const monthHtml = monthResponse.data;
        const $month = cheerio.load(monthHtml);

        // Extract data from the provided HTML selector
        const tile = $month(
          "div.tile.is-parent.is-background.is-marginless.is-paddingless"
        );

        const backgroundColor = tile
          .find("a.tile.is-child.box.is-radiusless.is-clearfix")
          .attr("style")
          .match(/background: (.*?);/)[1];

        const day = tile
          .find(".tag.is-rounded.has-text-weight-bold.is-hidden-tablet")
          .text()
          .slice(0, 3);

        const date = tile
          .find(".tag.is-rounded.has-text-weight-bold.is-hidden-mobile")
          .text();

        const percentage = tile
          .find(".tags.is-pulled-right span.tag")
          .eq(0)
          .text()
          .trim();

        // Create an object with the extracted data
        const scrapedData = {
          backgroundColor,
          day,
          percentage,
        };

        console.log("percentage", scrapedData);

        return scrapedData;
      })
    );

    console.log("Data scraped successfully");
    res.status(200).json(scrapedDataArray);
  } catch (error) {
    res.json(error);
  }
});

export default router;
