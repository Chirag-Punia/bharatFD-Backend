const express = require("express");
const { Translate } = require("@google-cloud/translate").v2;

const router = express.Router();

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

router.get("/", async (req, res) => {
  try {
    const [languages] = await translate.getLanguages();
    const formattedLanguages = languages.map((lang) => ({
      code: lang.code,
      name: lang.name,
    }));

    res.json(formattedLanguages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
