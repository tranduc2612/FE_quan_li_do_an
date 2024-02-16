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