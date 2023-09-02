const getCurrentTimeWithSixDecimals = async ()=> {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Combine hours and minutes with six decimal places
    const currentTimeWithSixDecimals = hours + (minutes / 60).toFixed(6).substr(1);
  
    return parseFloat(currentTimeWithSixDecimals);
  }


module.exports = { getCurrentTimeWithSixDecimals }