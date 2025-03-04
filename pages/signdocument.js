import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
 
export default function SignDocument() {
    const sigCanvas = useRef({});
    const router = useRouter();
    const [isSigned, setIsSigned] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
 
    const documentText = `
        Agreement Between Client and Company
        --------------------------------------
        Client Name: John Doe
        Date: March 3, 2024
 
        This agreement states that the client agrees to the terms and conditions...
        By signing below, the client confirms agreement.
    `;
 
    // Generate and Upload PDF
    const generatePDF = async () => {
        setButtonsDisabled(true); // Disable "Sign & Save" and "Clear Signature"
 
        const doc = new jsPDF();
        const element = document.getElementById("document-content");
 
        // Capture document as an image
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 180, 0);
 
        // Capture Signature
        const signatureData = sigCanvas.current.toDataURL("image/png");
        doc.addImage(signatureData, "PNG", 10, 250, 100, 30);
 
        // Convert to Blob & Upload
        const pdfBlob = doc.output("blob");
        await uploadToSupabase(pdfBlob);
    };
 
    // Upload Signed PDF to Supabase
    const uploadToSupabase = async (pdfBlob) => {
        const fileName = `signed-documents/user-12345-${Date.now()}.pdf`;
        const { data, error } = await supabase.storage
            .from("signed-documents")
            .upload(fileName, pdfBlob, { contentType: "application/pdf" });
 
        if (error) {
            console.error("Upload error:", error);
            setUploadMessage("Failed to upload signed document.");
            setButtonsDisabled(false); // Re-enable buttons if upload fails
        } else {
            console.log("Uploaded:", data);
            setUploadMessage("Signed document uploaded successfully!");
            setIsSigned(true); // Enable "Download" and "Next to Payment"
        }
    };
 
    // Download the Signed Document Locally
    const downloadDocument = async () => {
        const doc = new jsPDF();
        const element = document.getElementById("document-content");
 
        // Capture the document as an image
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 180, 0);
        doc.save("signed-document.pdf");
    };
 
    return (
<div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
<h2 className="text-xl font-bold mb-4">Review & Sign Document</h2>
 
            {/* Display Document */}
<div id="document-content" className="w-full max-w-lg p-4 border rounded-md bg-white shadow-md">
<p className="text-gray-700 whitespace-pre-line">{documentText}</p>
</div>
 
            {/* Signature Pad */}
<SignatureCanvas ref={sigCanvas} penColor="black"
                canvasProps={{ width: 400, height: 150, className: "border border-gray-500 mt-4" }} />
 
            {/* Buttons Before Signing */}
            {!isSigned && (
<div className="mt-4">
<button 
                        className={`bg-green-600 text-white p-2 rounded mr-2 ${buttonsDisabled ? "opacity-50 cursor-not-allowed" : ""}`} 
                        onClick={generatePDF}
                        disabled={buttonsDisabled}
>
                        Sign & Save
</button>
<button 
                        className={`bg-red-600 text-white p-2 rounded ${buttonsDisabled ? "opacity-50 cursor-not-allowed" : ""}`} 
                        onClick={() => sigCanvas.current.clear()}
                        disabled={buttonsDisabled}
>
                        Clear Signature
</button>
</div>
            )}
 
            {/* Buttons After Signing */}
            {isSigned && (
<div className="mt-4 flex space-x-4">
<button className="bg-blue-600 text-white p-2 rounded" onClick={downloadDocument}>
                        Download Signed Document
</button>
<button className="bg-green-600 text-white p-2 rounded" onClick={() => router.push("/payment")}>
                        Next to Payment
</button>
</div>
            )}
 
            {/* Upload Status */}
            {uploadMessage && <p className="mt-2 text-blue-600">{uploadMessage}</p>}
</div>
    );
}