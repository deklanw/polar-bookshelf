import { Strings } from '../../util/Strings';

export class FilenameFormatter {
    public static formatDate(date: Date) {
        // note that getUTCDate() returns the UTC day of the month.  Very
        // confusing API naming.
        return this.formatYMD(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        );
    }

    public static formatYMD(year: number, month: number, day: number) {
        const sYear = `${year}`;
        const sMonth = Strings.lpad('' + month, '0', 2);
        const sDay = Strings.lpad('' + day, '0', 2);

        return `${sYear}-${sMonth}-${sDay}`;
    }
}
