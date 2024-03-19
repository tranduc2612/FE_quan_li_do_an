import dayjs,{ Dayjs,isDayjs } from 'dayjs';

const diacriticMap: { [key: string]: string } = {
    'á': 'a',
    'à': 'a',
    'ả': 'a',
    'ã': 'a',
    'ạ': 'a',
    'â': 'a',
    'ấ': 'a',
    'ầ': 'a',
    'ẩ': 'a',
    'ẫ': 'a',
    'ậ': 'a',
    'ă': 'a',
    'ắ': 'a',
    'ằ': 'a',
    'ẳ': 'a',
    'ẵ': 'a',
    'ặ': 'a',
    // Thêm các ánh xạ cho các ký tự tiếng Việt khác ở đây
  };

export function getCurrentUrl():string{
    const {
        host, hostname, href, origin, pathname, port, protocol, search
      } = window.location
      
      return pathname
}

export default function getParamUrl(){
    const url:string = getCurrentUrl();
    const id:any = url.split('/').pop();
    return decodeURI(id);
}

export function formatDate(date:any){
    if(!date) return null;
    let data = new Date(date);
    let current = new Date();
    let hour = data.getHours() > 9 ? data.getHours() : `0${data.getHours()}`;
    let minute =
        data.getMinutes() > 9 ? data.getMinutes() : `0${data.getMinutes()}`;
    let day = data.getDate() > 9 ? data.getDate() : `0${data.getDate()}`;
    let month =
        data.getMonth() + 1 > 9 ? data.getMonth() + 1 : `0${data.getMonth() + 1}`;
    let currDate = current.getDate();
    let currMonth = current.getMonth()+ 1;
    let currYear = current.getFullYear();
    if(currDate === day && currMonth === month && currYear === data.getFullYear()){
        return `${hour}:${minute} - Hôm nay`;
    }else if(currDate === Number(day) + 1 && currMonth === month && currYear === data.getFullYear()){
        return `${hour}:${minute} - Hôm qua`;
    }else{
        return `${hour}:${minute} - ${day}/${month}/${data.getFullYear()}`;
    }
}

export function formatDateType2(date:any){
    if(!date) return null;
    let data = new Date(date);
    let current = new Date();
    let hour = data.getHours() > 9 ? data.getHours() : `0${data.getHours()}`;
    let minute =
        data.getMinutes() > 9 ? data.getMinutes() : `0${data.getMinutes()}`;
    let day = data.getDate() > 9 ? data.getDate() : `0${data.getDate()}`;
    let month =
        data.getMonth() + 1 > 9 ? data.getMonth() + 1 : `0${data.getMonth() + 1}`;
    let currDate = current.getDate();
    let currMonth = current.getMonth()+ 1;
    let currYear = current.getFullYear();
    if(currDate === day && currMonth === month && currYear === data.getFullYear()){
        return `${hour}:${minute}`;
    }else if(currDate === Number(day) + 1 && currMonth === month && currYear === data.getFullYear()){
        return `Hôm qua`;
    }else{
        return `${day}/${month}/${data.getFullYear()}`;
    }
}

export function formatDateTypeDateOnly(date:any){
    if(!date) return null;
    let data = new Date(date);
    let current = new Date();
    let hour = data.getHours() > 9 ? data.getHours() : `0${data.getHours()}`;
    let minute =
        data.getMinutes() > 9 ? data.getMinutes() : `0${data.getMinutes()}`;
    let day = data.getDate() > 9 ? data.getDate() : `0${data.getDate()}`;
    let month =
        data.getMonth() + 1 > 9 ? data.getMonth() + 1 : `0${data.getMonth() + 1}`;
    return `${day}/${month}/${data.getFullYear()}`;
}

export function formatFullnameToUsername(fullname:string){
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"    
      ];
      for (var i=0; i<AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        fullname = fullname.replace(re, char);
      }
      return fullname.replace(/\s/g, '');
}

export function convertDayjsToDateTime(date:Dayjs){
    if(!date || !isDayjs(date)){
        return null;
    }
    const specificDate = new Date(date.year(),date.month(),date.date())
    specificDate.setHours(date.hour() + date.utcOffset() / 60);       
    specificDate.setMinutes(date.minute());    
    specificDate.setSeconds(date.second());
    return specificDate
}

export function convertDayjsToDate(date:Dayjs){
    if(!date || !isDayjs(date)){
        return null;
    }
    const specificDate = new Date(date.year(),date.month(),date.date()+1)
    return specificDate
}
/*
1 = fromDate nhỏ hơn toDate
-1  = fromDate lớn hơn toDate
0  = fromDate và toDate bằng nhau
**/

export function validateFromDateAndToDate(from:Date,to:Date){
    if (from < to) {
        return true; // fromDate nhỏ hơn toDate
    } else if (from > to) {
        return false; // fromDate lớn hơn toDate
    } else {
        return false; // fromDate và toDate bằng nhau
    }
}

export function isCurrentTimeInRange(fromDate:Date, toDate:Date) {
    if(!fromDate && !toDate){
        return 
    }
    const currentTime = new Date(); // Lấy thời gian hiện tại
  
    if (toDate < currentTime) {
        return -1; // toDate đã qua thời gian hiện tại
      } else if (fromDate <= currentTime && toDate >= currentTime) {
        return 0; // Thời gian hiện tại đang nằm trong khoảng
      } else {
        return 1; // Đang ở trong tương lai
      }
  }