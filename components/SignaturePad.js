import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "../lib/supabaseClient"; // Ensure you set up Supabase
 
export default function SignaturePad({ userId, documentText }) {
    const sigCanvas = useRef({});
    const [signature, setSignature] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
 
    // Convert Data URL to Blob for Supabase Upload
    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(",")[1]);
        const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };
 
    // Generate PDF with Signature
    const generatePDF = async () => {
        const doc = new jsPDF();
        const element = document.getElementById("document-content");
 
        // Capture document as an image
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
 
        doc.addImage(imgData, "PNG", 10, 10, 180, 0);
 
        // Capture Signature as an Image
        const signatureData = sigCanvas.current.toDataURL("image/png");
        doc.addImage(signatureData, "PNG", 10, 250, 100, 30); // Adjust size & position
 
        // Convert to Blob & Upload to Supabase
        const pdfBlob = doc.output("blob");
        uploadToSupabase(pdfBlob);
    };
 
    // Upload Signed PDF to Supabase
    const uploadToSupabase = async (pdfBlob) => {
        const fileName = `signed-documents/${userId}-${Date.now()}.pdf`;
        const { data, error } = await supabase.storage
            .from("signed-documents")
            .upload(fileName, pdfBlob, { contentType: "application/pdf" });
 
        if (error) {
            console.error("Upload error:", error);
            setUploadMessage("Failed to upload signed document.");
        } else {
            console.log("Uploaded:", data);
            setUploadMessage("Signed document uploaded successfully!");
        }
    };
 
    return (
<div className="flex flex-col items-center p-4">
            {/* Display Document */}
<div id="document-content" className="border p-4 w-96 text-center bg-white">
<h2 className="text-xl font-bold">Agreement Document</h2>
<p className="text-gray-700">{documentText}</p>
</div>
 
            {/* Signature Pad */}
<SignatureCanvas ref={sigCanvas} penColor="black"
                canvasProps={{ width: 400, height: 150, className: "border border-gray-500 mt-4" }} />
 
            {/* Buttons */}
<div className="mt-4">
<button className="bg-green-600 text-white p-2 rounded mr-2" onClick={generatePDF}>
                    Sign & Save
</button>
<button className="bg-red-600 text-white p-2 rounded" onClick={() => sigCanvas.current.clear()}>
                    Clear Signature
</button>
</div>
 
            {/* Upload Status */}
            {uploadMessage && <p className="mt-2 text-blue-600">{uploadMessage}</p>}
</div>
    );
}