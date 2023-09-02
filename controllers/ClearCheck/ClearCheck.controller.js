require('dotenv').config();




const clearCheck = (req, res) => {
    // Process the data received from the widget
    const widgetData = req.body;
  
    // Here, you can perform any additional processing or save the data to your database
    
    // Respond with a success message to the widget
    res.json({ success: true });
  };



module.exports = {
    clearCheck
}