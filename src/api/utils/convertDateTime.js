export function convertDateTime(valDate, typeDate) {
  if(valDate){
      let date_val = new Date(valDate);
      if(typeDate === 0){
        date_val.setHours(0,0,0,0)
      }else{
        date_val.setHours(23,59,59,999)
      }
      valDate = date_val.toISOString()
    }
    return valDate
}
