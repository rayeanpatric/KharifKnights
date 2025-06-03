import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from "framer-motion";
import { Eye, LineChart, Camera, Brain, Leaf, Bug, BugOff, Upload, Loader2, AlertCircle } from "lucide-react"; // Updated icons
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as ort from 'onnxruntime-web';
import yaml from 'js-yaml';

// Define expected tensor formats
type TensorFormat = 'NCHW' | 'NHWC';

// Helper function to calculate Intersection over Union (IoU)
// Assumes box format [cx, cy, w, h] - convert to [x1, y1, x2, y2] for IoU calculation
function calculateIoU(box1: number[], box2: number[]): number {
    // Ensure boxes have 4 elements
    if (box1?.length !== 4 || box2?.length !== 4) {
        console.error("Invalid box format for IoU calculation:", box1, box2);
        return 0.0;
    }
    const [cx1, cy1, w1, h1] = box1;
    const [cx2, cy2, w2, h2] = box2;

     // Check for non-positive width/height which can cause issues
    if (w1 <= 0 || h1 <= 0 || w2 <= 0 || h2 <= 0) {
        return 0.0;
    }

    // Convert center coords to corner coords
    const x1_1 = cx1 - w1 / 2;
    const y1_1 = cy1 - h1 / 2;
    const x2_1 = cx1 + w1 / 2;
    const y2_1 = cy1 + h1 / 2;

    const x1_2 = cx2 - w2 / 2;
    const y1_2 = cy2 - h2 / 2;
    const x2_2 = cx2 + w2 / 2;
    const y2_2 = cy2 + h2 / 2;

    // Calculate intersection area
    const x_left = Math.max(x1_1, x1_2);
    const y_top = Math.max(y1_1, y1_2);
    const x_right = Math.min(x2_1, x2_2);
    const y_bottom = Math.min(y2_1, y2_2);

    if (x_right < x_left || y_bottom < y_top) {
        return 0.0; // No overlap
    }

    const intersectionArea = (x_right - x_left) * (y_bottom - y_top);

    // Calculate union area
    const box1Area = w1 * h1;
    const box2Area = w2 * h2;
    const unionArea = box1Area + box2Area - intersectionArea;

     // Avoid division by zero
    if (unionArea <= 0) {
        return 0.0;
    }

    const iou = intersectionArea / unionArea;
     // Clamp IoU to [0, 1] range due to potential floating point inaccuracies
    return Math.max(0.0, Math.min(iou, 1.0));
}


// Helper function for Non-Maximum Suppression (NMS)
// Basic implementation - consider using a library for more robust NMS if needed
function nonMaximumSuppression(boxes: Array<{ box: number[], score: number, classIndex: number }>, iouThreshold: number): Array<{ box: number[], score: number, classIndex: number }> {
    boxes.sort((a, b) => b.score - a.score); // Sort by score descending
    const selectedBoxes: Array<{ box: number[], score: number, classIndex: number }> = [];
    const active = Array(boxes.length).fill(true);
    let numActive = boxes.length;


    for (let i = 0; i < boxes.length && numActive > 0; i++) {
         if (active[i]) {
            const current = boxes[i];
            selectedBoxes.push(current);
            active[i] = false; // Mark current box as processed
            numActive--;


            for (let j = i + 1; j < boxes.length; j++) {
                if (active[j]) {
                    const iou = calculateIoU(current.box, boxes[j].box);
                    // Suppress boxes with high IoU ONLY if they are the same class
                    if (iou > iouThreshold && current.classIndex === boxes[j].classIndex) {
                         active[j] = false;
                         numActive--;
                    }
                }
            }
        }
    }


    // Filter out the suppressed boxes (those still marked as true in a hypothetical 'suppressed' array, or simply build the result)
    // The current logic directly pushes selected boxes, so no extra filtering needed here.
    return selectedBoxes;
}

// Sigmoid function
function sigmoid(x: number): number {
    // Add a check for large negative numbers to prevent potential overflow in exp(-x)
    // leading to Infinity, although less common for typical logit ranges.
    // More robust implementations might handle extreme values differently.
    if (x < -700) return 0; // Close enough to 0
    if (x > 700) return 1; // Close enough to 1
    return 1 / (1 + Math.exp(-x));
}

const AgriVision = () => {
  const { t } = useLanguage();

  // ONNX Runtime options
  ort.env.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/'; // Keep this path for now

  // State for Pest Detection
  const [pestModelSession, setPestModelSession] = useState<ort.InferenceSession | null>(null);
  const [pestLabels, setPestLabels] = useState<Record<string, string>>({});
  const [pestImage, setPestImage] = useState<string | null>(null); // Keep state for display
  const [pestPrediction, setPestPrediction] = useState<string | null>(null);
  const [pestLoading, setPestLoading] = useState<boolean>(false);
  const [pestError, setPestError] = useState<string | null>(null);
  const pestFileInputRef = useRef<HTMLInputElement>(null);

  // State for Disease Prediction
  const [diseaseModelSession, setDiseaseModelSession] = useState<ort.InferenceSession | null>(null);
  const [diseaseLabels, setDiseaseLabels] = useState<Record<string, string>>({});
  const [diseaseImage, setDiseaseImage] = useState<string | null>(null); // Keep state for display
  const [diseasePrediction, setDiseasePrediction] = useState<string | null>(null);
  const [diseaseLoading, setDiseaseLoading] = useState<boolean>(false);
  const [diseaseError, setDiseaseError] = useState<string | null>(null);
  const diseaseFileInputRef = useRef<HTMLInputElement>(null);

  // Model and Label Loading Effect
  useEffect(() => {
    const loadModelsAndLabels = async () => {
      try {
        setPestLoading(true);
        setDiseaseLoading(true);
        setPestError(null);
        setDiseaseError(null);

        const pestModelPromise = ort.InferenceSession.create('/models/pest_detection.onnx');
        const pestLabelsPromise = fetch('/models/pest_detection_labels.yaml').then(res => res.text());
        const diseaseModelPromise = ort.InferenceSession.create('/models/disease_prediction.onnx');
        const diseaseLabelsPromise = fetch('/models/disease_labels.json').then(res => res.json());

        const [pestSession, pestYaml, diseaseSession, diseaseJson] = await Promise.all([
          pestModelPromise,
          pestLabelsPromise,
          diseaseModelPromise,
          diseaseLabelsPromise
        ]);

        setPestModelSession(pestSession);
        setPestLabels(yaml.load(pestYaml) as Record<string, string>);
        setPestLoading(false);

        setDiseaseModelSession(diseaseSession);
        setDiseaseLabels(diseaseJson);
        setDiseaseLoading(false);

      } catch (error) {
        console.error("Error loading models or labels:", error);
        const errorMsg = t('features.agrivision.errors.loadFailed');
        setPestError(errorMsg);
        setDiseaseError(errorMsg);
        setPestLoading(false);
        setDiseaseLoading(false);
      }
    };
    loadModelsAndLabels();
  }, [t]);

  // Image Preprocessing - Handles both NCHW and NHWC formats
  const preprocessImage = async (
      imageUrl: string,
      targetWidth: number,
      targetHeight: number,
      outputFormat: TensorFormat // Added parameter for format
    ): Promise<ort.Tensor> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const { data } = imageData; // Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]
        const numPixels = targetWidth * targetHeight;
        const float32Data = new Float32Array(numPixels * 3);

        if (outputFormat === 'NCHW') {
          // NCHW: [1, 3, H, W]
          const R = new Float32Array(numPixels);
          const G = new Float32Array(numPixels);
          const B = new Float32Array(numPixels);
          for (let i = 0; i < numPixels; i++) {
            R[i] = data[i * 4 + 0] / 255.0;
            G[i] = data[i * 4 + 1] / 255.0;
            B[i] = data[i * 4 + 2] / 255.0;
          }
          float32Data.set(R, 0);
          float32Data.set(G, numPixels);
          float32Data.set(B, numPixels * 2);
          const tensor = new ort.Tensor('float32', float32Data, [1, 3, targetHeight, targetWidth]);
          resolve(tensor);
        } else if (outputFormat === 'NHWC') {
          // NHWC: [1, H, W, 3]
          for (let i = 0; i < numPixels; i++) {
            const j = i * 4; // Index for RGBA data
            const k = i * 3; // Index for RGB float data
            float32Data[k + 0] = data[j + 0] / 255.0; // R
            float32Data[k + 1] = data[j + 1] / 255.0; // G
            float32Data[k + 2] = data[j + 2] / 255.0; // B
          }
          const tensor = new ort.Tensor('float32', float32Data, [1, targetHeight, targetWidth, 3]);
          resolve(tensor);
        } else {
            reject(new Error(`Unsupported output format: ${outputFormat}`));
        }
      };
      img.onerror = (err) => {
        reject(new Error(`Failed to load image for preprocessing: ${err}`));
      };
      img.src = imageUrl;
    });
  };

  // Prediction Logic - Accepts format for preprocessing
  const runPrediction = useCallback(async (
    session: ort.InferenceSession | null,
    imageUrlForPrediction: string | null,
    labels: Record<string, string>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setPrediction: React.Dispatch<React.SetStateAction<string | null>>,
    modelInputName: string,
    modelOutputName: string,
    tensorFormat: TensorFormat // Added format parameter
  ) => {
    setError(null);
    setPrediction(null);

    if (!session) {
        console.error("Prediction attempted before model session was loaded.");
        setError(t('features.agrivision.errors.modelNotLoaded'));
        setLoading(false);
        return;
    }
    if (!imageUrlForPrediction) {
        console.error("Prediction attempted without a valid image URL passed.");
        setError(t('features.agrivision.errors.missingModelOrImage'));
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
      // Determine model input dimensions (assuming they are available in the session)
      // Fallback dimensions if not available
      // Determine model input dimensions (assuming they are available in the session)
      // Fallback dimensions if not available
      let targetWidth = 224;
      let targetHeight = 224;
      // Add check for session.inputs existence
      if (session.inputNames.length > 0 && session.inputs) {
          const inputMeta = session.inputs.find(i => i.name === modelInputName);
          if (inputMeta && inputMeta.dims.length === 4) {
              // Assuming NCHW [batch, channels, height, width] or NHWC [batch, height, width, channels]
              if (tensorFormat === 'NCHW') {
                  // Ensure dims are positive numbers
                  targetHeight = inputMeta.dims[2] > 0 ? inputMeta.dims[2] : 224;
                  targetWidth = inputMeta.dims[3] > 0 ? inputMeta.dims[3] : 224;
              } else { // NHWC
                  targetHeight = inputMeta.dims[1] > 0 ? inputMeta.dims[1] : 224;
                  targetWidth = inputMeta.dims[2] > 0 ? inputMeta.dims[2] : 224;
              }
              console.log(`Using model input dimensions: ${targetWidth}x${targetHeight}`);
          } else {
              console.warn(`Could not determine input dimensions from model metadata for input '${modelInputName}'. Using default ${targetWidth}x${targetHeight}.`);
          }
      }

      // Pass the required format and dimensions to preprocessing
      const tensor = await preprocessImage(imageUrlForPrediction, targetWidth, targetHeight, tensorFormat);

      const feeds: Record<string, ort.Tensor> = { [modelInputName]: tensor };
      const results = await session.run(feeds);
      const outputTensor = results[modelOutputName];

      if (!outputTensor || !outputTensor.data) {
          console.error("Output tensor or its data is missing. Expected:", modelOutputName, "Got:", Object.keys(results));
          throw new Error("Invalid model output structure.");
      }

      // --- Model Specific Output Processing ---
      if (modelInputName === 'images') { // Pest Detection Model (Object Detection)
          console.log("--- Pest Model Output ---");
          console.log("Dims:", outputTensor.dims);
          console.log("Data Len:", outputTensor.data.length);

          // Use the 'labels' parameter passed to the function (Record<string, string>)
          const pestLabels = labels; // Rename for clarity within this block
          const numClasses = Object.keys(pestLabels).length;
          const numPredictions = outputTensor.dims[2]; // e.g., 1029
          const numElementsPerPrediction = outputTensor.dims[1]; // e.g., 9 (cx, cy, w, h, prob_class0, ...)

          // Basic validation
          if (outputTensor.dims.length !== 3 || outputTensor.dims[0] !== 1) {
               throw new Error(`Unexpected output tensor dimensions: ${outputTensor.dims}`);
          }
           // Check if numElements matches expected format (4 bbox + numClasses)
           // Allow flexibility if format is slightly different, but log a warning.
           if (numElementsPerPrediction < 4 + numClasses) {
                console.warn(`Output tensor elements per prediction (${numElementsPerPrediction}) is less than expected (4 bbox + ${numClasses} classes). Results might be incomplete.`);
           } else if (numElementsPerPrediction > 4 + numClasses) {
                console.warn(`Output tensor elements per prediction (${numElementsPerPrediction}) is more than expected (4 bbox + ${numClasses} classes). Assuming format [cx, cy, w, h, class0_score, ..., classN_score] and ignoring extra values.`);
           }


          const confidenceThreshold = 0.5;
          const iouThreshold = 0.45;
          const detections: Array<{ box: number[], score: number, classIndex: number }> = [];
          const outputData = outputTensor.data as Float32Array;

          for (let i = 0; i < numPredictions; i++) {
              const offset = i * numElementsPerPrediction;
              const bbox = Array.from(outputData.slice(offset, offset + 4)); // [cx, cy, w, h]
              // Slice only the expected number of class scores (raw logits/scores)
              const rawClassScores = Array.from(outputData.slice(offset + 4, offset + 4 + numClasses));

              let maxProbability = 0;
              let classIndex = -1;
              for (let j = 0; j < numClasses; j++) {
                  // Apply sigmoid to get probability from raw score
                  const probability = sigmoid(rawClassScores[j] ?? 0);
                  if (probability > maxProbability) {
                      maxProbability = probability;
                      classIndex = j; // Use the index directly
                  }
              }

              // Use the max *probability* for thresholding and storing
              if (maxProbability > confidenceThreshold && classIndex !== -1) {
                  // Store the probability (0-1 range) as the score
                  detections.push({ box: bbox, score: maxProbability, classIndex: classIndex });
              }
          }

          const finalDetections = nonMaximumSuppression(detections, iouThreshold);

          // Format results for display/use
          const processedResults = finalDetections.map(det => {
              const [cx, cy, w, h] = det.box;
              // Convert relative cx,cy,w,h to absolute x1,y1,x2,y2 based on PREPROCESSED image size
              const x1 = Math.max(0, Math.round((cx - w / 2) * targetWidth));
              const y1 = Math.max(0, Math.round((cy - h / 2) * targetHeight));
              const x2 = Math.min(targetWidth, Math.round((cx + w / 2) * targetWidth));
              const y2 = Math.min(targetHeight, Math.round((cy + h / 2) * targetHeight));
              // Use the labels Record with the class index as string key
              const labelName = pestLabels[det.classIndex.toString()] || `Unknown Class ${det.classIndex}`;
              return {
                  label: labelName,
                  confidence: det.score,
                  box: [x1, y1, x2, y2] // Format: [left, top, right, bottom] relative to processed image size
              };
          });

          console.log("Processed Pest Detections:", processedResults);

          // Update state using setPrediction
          if (processedResults.length > 0) {
              // Display only the top prediction label
              const topDetection = processedResults[0]; // NMS sorts by score
              setPrediction(topDetection.label);
              // TODO: Need a way to pass 'processedResults' array to the UI for drawing boxes
          } else {
              setPrediction(t('features.agrivision.prediction.noDetection'));
          }
          setError(null); // Clear errors on success

      } else { // Disease Classification Model (or other non-pest models)
          console.log("--- Classification Model Output ---");
          console.log("Dims:", outputTensor.dims);
          console.log("Data Len:", outputTensor.data.length);

          const probabilities = outputTensor.data as Float32Array;
          let maxProb = 0;
          let maxIndex = -1;

          for (let i = 0; i < probabilities.length; i++) {
              if (probabilities[i] > maxProb) {
                  maxProb = probabilities[i];
                  maxIndex = i;
              }
          }

          // Use the 'labels' parameter (Record<string, string>)
          const diseaseLabels = labels; // Rename for clarity
          const predictedLabel = diseaseLabels[maxIndex.toString()];

          if (maxIndex !== -1 && predictedLabel) {
              const confidenceThreshold = 0.5; // Can be different for classification
              if (maxProb >= confidenceThreshold) {
                  setPrediction(`${predictedLabel} (${(maxProb * 100).toFixed(1)}%)`);
              } else {
                  setPrediction(`${t('features.agrivision.prediction.lowConfidence')}: ${predictedLabel} (${(maxProb * 100).toFixed(1)}%)`);
              }
          } else {
              console.warn(`Max index ${maxIndex} not found in disease labels or invalid.`);
              setPrediction(t('features.agrivision.prediction.unknown'));
          }
           setError(null); // Clear errors on success
      }
      // --- End Model Specific Output Processing ---

    } catch (error) {
      console.error("Prediction error:", error);
      if (error instanceof Error && error.message.includes("Got invalid dimensions")) {
          setError("Error: Image data shape doesn't match model input. Check preprocessing.");
      } else if (error instanceof Error && error.message.includes("is missing in 'feeds'")) {
          const missingInput = error.message.split("'")[1] || modelInputName;
          setError(`Error: Input name mismatch. Model expects '${missingInput}'. Check model details.`);
      } else if (error instanceof Error && error.message.includes("Invalid model output structure")) {
          setError(`Error: Model output name '${modelOutputName}' might be incorrect or output processing failed. Check model details and output processing logic.`);
      }
       else {
          setError(t('features.agrivision.errors.predictionFailed'));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Event Handlers
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<string | null>>,
    setErrorState: React.Dispatch<React.SetStateAction<string | null>>,
    predictionRunner: (imageUrl: string) => void,
    modelSession: ort.InferenceSession | null
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setImageState(imageDataUrl);

        if (modelSession) {
            predictionRunner(imageDataUrl);
        } else {
          console.warn("Model not loaded yet when image was selected.");
          setErrorState(t('features.agrivision.errors.modelNotLoaded'));
        }
      };
      reader.onerror = () => {
          console.error("Error reading file");
          setErrorState(t('features.agrivision.errors.fileReadError'));
          setImageState(null);
      }
      reader.readAsDataURL(file);
    }
     if (event.target) {
        event.target.value = '';
     }
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  // Specific prediction runners - Using correct names and formats
  const runPestModel = useCallback((imageUrl: string) => {
    runPrediction(
        pestModelSession,
        imageUrl,
        pestLabels,
        setPestLoading,
        setPestError,
        setPestPrediction,
        'images',  // Input Name for Pest Model
        'output0', // Correct Output Name for Pest Model
        'NCHW'     // Tensor Format for Pest Model
    );
  }, [pestModelSession, pestLabels, runPrediction]);

  const runDiseaseModel = useCallback((imageUrl: string) => {
    runPrediction(
        diseaseModelSession,
        imageUrl,
        diseaseLabels,
        setDiseaseLoading,
        setDiseaseError,
        setDiseasePrediction,
        'input',         // Input Name for Disease Model
        'dense_1',       // Correct Output Name for Disease Model
        'NHWC'           // Tensor Format for Disease Model
    );
  }, [diseaseModelSession, diseaseLabels, runPrediction]);


  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-e-green">Agri</span>Vision
          </h1>
          <p className="text-xl text-gray-300 text-center mb-10 max-w-3xl mx-auto">
            {t('features.agrivision.pageSubtitle')}
          </p>
          <div className="text-center mb-10">
            <Button
              onClick={() => window.open('/slam_visualizer.html', '_blank')}
              className="bg-e-green hover:bg-e-green/90 text-e-dark font-semibold"
            >
              {t('features.agrivision.viewSlamButton')}
            </Button>
          </div>
        </motion.div>

        {/* Drone Live Feed Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Camera className="mr-2 text-e-green" /> {t('features.agrivision.droneFeed')}
          </h2>
          <div className="bg-e-dark-accent rounded-xl overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
                    alt="Farm Aerial View"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
                  <Badge variant="outline" className="bg-black/50 text-white">{t('features.agrivision.liveBadge')}</Badge>
                  <Badge variant="outline" className="bg-black/50 text-white">{t('features.agrivision.droneBadge', { droneNumber: 1 })}</Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge variant="outline" className="bg-black/50 text-white">{t('features.agrivision.fieldBadge', { fieldNumber: 3, location: 'Northeast Corner' })}</Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pest Detection Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Bug className="mr-2 text-e-green" /> {t('features.agrivision.pestDetection')}
            </h2>
            <Button
              onClick={() => triggerFileInput(pestFileInputRef)}
              disabled={!pestModelSession}
              className="flex items-center gap-2 bg-e-green hover:bg-e-green/90 text-e-dark"
            >
              <Upload className="h-4 w-4" /> {t('features.agrivision.uploadImageButton')}
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={pestFileInputRef}
              onChange={(e) => handleImageChange(e, setPestImage, setPestError, runPestModel, pestModelSession)}
              className="hidden"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Preview Card */}
            <Card className="bg-e-dark-accent text-white border-gray-800">
              <CardHeader>
                <CardTitle>{t('features.agrivision.imagePreviewCard.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-black/40 rounded-md flex items-center justify-center overflow-hidden">
                  {pestImage ? (
                    <img
                      src={pestImage}
                      alt={t('features.agrivision.imagePreviewCard.pestAlt')}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src="/pest-image.jpg"
                      alt={t('features.agrivision.imagePreviewCard.pestAlt')}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Result Card */}
            <Card className="bg-e-dark-accent text-white border-gray-800">
              <CardHeader>
                <CardTitle>{t('features.agrivision.predictionResultCard.title')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                {pestLoading && (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-e-green" />
                    <p>{t('features.agrivision.prediction.loading')}</p>
                  </div>
                )}
                {pestError && (
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle className="h-8 w-8" />
                    <p className="text-center">{pestError}</p>
                     {pestError === t('features.agrivision.errors.loadFailed') && !pestModelSession &&
                       <p className="text-xs mt-1">{t('features.agrivision.errors.modelNotLoaded')}</p>}
                  </div>
                )}
                {!pestLoading && !pestError && pestPrediction && (
                  <div className="text-center">
                     {/* Note: This display logic assumes classification. Pest detection output needs different handling. */}
                     {pestPrediction.toLowerCase().includes('healthy') || pestPrediction === t('features.agrivision.prediction.noDetection') || pestPrediction.startsWith("Pest model ran") ? (
                       <BugOff className="h-10 w-10 text-green-500 mx-auto mb-2" />
                     ) : (
                       <Bug className="h-10 w-10 text-red-500 mx-auto mb-2" />
                     )}
                    <p className="text-lg font-semibold">{pestPrediction}</p>
                  </div>
                )}
                 {!pestLoading && !pestError && !pestPrediction && !pestImage && (
                   <p className="text-gray-400 text-center">{t('features.agrivision.prediction.prompt')}</p>
                 )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Disease Prediction Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Leaf className="mr-2 text-e-green" /> {t('features.agrivision.diseasePrediction')}
            </h2>
            <Button
              onClick={() => triggerFileInput(diseaseFileInputRef)}
              disabled={!diseaseModelSession}
              className="flex items-center gap-2 bg-e-green hover:bg-e-green/90 text-e-dark"
            >
              <Upload className="h-4 w-4" /> {t('features.agrivision.uploadImageButton')}
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={diseaseFileInputRef}
              onChange={(e) => handleImageChange(e, setDiseaseImage, setDiseaseError, runDiseaseModel, diseaseModelSession)}
              className="hidden"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Preview Card */}
            <Card className="bg-e-dark-accent text-white border-gray-800">
              <CardHeader>
                <CardTitle>{t('features.agrivision.imagePreviewCard.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-black/40 rounded-md flex items-center justify-center overflow-hidden">
                  {diseaseImage ? (
                    <img
                      src={diseaseImage}
                      alt={t('features.agrivision.imagePreviewCard.diseaseAlt')}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src="/disease leave.jpg"
                      alt={t('features.agrivision.imagePreviewCard.diseaseAlt')}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Result Card */}
            <Card className="bg-e-dark-accent text-white border-gray-800">
              <CardHeader>
                <CardTitle>{t('features.agrivision.predictionResultCard.title')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                {diseaseLoading && (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-e-green" />
                    <p>{t('features.agrivision.prediction.loading')}</p>
                  </div>
                )}
                {diseaseError && (
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle className="h-8 w-8" />
                    <p className="text-center">{diseaseError}</p>
                     {diseaseError === t('features.agrivision.errors.loadFailed') && !diseaseModelSession &&
                       <p className="text-xs mt-1">{t('features.agrivision.errors.modelNotLoaded')}</p>}
                  </div>
                )}
                {!diseaseLoading && !diseaseError && diseasePrediction && (
                   <div className="text-center">
                     {diseasePrediction.toLowerCase().includes('healthy') || diseasePrediction === t('features.agrivision.prediction.noDetection') ? (
                       <Leaf className="h-10 w-10 text-green-500 mx-auto mb-2" />
                     ) : (
                       <Leaf className="h-10 w-10 text-red-500 mx-auto mb-2" />
                     )}
                    <p className="text-lg font-semibold">{diseasePrediction}</p>
                  </div>
                )}
                 {!diseaseLoading && !diseaseError && !diseasePrediction && !diseaseImage && (
                   <p className="text-gray-400 text-center">{t('features.agrivision.prediction.prompt')}</p>
                 )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-16">{t('features.agrivision.featuresSection.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('features.agrivision.featuresSection.cropHealth.title'),
                description: t('features.agrivision.featuresSection.cropHealth.description'),
                icon: <Eye className="h-10 w-10 text-e-green mb-4" />
              },
              {
                title: t('features.agrivision.featuresSection.growthTracking.title'),
                description: t('features.agrivision.featuresSection.growthTracking.description'),
                icon: <LineChart className="h-10 w-10 text-e-green mb-4" />
              },
              {
                title: t('features.agrivision.featuresSection.yieldPrediction.title'),
                description: t('features.agrivision.featuresSection.yieldPrediction.description'),
                icon: <Brain className="h-10 w-10 text-e-green mb-4" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="bg-e-dark-accent p-8 rounded-lg text-center hover:bg-e-dark-accent/70 transition-colors"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriVision;
