const { service_determiner } = require("../../../controllers/Job_service_determiner/Service.determiner");
const Materials = require("../../../models/material.model");
const Service = require("../../../models/service.model")



const material_determinatoin_from_questions = async ( question_set, number_of_installs) => {
    try {
        const service_id = await service_determiner(question_set);
        const service = await Service.findById(service_id);
        const service_data = {
            id: service_id,
            code: service.service_code
        }
        // Retrieve all materials from the database
        const allMaterials = await Materials.find({});

        // Initialize the object to store the materials
        var materialsObject = {};

        // Loop through each material and construct the key-value pair in the specified format
        allMaterials.forEach((material) => {
            const { material_code, _id, price, number_of_chargers } = material;
            const key = `${material_code}_I_${number_of_chargers}`;
            const value = {id: _id, price:price };
            materialsObject[key] = value;
        });


        // passing these all data to find the list of materials needed as per the question 
        // also determine the price for this 

        const {
            total_cost ,
            labor_rate ,
            service_rate  ,
            material_cost ,
            materials
        } = await material_and_additional_price_determiner(question_set,materialsObject,service_data,number_of_installs);
        


        const data =  {
            total_cost:total_cost,
            service_rate:service_rate,
            labor_rate:labor_rate,
            material_cost:material_cost,
            materials:materials
        }

        return data;

    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    material_determinatoin_from_questions
}