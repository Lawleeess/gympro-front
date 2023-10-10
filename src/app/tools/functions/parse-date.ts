import { Period } from 'src/app/models/general';
import * as moment from 'moment';
import 'moment-timezone';

/**
 * Parses ISO date
 * @param date ISO 8601 extended format or RFC 3339 -> 2021-07-19T15:47:25.879806-05:00
 * @returns date -> '19/07/2021, 15:47:25'
 */
export function parseISODate(date: string): string {
  return new Date(date).toLocaleString('en-GB');
}

/**
 * Gets difference between two dates
 * @param date1 ISO 8601 extended format or RFC 3339 -> 2021-07-23T13:11:20.809391-05:00
 * @param date2 ISO 8601 extended format or RFC 3339 -> 2021-07-23T13:13:20.861699-05:00
 * @returns difference between two dates with format '00:02:00'
 */
export function getDiffBtwDates(date1: string, date2: string): string {
  const nDate1: any = new Date(date1);
  const nDate2: any = new Date(date2);

  const diffDates = nDate2 - nDate1; // difference in milliseconds

  return new Date(diffDates).toISOString().substr(11, 8);
}

/**
 * Gets Period of time using year and month
 * @param year number of year
 * @param month number of month (from 1 to 12)
 * @returns Period an object with startDate and endDate properties using 'YYYY-MM-DD' as format
 */
export function getMonthDateRange(year: number, month: number): Period {
  const period = new Period();

  // month in moment is 0 based, so it's necessary to subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  period.startDate = moment([year, month - 1]).format('YYYY-MM-DD');

  // Clone the value before .endOf()
  period.endDate = moment(period.startDate).endOf('month').format('YYYY-MM-DD');

  return period;
}

/**
 * Gets a date with specific timezone using a date in UTC format
 * @param timestamp UTC date e.g 2022-06-01T19:19:55.784715Z
 * @param timezone valid timezone for moment.js
 * @param format output format for returned date
 * @returns date in string using given timezone and format
 */
export function parseUTCtoTZ(
  timestamp: string,
  timezone: string = 'America/Mexico_City',
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const utcDate = moment.utc(timestamp);
  const tzDate = utcDate.clone().tz(timezone);
  return moment(tzDate).format(format);
}
