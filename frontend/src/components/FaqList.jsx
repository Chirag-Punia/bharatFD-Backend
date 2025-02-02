import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Globe2, Search, ChevronDown, ChevronUp } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

function FaqList() {
  const [faqs, setFaqs] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const supportedLanguages = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    zh: "中文",
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get(`/faqs?lang=${language}`);
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [language]);

  const filteredFaqs = faqs.filter((faq) => {
    const question = faq.translations?.[language]?.question || faq.question;
    return question.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our services. Can't find what
          you're looking for? Contact our support team.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <Globe2 className="h-5 w-5 text-gray-500 ml-2" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-0 py-2 pl-2 pr-8 text-gray-700 focus:ring-0"
          >
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div
            key={faq._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => setOpenFaq(openFaq === faq._id ? null : faq._id)}
              className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.translations?.[language]?.question || faq.question}
              </h3>
              {openFaq === faq._id ? (
                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
              )}
            </button>

            {openFaq === faq._id && (
              <div className="px-6 pb-5">
                <div
                  className="prose prose-blue max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: faq.translations?.[language]?.answer || faq.answer,
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No FAQs found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FaqList;
