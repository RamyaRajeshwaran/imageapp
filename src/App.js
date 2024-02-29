import * as mobilenet from "@tensorflow-models/mobilenet";
import { useState, useEffect, useRef } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);
  
  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const uploadTrigger = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
  };

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      setIsModelLoading(false);
    } catch (error) {
      console.error("Error loading model:", error);
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  const detectImage = async () => {
    textInputRef.current.value = "";
    console.log("Detecting image...");
    console.log("Model:", model);
    console.log("Image Ref:", imageRef.current);
  
    if (!model || !imageRef.current) {
      console.error("Model or image reference is not available.");
      return;
    }

    try {
      const results = await model.classify(imageRef.current);
      console.log("Classification results:", results);
      setResults(results);
    } catch (error) {
      console.error("Error classifying image:", error);
    }
  };

  if (isModelLoading) {
    return <h2 style={{ textAlign: "center" }}>Initializing Model...</h2>;
  }

  return (
    <div className="App">
      <h1 className="header">Image Classifier</h1>
      <div className="inputField">
        <input
          type="file"
          accept="image/*"
          capture="camera"
          className="uploadInput"
          onChange={uploadImage}
          ref={fileInputRef}
        />
        <button className="uploadImage" onClick={uploadTrigger}>
          Upload Image
        </button>
        <span className="or">OR</span>
        <input
          type="text"
          placeholder="Enter Image URL"
          ref={textInputRef}
          onChange={handleInputChange}
        />
      </div>
      <div className="imageWrapper">
        <div className="imageContent">
          <div className="imageArea">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Image Preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
          {results.length > 0 && (
            <div className="imageResult">
              {results.map((result, index) => (
                <div className="result" key={index}>
                  <span className="name">{result.className}</span>
                  <span className="accuracy">
                    Accuracy Level: {(result.probability * 100).toFixed(2)}%
                    {index === 0 && <span className="bestGuess">Best Guess</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        {imageUrl && (
          <button className="button" onClick={detectImage}>
            Detect Image
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
