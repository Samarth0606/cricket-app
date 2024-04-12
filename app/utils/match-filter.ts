import type { match } from "@prisma/client";
import moment from "moment";

const isPastMatch = (match: match) =>
  moment(match.start_time).isBefore(moment()) &&
  moment().diff(moment(match.start_time), "days") >= 1;

const isLiveMatch = (match: match) =>
  moment(match.start_time).isBefore(moment()) &&
  moment().diff(moment(match.start_time), "days") < 1;

const isUpcomingMatch = (match: match) =>
  moment().isBefore(moment(match.start_time));

export { isPastMatch, isLiveMatch, isUpcomingMatch };
