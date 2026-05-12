import axios from "axios";

export async function classifyComplaint(complaintText) {
  try {
    // console.log("Sending complaint to Python API...");

    // const response = await axios.post(
    //     "http://localhost:5000/classify",
    //     {
    //         complaint: complaintText
    //     }
    // );

    // console.log("Python API response:", response.data);

    // return response.data;
    console.log("Received complaint for classification:", complaintText);

    const response = await axios.post("http://localhost:5000/classify", {
      complaint: complaintText,
    });

    console.log(response.data);
  } catch (error) {
    console.log("Python API error:", error.message);

    return {
      success: false,
      message: "Classification failed",
    };
  }
}
