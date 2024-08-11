import moment from "moment";
import 'moment/locale/vi';

moment.locale('vi');


export const formatRelativeTime = (dateString : string): string => {
    return moment(dateString).fromNow();
};