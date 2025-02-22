const User = require("../Models/user");
const Onboarding = require("../Models/Onboarding");

const createOnBoarding = async (req, res) => {
    try {
        const { current_role, industry, department, highest_education, role, company_Size, frequency_at_work, AI_level, goals, interests, challenge, preffered_learning_style, weekly_commitment, how_often } = req.body;
        
        const user_id = req.user._id;

        if (interests.length > 5) {
            return res.status(400).json({ message: "Interests cannot exceed 5 items." });
        }

        if (goals.length > 3) {
            return res.status(400).json({ message: "Goals cannot exceed 3 items." });
        }

        const existingOnboarding = await Onboarding.findOne({ user_id });
        if (existingOnboarding) {
            return res.status(400).json({ message: "Onboarding data already exists for this user." });
        }

        const newOnboarding = new Onboarding({
            user_id,
            current_role,
            industry,
            department,
            highest_education,
            role,
            company_Size,
            frequency_at_work,
            AI_level,
            goals,
            interests,
            challenge,
            preffered_learning_style,
            weekly_commitment,
            how_often,
        });

        await newOnboarding.save();

        res.status(201).json({ message: "Onboarding data saved successfully", onboarding: newOnboarding });
    } catch (error) {
        console.error("Error saving onboarding data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const retrieveData = async (req, res) => {
    try {
        const user_id = req.user._id;

        const onboardingData = await Onboarding.findOne({ user_id }).populate("user_id", "firstName lastName email");

        if (!onboardingData) {
            return res.status(404).json({ message: "Onboarding data not found" });
        }

        res.status(200).json(onboardingData);
    } catch (error) {
        console.error("Error retrieving onboarding data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createOnBoarding, retrieveData };
