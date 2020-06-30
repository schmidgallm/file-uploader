// Dependencies
import React, { useState } from 'react';
import axios from 'axios';

// Import App CSS
import './App.css';

const App = props => {
  // Set state
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState(null);

  // listen for file on change and set state when changed
  const onChange = e => {
    setFiles(e.target.files);
  };

  // post files to upload enpoint.
  // Server will then pass to cloudinary via multer
  const onSubmit = async e => {
    // prevent form from submitting
    e.preventDefault();

    // init new form data
    const formData = new FormData();
    // loop through files to be uploaded and append them to form data
    for (let file of files) {
      formData.append('productImages', file);
    }

    try {
      // post to api
      console.log('Notice how form data is empty when you log this');
      console.log(formData);
      console.log(
        'This is becuase form data is not native to browser but your server will understand it'
      );
      const request = await axios.post('/api/v1/images/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
      const response = await request.data;

      // set message to server response
      setMessage(response.msg);

      // reset form data and message
      setTimeout(() => {
        setMessage('');
        document.querySelector('form').reset();
      }, 3000);
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div className="card">
      <h1>File Uploader</h1>
      <h5 className="blue-text">
        Upload multiple images using Multer and Cloudinary
      </h5>
      <p className="red-text">{message}</p>
      <form onSubmit={onSubmit}>
        <div className="file-field input-field">
          <div className="btn">
            <span>Files</span>
            <input
              multiple
              type="file"
              name="files"
              accept="image/jpg, image/jpeg, image/png"
              id="productImages"
              onChange={onChange}
            />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="Upload one or more files"
            />
          </div>
        </div>
        <button className="btn blue darken-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
