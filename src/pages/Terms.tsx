import React from "react";
import { useNavigate } from "react-router-dom";

const Terms: React.FC = () => {
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
          नियम एवं शर्तें
        </h1>
      </div>

      <div className="px-4 pt-6 pb-10">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 leading-relaxed space-y-5">

          <p className="text-sm text-gray-500 text-right">Last updated: 17 November 2025</p>

          <p>
            HareHare (“App”) का संचालन <b>Mediarun Digital</b> द्वारा किया जाता है।  
            नीचे दिए गए Terms & Conditions (“Terms”) App के उपयोग पर लागू होते हैं।  
            इंग्लिश में पूरा विवरण नीचे दिया गया है।
          </p>

          <p>
            By downloading, accessing, or using the HareHare App, you agree to follow and
            be bound by these Terms. If you do not agree, please stop using the App immediately.
          </p>

          {/* 1 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            1. Eligibility / पात्रता
          </h2>
          <p>
            App का उपयोग करने के लिए आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए।
          </p>
          <p>
            You must be 10 years or older to use HareHare and be legally capable of entering agreements.
          </p>

          {/* 2 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            2. Account Registration / खाता पंजीकरण
          </h2>

          <p>खाता बनाने के लिए आपको सही जानकारी देनी होगी।</p>

          <p>To use the App, you may need to register an account by providing accurate details such as:</p>

          <ul className="list-disc ml-5 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Mobile number</li>
          </ul>

          <p>Users are responsible for keeping login details confidential and updated.</p>

          <p>
            We may suspend or terminate accounts providing false information or violating these Terms.
          </p>

          {/* 3 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            3. Use of the App / ऐप का उपयोग
          </h2>

          <p>Users agree not to:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Use the App for illegal, abusive, hateful, or fraudulent activities</li>
            <li>Hack, reverse-engineer, spam, or disrupt the App</li>
            <li>Copy or distribute App content without permission</li>
          </ul>

          <p>App का गलत या अवैध उपयोग पूरी तरह से प्रतिबंधित है।</p>

          {/* 4 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            4. AI Interpretation Disclaimer / AI धार्मिक व्याख्या अस्वीकरण
          </h2>

          <p>
            HareHare एक AI-based devotional guidance ऐप है। यहाँ दी गई बातों का उद्देश्य केवल
            आध्यात्मिक और सूचनात्मक है।
          </p>

          <p>
            HareHare is an AI-driven platform providing content based on scriptures and traditional literature.  
            It does NOT provide professional, legal, medical, financial, psychological, or religious authority-level advice.
          </p>

          <p>
            Users must not make important life decisions based solely on App responses.  
            The Company is not responsible for outcomes arising from such decisions.
          </p>

          {/* 5 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            5. Privacy / गोपनीयता
          </h2>

          <p>
            आपकी व्यक्तिगत जानकारी हमारी Privacy Policy के अनुसार सुरक्षित रहती है।  
            By using the App, you also agree to the Privacy Policy.
          </p>

          {/* 6 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            6. Data & Conversations / निजी वार्तालाप
          </h2>

          <p>
            App के अंदर की सभी बातचीत गोपनीय होती है — यहाँ तक कि Mediarun Digital भी उन्हें नहीं देख सकता।
          </p>

          <p>
            Users must not send abusive, threatening, harmful, or illegal messages.
          </p>

          {/* 7 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            7. Third-Party Services / तृतीय-पक्ष सेवाएँ
          </h2>

          <p>The App may show ads or link to third-party services. We do not:</p>

          <ul className="list-disc ml-5 space-y-1">
            <li>Endorse third-party websites or content</li>
            <li>Guarantee accuracy of advertisements</li>
            <li>Take responsibility for services provided by external partners</li>
          </ul>

          <p>Third-party interactions are entirely at your own risk.</p>

          {/* 8 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            8. Intellectual Property / बौद्धिक संपदा
          </h2>

          <p>
            App की सभी सामग्री, डिज़ाइन, लोगो, फीचर्स, सॉफ़्टवेयर और ब्रांडिंग  
            Mediarun Digital की संपत्ति है।  
            Users may not copy, modify, or redistribute without written permission.
          </p>

          {/* 9 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            9. Limitation of Liability / दायित्व की सीमा
          </h2>

          <p>The App is provided “as is” and “as available”. We are not responsible for:</p>

          <ul className="list-disc ml-5 space-y-1">
            <li>Financial, emotional, psychological, or personal outcomes</li>
            <li>Service issues, outages, bugs, or data loss</li>
            <li>Misuse of the App by users or third parties</li>
          </ul>

          <p>App द्वारा दी गई जानकारी पर पूरी तरह निर्भर होना आपकी अपनी जिम्मेदारी है।</p>

          {/* 10 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            10. Termination / खाता समाप्ति
          </h2>

          <p>
            नियमों के उल्लंघन पर आपका खाता निलंबित या हटा दिया जा सकता है।  
            Users may request account deletion at any time.
          </p>

          {/* 11 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            11. Changes to Terms / नियमों में बदलाव
          </h2>

          <p>
            Terms समय-समय पर अपडेट किए जा सकते हैं।  
            Updated Terms ऐप में पोस्ट किए जाने के बाद प्रभावी होंगे।
          </p>

          <p>Continued use means you accept the updated Terms.</p>

          {/* 12 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            12. Governing Law / लागू कानून
          </h2>

          <p>
            These Terms are governed by Indian Law including the Digital Personal  
            Data Protection Act (DPDP Act), 2023.
          </p>

          {/* 13 */}
          <h2 className="font-bold text-lg text-orange-700 border-l-4 border-orange-600 pl-2">
            13. Contact / संपर्क
          </h2>

          <p>
            For legal or account issues, contact us at:  
            <b> info@mediarun.co.in </b>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Terms;
