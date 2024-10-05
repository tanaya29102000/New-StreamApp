// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import Swal from 'sweetalert2';
// import './UpdateVideo.css';

// const UpdateVideo = () => {
//   const { id } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [initialValues, setInitialValues] = useState({
//     title: '',
//     content: '',
//     author: '',
//     video: null,
//   });
//   const [videoPreview, setVideoPreview] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true);
//       if (id) {
//         try {
//           const response = await axios.get(`https://new-stream-app.vercel.app/api/videos/${id}`);
//           const post = response.data;
//           setInitialValues({
//             title: post.title,
//             content: post.content,
//             author: post.author,
//             video: null,
//           });
//           setVideoPreview(post.video);
//           setError('');
//         } catch (error) {
//           console.error('Error fetching post:', error);
//           setError('Failed to fetch post');
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [id]);

//   // Function to handle video upload
//   const handleVideoUpload = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'images1'); // Replace with your Cloudinary video preset
//     formData.append('resource_type', 'video');

//     const uploadResponse = await axios.post(
//       'https://api.cloudinary.com/v1_1/dobtzmaui/video/upload', // Cloudinary video upload URL
//       formData
//     );

//     return uploadResponse.data.secure_url;
//   };

//   // Validation schema
//   const validationSchema = Yup.object().shape({
//     title: Yup.string().required('Title is required'),
//     content: Yup.string().required('Content is required'),
//     author: Yup.string().required('Author is required'),
//     video: Yup.mixed()
//       .notRequired()
//       .test('fileType', 'Only MP4, AVI, and MOV files are allowed', (value) => {
//         return !value || ['video/mp4', 'video/avi', 'video/mov'].includes(value.type);
//       })
//       .test('fileSize', 'File size must be less than 50 MB', (value) => {
//         return !value || value.size <= 50 * 1024 * 1024; // 50 MB in bytes
//       }),
//   });

//   const handleSubmit = async (values, { setSubmitting }) => {
//     const formData = new FormData();
//     formData.append('title', values.title);
//     formData.append('content', values.content);
//     formData.append('author', values.author);

//     try {
//       let videoUrl;

//       if (values.video) {
//         videoUrl = await handleVideoUpload(values.video);
//       } else {
//         videoUrl = videoPreview; // Use the existing video if a new one is not uploaded
//       }

//       await axios.put(`https://new-stream-app.vercel.app/api/videos/${id}`, {
//         title: values.title,
//         content: values.content,
//         author: values.author,
//         video: videoUrl,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       // SweetAlert success message
//       Swal.fire({
//         icon: 'success',
//         title: 'Post Updated',
//         text: 'Your post has been updated successfully!',
//         confirmButtonText: 'Go to Home',
//       }).then(() => {
//         navigate('/home');
//       });

//     } catch (error) {
//       console.error('Error saving post:', error);
//       setError('Failed to save post');

//       // SweetAlert error message
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to update the post. Please try again later.',
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <p>Loading post...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div className="update-post-container">
//       <h1>{id ? 'Edit Post' : 'Create Post'}</h1>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize
//       >
//         {({ setFieldValue, isSubmitting }) => (
//           <Form className="update-post-form">
//             <div className="form-group">
//               <label htmlFor="title">Title</label>
//               <Field type="text" id="title" name="title" />
//               <ErrorMessage name="title" component="div" className="error-message" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="content">Content</label>
//               <Field as="textarea" id="content" name="content" />
//               <ErrorMessage name="content" component="div" className="error-message" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="author">Author</label>
//               <Field type="text" id="author" name="author" />
//               <ErrorMessage name="author" component="div" className="error-message" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="video">Upload New Video</label>
//               <input
//                 type="file"
//                 id="video"
//                 accept="video/mp4, video/avi, video/mov"
//                 onChange={(event) => {
//                   setFieldValue('video', event.currentTarget.files[0]);
//                   setVideoPreview(URL.createObjectURL(event.currentTarget.files[0]));
//                 }}
//               />
//               {videoPreview && (
//                 <video src={videoPreview} controls className="video-preview" />
//               )}

//               <ErrorMessage name="video" component="div" className="error-message" />
//             </div>
//             <button type="submit" disabled={isSubmitting} className="submit-button">
//               {id ? 'Update Post' : 'Create Post'}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default UpdateVideo;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import './UpdateVideo.css';

const UpdateVideo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState({
    title: '',
    content: '',
    author: '',
    video: null,
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      if (id) {
        try {
          const response = await axios.get(`https://new-stream-app-p3gm.vercel.app/api/videos/${id}`);
          const post = response.data;
          setInitialValues({
            title: post.title,
            content: post.content,
            author: post.author,
            video: null,
          });
          setVideoPreview(post.video);
          setError('');
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to fetch post');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Function to handle video upload
  const handleVideoUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'images1'); // Replace with your Cloudinary video preset
    formData.append('resource_type', 'video');

    try {
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dobtzmaui/video/upload', // Cloudinary video upload URL
        formData
      );
      console.log('Video uploaded successfully:', uploadResponse.data.secure_url);
      return uploadResponse.data.secure_url;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    author: Yup.string().required('Author is required'),
    video: Yup.mixed()
      .notRequired()
      .test('fileType', 'Only MP4, AVI, and MOV files are allowed', (value) => {
        return !value || ['video/mp4', 'video/avi', 'video/mov'].includes(value.type);
      })
      .test('fileSize', 'File size must be less than 50 MB', (value) => {
        return !value || value.size <= 50 * 1024 * 1024; // 50 MB in bytes
      }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    let videoUrl;

    try {
      // Upload new video if provided
      if (values.video) {
        videoUrl = await handleVideoUpload(values.video);
      } else {
        videoUrl = videoPreview; // Use existing video if no new video is uploaded
      }

      console.log('Submitting payload:', {
        title: values.title,
        content: values.content,
        author: values.author,
        video: videoUrl,
      });

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('author', values.author);
      formData.append('video', videoUrl);

      await axios.put(`https://new-stream-app-p3gm.vercel.app/api/videos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Post Updated',
        text: 'Your post has been updated successfully!',
        confirmButtonText: 'Go to Home',
      }).then(() => {
        navigate('/home');
      });

    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post');

      // SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update the post. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="update-post-container">
      <h1>{id ? 'Edit Post' : 'Create Post'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="update-post-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <Field as="textarea" id="content" name="content" />
              <ErrorMessage name="content" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <Field type="text" id="author" name="author" />
              <ErrorMessage name="author" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="video">Upload New Video</label>
              <input
                type="file"
                id="video"
                accept="video/mp4, video/avi, video/mov"
                onChange={(event) => {
                  setFieldValue('video', event.currentTarget.files[0]);
                  setVideoPreview(URL.createObjectURL(event.currentTarget.files[0]));
                }}
              />
              {videoPreview && (
                <video src={videoPreview} controls className="video-preview" />
              )}

              <ErrorMessage name="video" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {id ? 'Update Post' : 'Create Post'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateVideo;
