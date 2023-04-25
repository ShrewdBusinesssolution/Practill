const moment = require("moment");

class DateTimeHelper {
    /**
     * currentDate
     * @returns timestamp
     */
    static currentDate = () => {
        return moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    };

    /**
 * currentMonth
 * @returns timestamp
 */
    static currentMonth = () => {
        return moment().tz("Asia/Kolkata").format("MM");
    };


    /**
 * currentYear
 * @returns timestamp
 */
    static currentYear = () => {
        return moment().tz("Asia/Kolkata").format("YYYY");
    };

    /**
  * yesterdayDate
  * @returns timestamp
  */
    static yesterDayDate = () => {
        return moment().tz("Asia/Kolkata").subtract(1, "days").format("YYYY-MM-DD");
    };

    /**
     * currentDateTime
     * @returns timestamp
     */
    static currentDateTime = () => {
        return moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    };

    /**
     * addDaysToDateTime
     * @param {*} dateTime
     * @param {*} noOfDays
     * @returns
     */
    static addDaysToDateTime = (dateTime, noOfDays) => {
        return moment(dateTime, "YYYY-MM-DD HH:mm:ss").add(noOfDays, "days").format("YYYY-MM-DD HH:mm:ss");
    };

    /**
     * currentDateTime
     * @returns timestamp
     */
    static currentDateTime = () => {
        return moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    };

    /**
     * addMinutes
     * @param {*} dateTime
     * @param {*} noOfMinute
     */
    static addMinutes = (dateTime, noOfMinute) => {
        return moment(dateTime, "YYYY-MM-DD HH:mm:ss").add(noOfMinute, "minutes").format("YYYY-MM-DD HH:mm:ss");
    };

    /**
     * remainingMinutes
     * @param {*} expiryDateTime
     */
    static remainingMinutes = (expiryDateTime) => {
        var startDateTime = this.currentDateTime();
        const timeDifference = moment
            .utc(moment(expiryDateTime, "YYYY-MM-DD HH:mm:ss").diff(moment(startDateTime, "YYYY-MM-DD HH:mm:ss")))
            .format("mm:ss");
        return timeDifference;
    };

    /**
     * convertToMilleSeconds
     * @param {*} dateTime
     * @param {*} dateTimeFormat
     * @returns (int)
     */
    static convertToMilleSeconds = (dateTime, dateTimeFormat) => {
        var milliseconds = moment(dateTime, dateTimeFormat).valueOf();
        return milliseconds;
    };

    /**
     * minuteDifference
     * @param {*} dateTime
     */
    static minuteDifference = (dateTime) => {
        const startDateTime = moment(this.currentDateTime(), "DD-MM-YYYY HH:mm:ss").tz("Asia/Kolkata");
        const endDateTime = moment(dateTime, "DD-MM-YYYY HH:mm:ss").tz("Asia/Kolkata");

        const minutesDifference = startDateTime.diff(endDateTime, "minutes");

        return minutesDifference;
    };

    /**
     * convertDateFormat
     * @param {*} date
     * @returns
     */

    static convertDateFormat = (date) => {
        const dateFormat = moment(date).tz("Asia/Kolkata").format("YYYY-MM-DD");
        return dateFormat;
    };

    /**
     * convertTimeFormat
     * @param {*} date
     * @returns
     */

    static convertTimeFormat = (date) => {
        const dateFormat = moment(date).tz("Asia/Kolkata").format("hh:mm A");
        return dateFormat;
    };

    /**
     * addDaysWithDate
     * @param {*} dateTime
     * @param {*} noOfDays
     * @returns
     */
    static addDaysWithDate(date, noOfDays) {
        return moment(date, "YYYY-MM-DD").add(noOfDays, "days").format("YYYY-MM-DD");
    }
    /**
     * convertTimeToMilleSeconds
     * @param {*} time
     * @returns
     */
    static convertTimeToMilleSeconds = (time) => {
        return moment(time, "hh:mm A").format("X");
    };

    /**
     * convertDateToMilleSeconds
     * @param {*} time
     * @returns
     */
    static convertDateToMilleSeconds = (date) => {
        return moment(date, "YYYY-MM-DD").format("X");
    };

    /**
     * isToday
     * @param {*} date
     * @returns
     */
    static isToday = (date) => {
        const now = new Date();

        return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    };
}

// Export this module
module.exports = DateTimeHelper;
