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
   Project-Based Consulting Agreement
 
Purpose of This Contract
This agreement outlines the terms of engagement between Business Master Consulting ("Consultant") and ISupport Commission Services Corp. ("Client"). The purpose of this contract is to define the scope, timeline, and payment terms for the consulting and development services provided by the Consultant on a project basis. This ensures clear communication, agreed-upon deliverables, and a structured approach to completing the Client’s requested work.
 
1. Scope of Work
 
The Consultant will provide development services on a project basis. The complexity of each deliverable will determine the number of hours required for completion.
 
2. Time Commitment
 
At this time, the Consultant is available to work up to 2 hours per week on the Client's project. After mid-April, additional availability can be discussed if the Client requires faster delivery.
 
3. Project Estimation & Agreement
 
After discussing the project details, the Consultant will provide an estimated number of hours required for completion.
The Client will review and confirm the estimated hours before work begins.
Once agreed, the Client must log in to the Business Master Consulting website https://businessmaster.ca to sign this contract and proceed with payment.
 
4. Payment Terms
 
For this project, the payment will be made after delivery.
The Consultant’s usual hourly rate is $300, but for the Clients with referrals from YWCA, the agreed rate is $200 per hour.
Typically, projects require 30% upfront payment, which may apply in future engagements.
 
5. Contract Execution & Development Start
 
Work will begin only after the contract is signed via the Consultant’s website.
 
6. Next Steps & Initial Project Timeline
 
Project 1:
 
Duration: 2 hours within 1 week, from March 10th to March 17th.
Amor to provide website credentials.
Bianca to verify details about domain/hosting, including database and storage availability.
Amor to share the services to be displayed after login.
Amor to provide branding details (colors, fonts) for consistency across all pages.
Communication will be via email, with a follow-up meeting on March 7th (afternoon) for approval.
If material requested from client is not delivered by March 10th, the project delivery might be delayed.
 
7. Deliverables
 
Add a Login button on the website or repurpose the existing APPLY NOW button.
Create a Login page connected to a free database with signup, login, and forgot password functionality.
Collect emails for future marketing purposes (potentially flagged for services/partnerships, but not included in this project).
Redirect login users to a services page displaying the offered services.
 
By signing below, both parties acknowledge and agree to the terms outlined in this agreement.
 
8. Signature Pad
 
A digital signature pad will be provided below for authorized representatives to sign electronically.
 
Client Name: ISupport Commission Services Corp.
 
 
Business Master Consulting
Authorized Representative: Bianca Marinho
Signature: BMarinho
Date: March 4th, 2025
 
    `;
 
    // Generate and Upload PDF
    const generatePDF = async () => {
        setButtonsDisabled(true); // Disable "Sign & Save" and "Clear Signature"
 
        const doc = new jsPDF({
            orientation: "portrait",
            unit:"mm",
            format:"a4"
        });
        const element = document.getElementById("document-content");
 
        // Capture document as an image
        const canvas = await html2canvas(element, {
            scale:1,
            scrollX:0,
            scrollY:0,
            useCORS:true
        });
        const imgData = canvas.toDataURL("image/png");
 
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
        doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
 
        // Capture Signature
        const signatureData = sigCanvas.current.toDataURL("image/png");
 
        if (signatureData) {
            doc.addImage(signatureData, "PNG", 50, imgHeight - 30, 100, 30);
        } else {
            doc.text("No signature found", 10, imgHeight -10);
 
        }
        
 
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
        const doc = new jsPDF({
            orientation:"portrait",
            unit:"mm",
            format:"a4"
        });
        const element = document.getElementById("document-content");
 
        // Capture the document as an image
        const canvas = await html2canvas(element, {
            scale:2,
            useCORS:true
        });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
        doc.addImage(imgData, "PNG", 0,0, imgWidth, imgHeight);
 
  // Capture the signature
  if (sigCanvas.current) {        
     const signatureData = sigCanvas.current.toDataURL("image/png");     
         doc.addImage(signatureData, "PNG", 50, imgHeight -45, 100, 30); // Adjust positioning  
           } else {      
               console.error("Signature pad is empty.");
            } doc.save("signed-document.pdf");
        };
 
    return (
<div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
<h2 className="text-xl font-bold mb-4">Review & Sign Document</h2>
 
            {/* Display Document */}
<div id="document-content" className="max-w-6xl mx-auto p-6 w-full">
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
 
