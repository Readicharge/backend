const LabourRate = require("../../models/laborRate.model");
const Service = require("../../models/service.model");
const CustomerRates = require("../../models/servicePrice.model");


// The format of the question will be like this 
// [{"1":"1","2":"2a",.....}]


const service_determiner = async (question_list) => {
    const available_service_tiers = ["BI", "II", "AI", "AI80"]
    const service_selected = null;
    // First we will take the list and we will find that which are the combinations which are there present and if any of the combinations is there then we will use the service alloted for that service 
    if (question_list.cd2_3a === "80A - 19.2kw") {
        service_selected = available_service_tiers[3];
    }
    else if (
        (question_list.cd2_5b === "Outside" && question_list.cd2_14 === "<25`")
        || (question_list.cd2_5c === true && question_list.cd2_14 === "<25`")
        || (question_list.cd2_8a === true && question_list.cd2_14 === "<25`")
        || (question_list.cd2_8 === "Outside" && question_list.cd2_14 === "<25`")
    ) {
        service_selected = available_service_tiers[0];
    }
    else if (
        (question_list.cd2_5c === true && question_list.cd2_14 === "26`-50`")
        || (question_list.cd2_5b === "Outside" && question_list.cd2_14 === "26`-50`")
        || (question_list.cd2_5b === "Basement" && question_list.cd2_14 === "<25`")
        || (question_list.cd2_5d === false && question_list.cd2_14 === "<25`")
        || (question_list.cd2_8 === "Outside" && question_list.cd2_14 === "26`-50`")
        || (question_list.cd2_8 === "Basement" && question_list.cd2_14 === "<25`")
        || (question_list.cd2_8a === true && question_list.cd2_14 === "26`-50`")
        || (question_list.cd2_8b === false && question_list.cd2_14 === "<25`")
    ) {
        service_selected = available_service_tiers[1];
    }
    else if (
        (question_list.cd2_5b === "Outside" && (question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_8 === "Outside" && (question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_5b === "Basement" && (question_list.cd2_14 === "26`-50`" || question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_8 === "Basement" && (question_list.cd2_14 === "26`-50`" || question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_5c === true && (question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_5d === false && (question_list.cd2_14 === "26`-50`" || question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_8a === true && (question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
        || (question_list.cd2_8b === false && (question_list.cd2_14 === "26`-50`" || question_list.cd2_14 === "51`-75`" || question_list.cd2_14 === "76`-100`"))
    ) {
        service_selected = available_service_tiers[2];
    }

    const service = Service.findOne({service_code:service_selected})
    return service._id;

}




// This will also get the list as material code and their value respectively 
// here the object available materials will have the id of that material respectively 

const material_and_additional_price_determiner = async (question_list, available_materials, service_id, number_of_installs) => {

    // Initial decleration
    let materials_added = [];
    let total_cost = 0;
    let material_cost = 0;

    const service_obj = Service.findById(service_id);
    const service = service_obj.service_code;
    
    const customer_showing_cost_model = await CustomerRates.findOne({service_id:service_id , number_of_installs :number_of_installs });
    const customer_showing_cost = customer_showing_cost_model.price;
    
    const labourRatesObj = await LabourRate.findOne({ service_id: service_id, number_of_installs: number_of_installs });
    const labourRates = labourRatesObj.price_statewise.find((priceObj) => priceObj.state === state).price;


    if ((question_list.r2_a === true && service !== "AI80") || (question_list.cd2_2a === true)) {
        materials_added.push(available_materials[`NMEA_14_15_outlet_I_${number_of_installs - 1}`].id);
        material_cost += number_of_installs * available_materials[`NMEA_14_15_outlet_I_${number_of_installs - 1}`].price;
    }
    if ((question_list.cd1_1c === true && service === "AI80") || (question_list.cd1_1c === false && question_list.cd2_3a === "80A - 19.2kw")) {
        materials_added.push(available_materials[`Panel_Load_Central_80_100_A_I_${number_of_installs - 1}`].id);
        material_cost += number_of_installs * available_materials[`Panel_Load_Central_80_100_A_I_${number_of_installs - 1}`].price;
    }
    // space for cd2-13 and cd2-13b
    if (question_list.cd2_3a !== "80A - 19.2kw") {
        if (question_list.cd2_11 === true && (question_list.cd2_13 === "125A" || question_list.cd2_13 === "150A")) {
            materials_added.push(available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].id)
            material_cost += number_of_installs * available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].price;
        }
        if (question_list.cd2_11 === false && (question_list.cd2_13 !== "60A" && question_list.cd2_13 !== "100A")) {
            materials_added.push(available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].id)
            material_cost += number_of_installs * available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].price;
        }
    }
    // Space for the 4/4 wire
    if (question_list.cd2_14 === "<25`" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_25_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_25_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "26`-50`" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_50_I_I${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_50_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "51`-75`" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_75_I_I${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_75_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "76`-100`" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_100_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_100_I_${number_of_installs - 1}`].price;
    }

    // SPACE FOR THE 3/4 WIRE TYPE
    if (question_list.cd2_14 === "<25`" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_25_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_25_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "26`-50`" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_50_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_50_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "51`-75`" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_75_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_75_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "76`-100`" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_100_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_100_I_${number_of_installs - 1}`].price;
    }


    total_cost = material_cost + labourRates;



    return {
        total_cost : total_cost,
        labor_rate : labourRates,
        service_rate : customer_showing_cost,
        material_cost : material_cost,
        materials : materials_added
    }


}



module.exports = {
    service_determiner,
    material_and_additional_price_determiner
}