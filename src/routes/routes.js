import { Router } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { load } from "cheerio";
import axios from "axios";
import {
  findBestWeekendPerMonth,
  findLeastBusyWeek,
  findLeastBusyWeekend,
  getDaysOfMonth,
  getFormattedDates,
} from "../utils/helpers.js";

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan("dev"));

router.get("/scrapdata", async (req, res) => {
  try {
    const dates = getFormattedDates();

    const scrapedDataArray = await Promise.all(
      dates.map(async (item) => {
        const url = `/en-US/parks/6/calendar/${item}`;

        const monthResponse = await axios.get(`https://queue-times.com${url}`);
        const monthHtml = monthResponse.data;
        const $month = load(monthHtml);

        const tile = $month(
          "div.tile.is-parent.is-background.is-marginless.is-paddingless"
        );

        const days = tile.find("a.tile.is-child.box.is-radiusless.is-clearfix");

        const percentages = days
          .find(".tags.is-pulled-right span.tag")
          .filter((i, el) => el.children[0].data.includes("%"))
          .map((i, el) => el.children[0].data.trim())
          .get();

        const datesOfMonth = getDaysOfMonth(item);

        const formattedData = datesOfMonth.map((dateItem, i) => ({
          date: dateItem,
          percentages: percentages[i],
        }));

        return formattedData;
      })
    );

    const activities = scrapedDataArray.flat();

    const bestWeekend = findLeastBusyWeekend(activities);

    const bestWeek = findLeastBusyWeek(activities);

    const bestWeekendPerMonth = findBestWeekendPerMonth(activities);

    console.log("Data scraped successfully");
    res.status(200).json({ bestWeekend, bestWeek, bestWeekendPerMonth });
  } catch (error) {
    res.json(error);
  }
});

export default router;