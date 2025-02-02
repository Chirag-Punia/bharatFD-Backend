import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import api from "../utils/api";
import { ArrowLeft, Globe } from "lucide-react";

function EditFaq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translations, setTranslations] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const supportedLanguages = {
    es: { name: "Spanish", nativeName: "Español" },
    fr: { name: "French", nativeName: "Français" },
    de: { name: "German", nativeName: "Deutsch" },
    zh: { name: "Chinese", nativeName: "中文" },
  };

  const [translationSuccess, setTranslationSuccess] = useState(
    Object.keys(supportedLanguages).reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: false,
      }),
      {}
    )
  );

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await api.get(`/faqs/${id}`);
        const faq = response.data;
        setValue("question", faq.question);
        setValue("answer", faq.answer);
        setEditorContent(faq.answer);
        setValue("status", faq.status);

        const translationsData =
          faq.translations instanceof Map
            ? Object.fromEntries(faq.translations)
            : faq.translations || {};

        setTranslations(translationsData);

        setTranslationSuccess(
          Object.keys(supportedLanguages).reduce(
            (acc, lang) => ({
              ...acc,
              [lang]: !!translationsData[lang],
            }),
            {}
          )
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching FAQ:", error);
        navigate("/admin");
      }
    };

    fetchFaq();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/faqs/${id}`, data);

      setTranslating(true);
      const translationPromises = Object.keys(supportedLanguages).map(
        (language) => api.post(`/faqs/${id}/translate`, { language })
      );

      await Promise.all(translationPromises);

      setTranslationSuccess(
        Object.keys(supportedLanguages).reduce(
          (acc, lang) => ({
            ...acc,
            [lang]: true,
          }),
          {}
        )
      );

      alert("FAQ saved and translations completed successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating FAQ or translating:", error);
      alert("Error saving FAQ or creating translations. Please try again.");
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Edit FAQ</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              {...register("question", { required: "Question is required" })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">
                {errors.question.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={editorContent}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
              }}
              onEditorChange={(content) => {
                setEditorContent(content);
                setValue("answer", content);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Translations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(translations).map(([lang, translation]) => (
                <div
                  key={lang}
                  className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800 capitalize flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      {supportedLanguages[lang]?.name} (
                      {supportedLanguages[lang]?.nativeName})
                    </h4>
                    {translationSuccess[lang] && (
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Translated
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                        {translation.question || "Not translated yet"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <div
                        className="p-3 bg-gray-50 rounded-md border border-gray-200 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: translation.answer || "Not translated yet",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFaq;
