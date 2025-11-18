import React from "react";
import { useNavigate } from "react-router-dom";

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50 text-orange-900 pb-24 relative">

      {/* Soft Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('/bg-pattern.png')] bg-cover bg-center"></div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-orange-200 flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-orange-700 font-bold text-xl">
          ←
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-orange-700">
          गोपनीयता नीति
        </h1>
      </div>

      <div className="px-4 pt-6 pb-10">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 leading-relaxed space-y-5">

          <p className="text-sm text-gray-500 text-right">Last updated: 17 November 2025</p>

          <p>
            HareHare (“App”) is owned and operated by <b>13 Path Tech</b>. This Privacy Policy explains 
            how we collect, use, store, and protect your information when using our services.
          </p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Mobile number</li>
          </ul>
          <p>Also we may collect device identifiers, cookies & usage logs.</p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Manage user accounts</li>
            <li>Improve app experience</li>
            <li>Send updates, support & notifications</li>
            <li>Provide personalised content</li>
          </ul>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            3. Conversation Privacy
          </h2>
          <p>
            All conversations inside the app are confidential and protected. Even our team cannot read your messages.
          </p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            4. Cookies & Ad Identifiers
          </h2>
          <p>Used only for analytics & relevant content delivery.</p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            5. Sharing Policy
          </h2>
          <p>No sale of personal information. Only shared with trusted secure service partners if required.</p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            6. Data Protection
          </h2>
          <p>We follow security measures & delete data upon permanent account removal.</p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            7. Your Rights
          </h2>
          <p>You may request view, edit, deletion or withdrawal anytime via support.</p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            8. Contact
          </h2>
          <p>Email: <a href="mailto:info@mediarun.co.in" className="text-blue-600 underline">info@mediarun.co.in</a></p>

          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            9. Governing Law
          </h2>
          <p>Indian Law including DPDP Act 2023 applies.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
