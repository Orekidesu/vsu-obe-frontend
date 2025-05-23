import React from "react";
import { Files, ClipboardList } from "lucide-react";

const AllSyllabiPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Assigned Syllabi
        </h1>

        <div className="my-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-blue-700 mb-2 font-medium">Coming Soon</p>
          <p className="text-gray-600">
            The syllabi management feature is currently under development and
            will be available shortly.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 border rounded-md">
            <Files className="text-gray-500 mr-3" size={20} />
            <span className="text-sm text-gray-600">
              Browse all assigned courses syllabi
            </span>
          </div>
          <div className="flex items-center p-3 border rounded-md">
            <ClipboardList className="text-gray-500 mr-3" size={20} />
            <span className="text-sm text-gray-600">Manage course content</span>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Check back soon for updates or contact the administrator for more
          information.
        </p>
      </div>
    </div>
  );
};

export default AllSyllabiPage;
