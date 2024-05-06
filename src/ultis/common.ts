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

export function renderRole(role:string){
    if(role === "STUDENT"){
        return "Sinh viên"
    }
    if(role === "TEACHER"){
        return "Giảng viên"
    }
    if(role === "ADMIN"){
        return "Quản trị viên"
    }
    return "Chưa xác định"
}

export function renderGender(gender?:number){
    if(gender === 1){
        return "Nữ"
    }
    if(gender === 0){
        return "Nam"
    }
    return "Chưa xác định"
}

function caculatorTime(date: string): string {
    const dateNow: Date = new Date();
    const createdDate: Date = new Date(date);
    
    if(createdDate > dateNow) {
        return "";
    }

    // Tính số giây trước
    const numberSecond: number = Math.floor((dateNow.getTime() - createdDate.getTime()) / 1000);
  
    if (numberSecond < 60) {
      return numberSecond + " giây trước";
    }
  
    // Tính số phút trước
    const numberMinus: number = Math.floor(numberSecond / 60);
    if (numberMinus < 60) {
      return numberMinus + " phút trước";
    }
  
    // Tính số giờ trước
    const numberHour: number = Math.floor(numberMinus / 60);
    if (numberHour < 24) {
      return numberHour + " giờ trước";
    }
  
    // Tính số ngày trước
    const numberDay: number = Math.floor(numberHour / 24);
    if (numberDay < 30) {
      return numberDay + " ngày trước";
    }
  
    // Tính số tháng trước
    const numberMonth: number = Math.floor(numberDay / 30);
    return numberMonth + " tháng trước";
}

export function renderRoleInCouncil(role?: string){
    if(role == "CT"){
        return "Chủ tịch"
    }
    if(role == "TK"){
        return "Thư ký"
    }
    if(role == "UV1"){
        return "Ủy viên 1"
    }
    if(role == "UV2"){
        return "Ủy viên 2"
    }
    if(role == "UV3"){
        return "Ủy viên 3"
    }
    return ""
}

export function renderStatusAccount(status?: string){
    if(status == "AUTH"){
        return "Hoạt động"
    }
    if(status == "BLOCK"){
        return "Bị khóa"
    }
    return ""
}

export function dateShowNotification(fromDate:any, toDate:any){
    const timeCaculator = caculatorTime(fromDate);
    const strFromDate = formatDateTypeDateOnly(fromDate);
    const strToDate = formatDateTypeDateOnly(toDate);

    return `${timeCaculator} (${strFromDate} - ${strToDate})` 
}

export const validateFileType = (fileType:string) => {
    return fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif';
};

export const roundedNumber = (number:any)=>{
    const convertNumber = Number(number);
    if(!convertNumber){
        return 0
    }

    return convertNumber.toFixed(2);
}