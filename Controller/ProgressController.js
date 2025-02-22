const User = require("../Models/User");
const UserProgress = require("../Models/userProgress");
const Module = require("../Models/Module");
const Section = require("../Models/Section");
const Theme = require("../Models/Theme");

const completeModule = async (req, res) => {
  try {
    const userId = req.user._id;
    const { module_id, quizScore } = req.body;

    // Validate quiz score.
    if (typeof quizScore !== "number" || quizScore <= 7) {
      return res.status(400).json({ message: "Quiz score too low to mark module as completed." });
    }

    // 1. Find the module and populate its section details.
    const moduleDoc = await Module.findById(module_id).populate("section_id");
    if (!moduleDoc) {
      return res.status(404).json({ message: "Module not found" });
    }

    // 2. Retrieve the user and populate the linked UserProgress document.
    const user = await User.findById(userId).populate("userProgress");
    if (!user || !user.userProgress) {
      return res.status(500).json({ message: "User progress document not found." });
    }
    const progress = user.userProgress;

    // Ensure arrays are initialized (in case defaults were not set).
    progress.completed_modules = progress.completed_modules || [];
    progress.section_progress = progress.section_progress || [];
    progress.theme_progress = progress.theme_progress || [];

    // 3. Check if the module is already completed.
    const alreadyCompleted = progress.completed_modules.some(
      (m) => m.module_id.toString() === module_id
    );
    if (alreadyCompleted) {
      return res.status(400).json({ message: "Module already completed" });
    }

    // Mark the module as completed and award module completion points (+10).
    progress.completed_modules.push({ module_id, completed_at: new Date() });
    progress.points = (progress.points || 0) + 10;

    // 4. Update Section Progress.
    const sectionId = moduleDoc.section_id._id;
    const modulesInSection = await Module.find({ section_id: sectionId }, "_id");
    const totalModulesInSection = modulesInSection.length;
    const completedInSection = progress.completed_modules.filter((m) =>
      modulesInSection.map((mod) => mod._id.toString()).includes(m.module_id.toString())
    );
    const completedInSectionCount = completedInSection.length;
    const sectionCompletionPercentage = Math.round((completedInSectionCount / totalModulesInSection) * 100);

    // Award bonus points if the section is fully completed (+50).
    if (completedInSectionCount === totalModulesInSection) {
      progress.points += 50;
    }

    // Update or create a section progress record.
    let sectionProgress = progress.section_progress.find(
      (sp) => sp.section_id.toString() === sectionId.toString()
    );
    if (!sectionProgress) {
      progress.section_progress.push({
        section_id: sectionId,
        status: completedInSectionCount === totalModulesInSection ? "completed" : "in_progress",
        completion_percentage: sectionCompletionPercentage,
        started_at: new Date(),
        ...(completedInSectionCount === totalModulesInSection && { completed_at: new Date() }),
      });
    } else {
      sectionProgress.status = completedInSectionCount === totalModulesInSection ? "completed" : "in_progress";
      sectionProgress.completion_percentage = sectionCompletionPercentage;
      if (completedInSectionCount === totalModulesInSection) {
        sectionProgress.completed_at = new Date();
      }
    }

    // 5. Update Theme Progress based on section completion.
    const themeId = moduleDoc.section_id.theme_id;
    if (themeId) {
      // Find all sections that belong to this theme.
      const sectionsInTheme = await Section.find({ theme_id: themeId }, "_id");
      const totalSections = sectionsInTheme.length;

      // Count how many sections in the theme the user has completed (status === "completed").
      const completedSectionsCount = progress.section_progress.filter((sp) =>
        sectionsInTheme.some(
          (sec) => sec._id.toString() === sp.section_id.toString() && sp.status === "completed"
        )
      ).length;

      const themeCompletionPercentage = Math.round((completedSectionsCount / totalSections) * 100);

      // Award bonus points if all sections in the theme are completed (+100).
      if (completedSectionsCount === totalSections) {
        progress.points += 100;
      }

      // Update or create a theme progress record.
      let themeProgress = progress.theme_progress.find(
        (tp) => tp.theme_id.toString() === themeId.toString()
      );
      if (!themeProgress) {
        progress.theme_progress.push({
          theme_id: themeId,
          status: completedSectionsCount === totalSections ? "completed" : "in_progress",
          completion_percentage: themeCompletionPercentage,
          started_at: new Date(),
          ...(completedSectionsCount === totalSections && { completed_at: new Date() }),
        });
      } else {
        themeProgress.status = completedSectionsCount === totalSections ? "completed" : "in_progress";
        themeProgress.completion_percentage = themeCompletionPercentage;
        if (completedSectionsCount === totalSections) {
          themeProgress.completed_at = new Date();
        }
      }
    }

    // 6. Save the updated progress document.
    await progress.save();

    res.status(200).json({
      message: "Module completed",
      progress: {
        points: progress.points,
        module_progress: progress.completed_modules,
        section_progress: progress.section_progress,
        theme_progress: progress.theme_progress,
      },
      user,
    });
  } catch (error) {
    console.error("Error completing module:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getModuleProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    // Retrieve user and populate userProgress.
    const user = await User.findById(userId).populate("userProgress");
    if (!user || !user.userProgress) {
      return res.status(500).json({ message: "User progress document not found." });
    }
    const progress = user.userProgress;
    res.status(200).json({
      completed_modules: progress.completed_modules,
      total_modules_completed: progress.completed_modules.length,
      points: progress.points,
    });
  } catch (error) {
    console.error("Error fetching module progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSectionProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("userProgress");
    if (!user || !user.userProgress) {
      return res.status(500).json({ message: "User progress document not found." });
    }
    res.status(200).json({
      section_progress: user.userProgress.section_progress,
    });
  } catch (error) {
    console.error("Error fetching section progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getThemeProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("userProgress");
    if (!user || !user.userProgress) {
      return res.status(500).json({ message: "User progress document not found." });
    }
    res.status(200).json({
      theme_progress: user.userProgress.theme_progress,
    });
  } catch (error) {
    console.error("Error fetching theme progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  completeModule,
  getModuleProgress,
  getSectionProgress,
  getThemeProgress,
};
