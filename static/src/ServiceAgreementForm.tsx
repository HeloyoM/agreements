
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import jsPDF from 'jspdf';

export const ServiceAgreementForm = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        projectPrice: '',
        projectStart: '',
        projectEnd: '',
    });

    const sigCanvasRef = useRef<SignatureCanvas | null>(null);

    const handleChange = (e: any) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClearSignature = () => {
        sigCanvasRef.current?.clear();
    };

    const handleDownload = () => {
        const pdf = new jsPDF();
        pdf.setFontSize(14);
        pdf.text("Service Agreement", 20, 20);
        pdf.text(`Client Name: ${formData.clientName}`, 20, 40);
        pdf.text(`Email: ${formData.clientEmail}`, 20, 50);
        pdf.text(`Project Price: ₪${formData.projectPrice}`, 20, 60);
        pdf.text(`Start Date: ${formData.projectStart}`, 20, 70);
        pdf.text(`End Date: ${formData.projectEnd}`, 20, 80);
        pdf.text(`Signed:`, 20, 100);

        // const signatureImg = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        // pdf.addImage(signatureImg, 'PNG', 20, 105, 100, 40);

        if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            const signatureImage = sigCanvasRef.current?.getCanvas().toDataURL('image/png');

            pdf.text('Signature:', 20, 100);
            pdf.addImage(signatureImage, 'PNG', 20, 105, 100, 40);
        }

        pdf.save('Service_Agreement.pdf');
    };

    const handleSubmit = async () => {
        if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
            alert("Please sign before submitting.");
            return;
        }
        const signatureDataUrl = sigCanvasRef.current.getCanvas().toDataURL("image/png");


        const blob = await (await fetch(signatureDataUrl)).blob();
        const file = new File([blob], "signature.png", { type: "image/png" });

        const formPayload = new FormData();
        formPayload.append("clientName", formData.clientName);
        formPayload.append("clientEmail", formData.clientEmail);
        formPayload.append("projectPrice", formData.projectPrice);
        formPayload.append("projectStart", formData.projectStart);
        formPayload.append("projectEnd", formData.projectEnd);
        formPayload.append("signature", file);

        try {
            const response = await fetch("http://localhost:3001/api/submit-form", {
                method: "POST",
                body: formPayload,
            });

            if (response.ok) {
                alert("Agreement submitted successfully!");
            } else {
                alert("Submission failed.");
            }
        } catch (err) {
            console.error("Error submitting:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }} elevation={3}>
            <Typography variant="h5" gutterBottom>
                Service Agreement
            </Typography>
            <TextField
                label="Client Name"
                name="clientName"
                fullWidth
                margin="normal"
                value={formData.clientName}
                onChange={handleChange}
            />
            <TextField
                label="Client Email"
                name="clientEmail"
                fullWidth
                margin="normal"
                value={formData.clientEmail}
                onChange={handleChange}
            />
            <TextField
                label="Project Price (₪)"
                name="projectPrice"
                fullWidth
                margin="normal"
                value={formData.projectPrice}
                onChange={handleChange}
            />
            <TextField
                label="Start Date"
                name="projectStart"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formData.projectStart}
                onChange={handleChange}
            />
            <TextField
                label="End Date"
                name="projectEnd"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formData.projectEnd}
                onChange={handleChange}
            />

            <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                    Signature
                </Typography>
                <SignatureCanvas
                    ref={sigCanvasRef}
                    canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
                    backgroundColor="#f5f5f5"
                    penColor="black"
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearSignature}
                    sx={{ mt: 1 }}
                >
                    Clear Signature
                </Button>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 3 }}
            >
                Submit
            </Button>
        </Paper>
    );
}

export default ServiceAgreementForm;