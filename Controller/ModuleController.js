const Module = require("../Models/Module");
const Section = require("../Models/Section");

// Create a new module
const createModule = async (req, res) => {
    try {
        const { name, description, section_id, prerequisites } = req.body;

        if (req.userRole !== "admin") {
            return res.status(403).json({ message: "Only admins can add prerequisites." });
        }

        if (!name || !description || !section_id) {
            return res.status(400).json({ message: "Name, description, and section_id are required." });
        }
        const sectionExists = await Section.findById(section_id);
        if (!sectionExists) {
            return res.status(404).json({ message: "Section not found." });
        }

        const existingModule = await Module.findOne({ section_id, name });
        if (existingModule) {
            return res.status(400).json({ message: "A module with this name already exists in this section." });
        }

        if (prerequisites && prerequisites.length > 0) {
            const prerequisiteModules = await Module.find({ _id: { $in: prerequisites } });
            if (prerequisiteModules.length !== prerequisites.length) {
                return res.status(400).json({ message: "One or more prerequisite modules do not exist." });
            }
            if (prerequisites.includes(req.body.id)) {
                return res.status(400).json({ message: "A module cannot be its own prerequisite." });
            }
        }
        const newModule = new Module({ name, description, section_id, prerequisites });
        await newModule.save();

        sectionExists.modules.push(newModule._id);
        await sectionExists.save();

        res.status(201).json({ message: "Module created successfully with prerequisites", module: newModule });
    } catch (error) {
        console.error("Error creating module:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get All Modules 
const getModules = async (req, res) => {
    try {
        const modules = await Module.find().populate("section_id", "name");
        res.status(200).json(modules);
    } catch (error) {
        console.error("Error retrieving modules:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;

        const module = await Module.findById(id).populate("prerequisites", "name completed");
        if (!module) {
            return res.status(404).json({ message: "Module not found." });
        }

        const incompletePrerequisites = module.prerequisites.filter(prereq => !prereq.completed);
        if (incompletePrerequisites.length > 0) {
            return res.status(403).json({
                message: "Cannot access this module until all prerequisite modules are completed.",
                incompletePrerequisites: incompletePrerequisites.map(prereq => prereq.name)
            });
        }

        res.status(200).json(module);
    } catch (error) {
        console.error("Error retrieving module by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getModulesBySectionId = async (req, res) => {
    try {
        const { section_id } = req.params;

        if (!section_id) {
            return res.status(400).json({ message: "Section ID is required." });
        }

        const sectionExists = await Section.findById(section_id);
        if (!sectionExists) {
            return res.status(404).json({ message: "Section not found." });
        }

        const modules = await Module.find({ section_id }, { name: 1, description: 1, _id: 1 });
        res.status(200).json(modules);
    } catch (error) {
        console.error("Error retrieving modules by section ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Module by ID
const updateModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const module = await Module.findById(id);
        if (!module) {
            return res.status(404).json({ message: "Module not found." });
        }

        if (name) module.name = name;
        if (description) module.description = description;

        await module.save();
        res.status(200).json({ message: "Module updated successfully", module });
    } catch (error) {
        console.error("Error updating module:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Module by ID
const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;

        const module = await Module.findById(id);
        if (!module) {
            return res.status(404).json({ message: "Module not found." });
        }

        await Section.findByIdAndUpdate(module.section_id, { $pull: { modules: id } });
        await Module.findByIdAndDelete(id);

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error("Error deleting module:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { 
  createModule, 
  getModules, 
  getModuleById, 
  updateModule, 
  deleteModule, 
  getModulesBySectionId
};
