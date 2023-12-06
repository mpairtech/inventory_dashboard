export const imageUpload = async(img)=>{
    const formData = new FormData()
    formData.append('img',img)
    const url = `https://app.nokshikathabd.com/server/addImage`
    const response = await fetch(url,{
        method: 'POST',
        body: formData,
    })
    const data2= await response.json()
    return data2
}


export function formatTime(time) {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const parsedTime = new Date();
    parsedTime.setHours(parseInt(hours, 10));
    parsedTime.setMinutes(parseInt(minutes, 10));
  
    const ampm = parsedTime.getHours() >= 12 ? "PM" : "AM";
    const formattedHours =
      parsedTime.getHours() % 12 === 0 ? 12 : parsedTime.getHours() % 12;
    const formattedMinutes = parsedTime.getMinutes().toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  
  export const formatDate = (date) => {
    const formatedDate = new Date(date);
    const day = formatedDate.getDate();
    const month = formatedDate.getMonth() + 1;
    const year = formatedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };
  