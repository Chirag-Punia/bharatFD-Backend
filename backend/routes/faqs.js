const express = require("express");
const { Translate } = require("@google-cloud/translate").v2;
const Redis = require("redis");
const Faq = require("../models/Faq");

const router = express.Router();

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
});

router.get("/", async (req, res) => {
  try {
    const cacheKey = `faqs:${req.query.lang || "en"}`;
    const cachedFaqs = await redisClient.get(cacheKey);

    if (cachedFaqs) {
      return res.json(JSON.parse(cachedFaqs));
    }

    const faqs = await Faq.find({ status: "active" });
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(faqs));

    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const faq = new Faq({
    question: req.body.question,
    answer: req.body.answer,
    status: req.body.status,
  });

  try {
    const newFaq = await faq.save();

    await redisClient.del("faqs:en");

    const targetLanguages = ["es", "fr", "de", "zh"]; // Match with frontend

    if (!newFaq.translations) {
      newFaq.translations = new Map();
    }

    await Promise.all(
      targetLanguages.map(async (targetLang) => {
        const stripHtml = (html) => html.replace(/<[^>]*>/g, "");
        const getHtmlTags = (html) => {
          const tags = [];
          html.replace(/<[^>]*>/g, (match) => {
            tags.push(match);
            return "";
          });
          return tags;
        };

        const questionText = stripHtml(newFaq.question);
        const answerText = stripHtml(newFaq.answer);
        const answerTags = getHtmlTags(newFaq.answer);

        const [questionTranslation] = await translate.translate(
          questionText,
          targetLang
        );
        const [answerTranslation] = await translate.translate(
          answerText,
          targetLang
        );

        let translatedAnswer = answerTranslation;
        answerTags.forEach((tag, index) => {
          if (index === 0) {
            translatedAnswer = `${tag}${translatedAnswer}`;
          } else {
            translatedAnswer = `${translatedAnswer}${tag}`;
          }
        });

        newFaq.translations.set(targetLang, {
          question: questionTranslation,
          answer: translatedAnswer,
        });

        await redisClient.del(`faqs:${targetLang}`);
      })
    );

    await newFaq.save();

    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/translate", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    const targetLang = req.body.language;

    if (!faq.translations) {
      faq.translations = new Map();
    }

    const stripHtml = (html) => {
      return html.replace(/<[^>]*>/g, "");
    };

    const getHtmlTags = (html) => {
      const tags = [];
      html.replace(/<[^>]*>/g, (match) => {
        tags.push(match);
        return "";
      });
      return tags;
    };

    const questionText = stripHtml(faq.question);
    const answerText = stripHtml(faq.answer);
    const answerTags = getHtmlTags(faq.answer);

    const [questionTranslation] = await translate.translate(
      questionText,
      targetLang
    );
    const [answerTranslation] = await translate.translate(
      answerText,
      targetLang
    );

    let translatedAnswer = answerTranslation;
    answerTags.forEach((tag, index) => {
      if (index === 0) {
        translatedAnswer = `${tag}${translatedAnswer}`;
      } else {
        translatedAnswer = `${translatedAnswer}${tag}`;
      }
    });

    faq.translations.set(targetLang, {
      question: questionTranslation,
      answer: translatedAnswer,
    });

    await faq.save();
    await redisClient.del(`faqs:${targetLang}`);

    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    await Faq.findByIdAndDelete(req.params.id);

    const languages = ["en", ...Object.keys(faq.translations || {})];
    await Promise.all(languages.map((lang) => redisClient.del(`faqs:${lang}`)));

    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    faq.question = req.body.question || faq.question;
    faq.answer = req.body.answer || faq.answer;
    faq.status = req.body.status || faq.status;

    const updatedFaq = await faq.save();

    const languages = ["en", ...Object.keys(faq.translations || {})];
    await Promise.all(languages.map((lang) => redisClient.del(`faqs:${lang}`)));

    res.json(updatedFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
