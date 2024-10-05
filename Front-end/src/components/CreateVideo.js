import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import swal from "sweetalert"; // Import SweetAlert
import "./CreateVideo.css";

const CreateVideo = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema using Yup for video
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    author: Yup.string().required("Author is required"),
    video: Yup.mixed()
      .required("A video file is required")
      .test(
        "fileType",
        "Only MP4, AVI, and MOV files are allowed",
        (value) => {
          return (
            value &&
            ["video/mp4", "video/avi", "video/mov"].includes(value.type)
          );
        }
      )
      .test("fileSize", "File size must be less than 50 MB", (value) => {
        return value && value.size <= 50 * 1024 * 1024; // 50 MB in bytes
      }),
  });

  // Function to handle video upload
  const handleVideoUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'images1'); // Replace with your Cloudinary preset for videos

    const uploadResponse = await axios.post(
      'https://api.cloudinary.com/v1_1/der0czjyu/video/upload', // Cloudinary video endpoint
      formData
    );

    return uploadResponse.data.secure_url; // Get the secure video URL
  };

  // Function to handle form submission
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);
    try {
      let videoUrl = await handleVideoUpload(values.video);
      const postData = {
        title: values.title,
        content: values.content,
        author: values.author,
        video: videoUrl, // Save video URL instead of image
      };

      await axios.post("https://new-stream-app-p3gm.vercel.app/api/videos", postData);
      swal("Success", "Post created successfully!", "success");
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.error("Failed to add post:", error);
      swal("Error", "Failed to create post. Please try again.", "error");
      setFieldError("video", "Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="blog-post-form">
      <h3 className="header">Upload Video</h3>
      <Formik
        initialValues={{ title: "", content: "", author: "", video: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage
                name="title"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <Field as="textarea" id="content" name="content" />
              <ErrorMessage
                name="content"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <Field type="text" id="author" name="author" />
              <ErrorMessage
                name="author"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="video">
                <img src={`${process.env.PUBLIC_URL}/assets/Upload.png`} alt="Upload Icon" style={{ width: '24px', marginRight: '8px' }} />
                Video
              </label>
              <input
                type="file"
                id="video"
                accept="video/mp4, video/avi, video/mov"
                onChange={(event) => {
                  setFieldValue("video", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage
                name="video"
                component="div"
                className="error-message"
              />
            </div>
            <button
              type="submit"
              className="button"
              disabled={isSubmitting || loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateVideo;
