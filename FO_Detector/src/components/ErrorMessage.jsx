import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-full text-red-500">
      <AlertCircle className="w-6 h-6 mr-2" />
      Error: {message}
    </div>
  );
};

export default ErrorMessage;
